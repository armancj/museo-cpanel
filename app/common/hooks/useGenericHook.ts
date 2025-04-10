import { useEffect, useState, useRef } from 'react';
import { Toast, ToastMessage } from 'primereact/toast';
import { AxiosError } from 'axios';

type Service<ResponseType> = {
    fetchAll: () => Promise<ResponseType[]>;
    create: (data: ResponseType) => Promise<ResponseType>;
    update: (uuid: string, data: Partial<ResponseType>) => Promise<boolean>;
    delete: (uuid: string) => Promise<void>;
    emptyItem: ResponseType;
};

type UseGenericHookOptions<ResponseType> = {
    service: Service<ResponseType>;
    capitalizeFunc?: (value: string) => string;
    messages?: {
        createSuccess: string;
        updateSuccess: string;
        deleteSuccess: string;
        errorDefault: string;
    };
};

export const useGenericHook = <ResponseType>({
                                                 service,
                                                 capitalizeFunc = (value) => value, // Usa una función vacía si no se proporciona capitalize
                                                 messages = {
                                                     createSuccess: 'Creado satisfactoriamente',
                                                     updateSuccess: 'Actualizado satisfactoriamente',
                                                     deleteSuccess: 'Eliminado',
                                                     errorDefault: 'Ocurrió un error'
                                                 }
                                             }: UseGenericHookOptions<ResponseType>) => {
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [data, setData] = useState<ResponseType>(service.emptyItem);
    const [selects, setSelects] = useState<ResponseType[]>([]);

    const [dialog, setDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        service.fetchAll().then((data) => setSelects(data));
    }, [service]);

    const save = async (product: string = 'Nofound') => {
        console.log((data as any)?.notes);

        setSubmitted(true);
            const hasValidName = (data as any)?.name?.trim;
            const hasValidType = (data as any)?.type?.trim;
            const hasValidNameProduct = product !== 'Nofound'

        if (hasValidName || hasValidType || hasValidNameProduct) {
            let _data = [...selects];

                if (hasValidName) {
                    (data as any).name = capitalizeFunc((data as any).name);
                }

                if (hasValidType) {
                    (data as any).type = capitalizeFunc((data as any).type);
                }

            if ((data as any).uuid) {

                try {
                    const { uuid, deleted, ...updatedValues } = data as any;
                    await service.update(uuid, updatedValues);
                    const index = _data.findIndex((item) => (item as any).uuid === uuid);
                    if (index !== -1) {
                        _data[index] = data;
                        toast.current?.show({ severity: 'success', summary: messages.updateSuccess, life: 5000 });
                    }
                    setDialog(false);
                    setData(service.emptyItem);
                } catch (error) {
                    handleError(error, messages.errorDefault);
                }
            } else {
                // Crear un nuevo elemento
                try {
                    const createdItem = await service.create(data);
                    _data.push(createdItem);
                    toast.current?.show({ severity: 'success', summary: messages.createSuccess, life: 5000 });
                    setDialog(false);
                    setData(service.emptyItem);
                } catch (error) {
                    handleError(error, messages.errorDefault);
                }
            }
            setSelects(_data);
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
            const errorMessage = error?.response?.data?.message || 'Error desconocido';
            if (error.status === 400) show.detail = errorMessage;
            if (error.status === 401) show.detail = errorMessage;
            if (error.status === 409) {
                const conflictData = JSON.parse(errorMessage.replace('Conflict: ', ''));
                const conflictFields = Object.keys(conflictData);
                conflictFields.forEach(field => {
                    show.detail = `El nombre: ${conflictData[field]} ya se encuentra en el sistema.`;
                });
            }
        }
        toast.current?.show(show);
        setDialog(true);
        console.error(error);
    };

    const deleteData = async (uuid: string) => {
        try {
            await service.delete(uuid);
            const updatedItems = selects.filter((item) => (item as any).uuid !== uuid);
            setSelects(updatedItems);
            toast.current?.show({ severity: 'success', summary: messages.deleteSuccess, life: 5000 });
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: messages.errorDefault, life: 5000 });
            console.error('Error:', error);
        }
    };

    const editData = async (updatedData: Partial<ResponseType>) => {
        setData({
            ...service.emptyItem,
            ...updatedData
        });
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
};
