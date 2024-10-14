import { useEffect,  useState, useRef } from 'react';
import { Toast, ToastMessage } from 'primereact/toast';
import { AxiosError } from 'axios';
import { CountryResponse, CountryService, emptyCountry } from '@/app/service/CountryService';
import { capitalize } from '@/app/(main)/pages/util/export.functions';


export const useHookCountry = () => {


    const [deleteDialog, setDeleteDialog] = useState(false);
    const [data, setData] = useState<CountryResponse>(emptyCountry);
    const [selects, setSelects] = useState<CountryResponse[]>([]);

    const [dialog, setDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        CountryService.getCountries().then((data) => setSelects(data));
    }, []);

    const save = async () => {
        setSubmitted(true);
        if (data.name.trim()) {
            let _data = [...selects];
            data.name = capitalize(data.name);
            if (data.uuid) {

                try {
                    const {uuid, deleted, ...countryUpdated}=data;
                    await CountryService.updateCountry(data.uuid, countryUpdated);
                    const index = _data.findIndex((u) => u.uuid === data.uuid);
                    if (index !== -1) {
                        _data[index] = data;
                        toast.current?.show({ severity: 'success', summary: 'País editado satisfactoriamente', life: 5000 });
                    }
                    setDialog(false);
                } catch (error) {
                    handleError(error, 'No se pudo actualizar el País');
                }
            } else {
                // Crear nuevo usuario
                try {
                    const createdCountry = await CountryService.createCountry(data);
                    _data.push(createdCountry);
                    toast.current?.show({ severity: 'success', summary: 'País creado satisfactoriamente', life: 5000 });
                    setDialog(false);
                    setData(emptyCountry);
                } catch (error) {
                    handleError(error, 'No se pudo crear el usuario');
                }
            }
            setSelects(_data );
        }
    };

    const handleError = (error: any, defaultMessage: string) => {
        const show: ToastMessage = {
            severity: 'error',
            summary: 'Error',
            detail: defaultMessage,
            life: 5000
        };
        if (error instanceof AxiosError) {
            const errorMessage = (error.response)?.data?.message || 'failed axio';
            if (error.status === 400) show.detail = errorMessage;
            if (error.status === 401) show.detail = errorMessage;
            if (error.status === 409) {
                const conflictData = JSON.parse(errorMessage.replace('Conflict: ', ''));
                const conflictFields = Object.keys(conflictData);
                conflictFields.forEach(field => {
                    show.detail = `El nombre del país: ${conflictData[field]} ya se encuentra en el sistema.`;
                });
            }
        }
        toast.current?.show(show);
        setDialog(true);
        console.log(error);
    };


    const deleteData = async (uuid: string) => {
        try {
            await CountryService.deleteCountry(uuid);
            const updatedCountries = selects.filter(country => country.uuid !== uuid);
            setSelects(updatedCountries);
            toast.current?.show({ severity: 'success', summary: 'País Eliminado', life: 5000 });
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el País', life: 5000 });
            console.error('Error al eliminar el País:', error);
        }
    };
    const editData = async (updatedCountry: Partial<CountryResponse>) => {

        const updated: CountryResponse ={
            deleted: false,
            updatedAt: new Date(Date.now()),
            ...updatedCountry,
        } as CountryResponse;

        setData({ ...updated });
        setDialog(true);
    };



    return {
        datum: selects,
        setDatum: setSelects,
        dialog,
        setDialog,
        save,
        data,
        setData,
        submitted,
        setSubmitted,
        toast,
        deleteData,
        editData,
        deleteDialog,
        setDeleteDialog
    };
}
