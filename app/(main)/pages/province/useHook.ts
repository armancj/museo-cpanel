import { useEffect,  useState, useRef } from 'react';
import { Toast, ToastMessage } from 'primereact/toast';
import { AxiosError } from 'axios';

import { capitalize } from '@/app/(main)/pages/util/export.functions';
import { emptyProvince, ProvinceResponse, ProvinceService } from '@/app/service/ProvinceService';


export const useHook = () => {


    const [deleteDialog, setDeleteDialog] = useState(false);
    const [data, setData] = useState<ProvinceResponse>(emptyProvince);
    const [selects, setSelects] = useState<ProvinceResponse[]>([]);

    const [dialog, setDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        ProvinceService.getProvinces().then((data) => setSelects(data));
    }, []);

    const save = async () => {
        setSubmitted(true);
        if (data.name.trim()) {
            let _data = [...selects];
            data.name = capitalize(data.name);
            if (data.uuid) {

                try {
                    const {uuid, deleted, ...updated}=data;
                    await ProvinceService.updateProvince(data.uuid, updated);
                    const index = _data.findIndex((u) => u.uuid === data.uuid);
                    if (index !== -1) {
                        _data[index] = data;
                        toast.current?.show({ severity: 'success', summary: 'Editado satisfactoriamente', life: 5000 });
                    }
                    setDialog(false);
                } catch (error) {
                    handleError(error, 'No se pudo Editar');
                }
            } else {
                try {
                    const created = await ProvinceService.create(data);
                    _data.push(created);
                    toast.current?.show({ severity: 'success', summary: 'Creado Satisfactoriamente', life: 5000 });
                    setDialog(false);
                    setData(emptyProvince);
                } catch (error) {
                    handleError(error, 'No se pudo crear');
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
                    show.detail = `El nombre de la provincia: ${conflictData[field]} ya se encuentra en el sistema.`;
                });
            }
        }
        toast.current?.show(show);
        setDialog(true);
    };


    const deleteData = async (uuid: string) => {
        try {
            await ProvinceService.deleteCountry(uuid);
            const updatedCountries = selects.filter(country => country.uuid !== uuid);
            setSelects(updatedCountries);
            toast.current?.show({ severity: 'success', summary: 'País Eliminado', life: 5000 });
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el País', life: 5000 });
            console.error('Error al eliminar el País:', error);
        }
    };
    const editData = async (updatedCountry: Partial<ProvinceResponse>) => {

        const updated: ProvinceResponse ={
            deleted: false,
            updatedAt: new Date(Date.now()),
            ...updatedCountry,
        } as ProvinceResponse;

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
