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

// 🔧 Merge genérico - preserva datos del backend sin importar si tiene history o no
const smartMerge = (emptyItem: any, actualData: any): any => {
    if (!actualData) return emptyItem;
    if (!emptyItem) return actualData;

    if (actualData.uuid) {
        // Es registro existente - preservar TODOS los datos del backend
        const fillMissingFields = (target: any, source: any): any => {
            const result = { ...target };

            for (const key in source) {
                if (!(key in target)) {
                    // Campo ausente, completar del emptyItem
                    result[key] = source[key];
                } else if (
                    typeof source[key] === 'object' &&
                    source[key] !== null &&
                    !Array.isArray(source[key]) &&
                    typeof target[key] === 'object' &&
                    target[key] !== null
                ) {
                    // Objeto anidado, merge recursivo
                    result[key] = fillMissingFields(target[key], source[key]);
                }
            }
            return result;
        };

        return fillMissingFields(actualData, emptyItem);
    } else {
        // Nuevo registro - usar emptyItem como base
        return { ...emptyItem, ...actualData };
    }
};

export const useGenericHook = <ResponseType>({
                                                 service,
                                                 capitalizeFunc = (value) => value,
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

    // Tracking para manejar reseteo inteligente
    const [currentEditingUuid, setCurrentEditingUuid] = useState<string | null>(null);

    useEffect(() => {
        service.fetchAll().then((data) => setSelects(data));
    }, []);

    const refreshAllData = async () => {
        try {
            const refreshedData = await service.fetchAll();
            setSelects(refreshedData);
            return refreshedData;
        } catch (error) {
            return null;
        }
    };

    const save = async (product: string = 'Nofound') => {
        setSubmitted(true);
        const hasValidName = (data as any)?.name?.trim;
        const hasValidType = (data as any)?.type?.trim;
        const hasValidNameProduct = product !== 'Nofound'

        if (hasValidName || hasValidType || hasValidNameProduct) {
            if (hasValidName) {
                (data as any).name = capitalizeFunc((data as any).name);
            }
            if (hasValidType) {
                (data as any).type = capitalizeFunc((data as any).type);
            }

            if ((data as any).uuid) {
                // ACTUALIZACIÓN
                try {
                    const { uuid, deleted, ...updatedValues } = data as any;
                    await service.update(uuid, updatedValues);

                    // Refrescar para obtener datos actualizados (incluyendo history si existe)
                    const refreshedData = await refreshAllData();

                    if (refreshedData) {
                        const updatedRecord = refreshedData.find((item: any) => item.uuid === uuid);
                        if (updatedRecord) {
                            setData(updatedRecord);
                            setCurrentEditingUuid(uuid);
                        }
                    }

                    toast.current?.show({ severity: 'success', summary: messages.updateSuccess, life: 5000 });
                    setDialog(false);
                } catch (error) {
                    handleError(error, messages.errorDefault);
                }
            } else {
                // CREACIÓN
                try {
                    await service.create(data);
                    await refreshAllData();

                    toast.current?.show({ severity: 'success', summary: messages.createSuccess, life: 5000 });
                    setDialog(false);
                    setData(service.emptyItem);
                    setCurrentEditingUuid(null);
                } catch (error) {
                    handleError(error, messages.errorDefault);
                }
            }
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
        const incomingUuid = (updatedData as any)?.uuid;

        // Detectar cambio de registro para reseteo inteligente
        if (incomingUuid && incomingUuid !== currentEditingUuid) {
            setCurrentEditingUuid(incomingUuid);
        } else if (!incomingUuid) {
            setCurrentEditingUuid(null);
        }

        // Merge inteligente que funciona con o sin history
        const finalData = smartMerge(service.emptyItem, updatedData) as ResponseType;

        setData(finalData);
    };

    const closeDialog = () => {
        setDialog(false);
        setData(service.emptyItem);
        setCurrentEditingUuid(null);
        setSubmitted(false);
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
        setDeleteDialog,
        closeDialog
    };
};
