import { useEffect, useState, useRef } from 'react';
import { Toast, ToastMessage } from 'primereact/toast';
import { AxiosError } from 'axios';
import { capitalize } from '@/app/(main)/pages/util/export.functions';
import { emptyInstitution, InstitutionResponse, InstitutionService } from '@/app/service/InstitutionService';

export const useInstitutionHook = () => {
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [data, setData] = useState<InstitutionResponse>(emptyInstitution);
    const [selects, setSelects] = useState<InstitutionResponse[]>([]);
    const [dialog, setDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef<Toast>(null);
    const [multipleDeleteDialog, setMultipleDeleteDialog] = useState(false);

    useEffect(() => {
        InstitutionService.getInstitutions().then((data) => setSelects(data));
    }, []);

    const save = async () => {
        setSubmitted(true);

        // ✅ Campos requeridos CORREGIDOS - usar los nombres exactos que tienes en el formulario
        const requiredFields = [
            'name',
            'street',
            'number',
            'referenceCode',
            'betweenStreet1',
            'betweenStreet2',
            'district',
            'locality',
            'province',
            'municipality', // 🔧 Cambiar de 'municipal' a 'municipality' según tu modelo
            'country',  // 🔧 Cambiar de 'country' a 'nationality' según tu formulario
            'phone1',
            'phone2',
            'email',
            'website',
            'institutionType',
            'classification',
            'typology',
            'category'
        ];

        // ✅ Validación mejorada con logs para debug
        const invalidFields = requiredFields.filter(field => {
            const value = data[field as keyof InstitutionResponse];
            const isValid = value && value.toString().trim() !== '';

            // 🐛 Log para debug - quitar después
            if (!isValid) {
                console.log(`❌ Campo inválido: ${field}, valor:`, value);
            }

            return !isValid;
        });

        if (invalidFields.length === 0) {
            // ✅ Todos los campos válidos, proceder a guardar
            let _data = [...selects];
            data.name = capitalize(data.name);

            if (data.uuid) {
                try {
                    const { uuid, deleted, ...updated } = data;
                    await InstitutionService.updateInstitution(data.uuid, updated);
                    const index = _data.findIndex((u) => u.uuid === data.uuid);
                    if (index !== -1) {
                        _data[index] = data;
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Editado satisfactoriamente',
                            life: 5000
                        });
                    }
                    setDialog(false);
                    setSubmitted(false); // 🔧 Reset submitted after success
                } catch (error) {
                    handleError(error, 'No se pudo Editar');
                }
            } else {
                try {
                    const created = await InstitutionService.create(data);
                    _data.push(created);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Creado Satisfactoriamente',
                        life: 5000
                    });
                    setDialog(false);
                    setData(emptyInstitution);
                    setSubmitted(false); // 🔧 Reset submitted after success
                } catch (error) {
                    handleError(error, 'No se pudo crear');
                }
            }
            setSelects(_data);
        } else {
            // ❌ Campos faltantes
            toast.current?.show({
                severity: 'error',
                summary: 'Error de validación',
                detail: `Por favor complete los campos requeridos: ${invalidFields.join(', ')}`,
                life: 5000,
            });
        }
    };

    // ... resto del código igual ...

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
                    show.detail = `El nombre de la institución: ${conflictData[field]} ya se encuentra en el sistema.`;
                });
            }
        }
        toast.current?.show(show);
        setDialog(true);
    };

    const deleteData = async (uuid: string) => {
        try {
            await InstitutionService.deleteInstitution(uuid);
            const updatedInstitutions = selects.filter(institution => institution.uuid !== uuid);
            setSelects(updatedInstitutions);
            toast.current?.show({ severity: 'success', summary: 'Institución Eliminada', life: 5000 });
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la Institución', life: 5000 });
            console.error('Error al eliminar la Institución:', error);
        }
    };

    const editData = async (updatedInstitution: Partial<InstitutionResponse>) => {
        const updated: InstitutionResponse = {
            deleted: false,
            updatedAt: new Date(Date.now()),
            ...updatedInstitution,
        } as InstitutionResponse;

        setData({ ...updated });
        setDialog(true);
        setSubmitted(false); // 🔧 Reset submitted when opening for edit
    };

    const deleteSelected = async (selectedInstitutions: InstitutionResponse[]) => {
        try {
            const deletePromises = selectedInstitutions.map(institution =>
                InstitutionService.deleteInstitution(institution.uuid)
            );

            await Promise.all(deletePromises);

            const remainingInstitutions = selects.filter(
                institution => !selectedInstitutions.some(selected => selected.uuid === institution.uuid)
            );

            setSelects(remainingInstitutions);
            toast.current?.show({
                severity: 'success',
                summary: 'Instituciones Eliminadas',
                detail: `Se han eliminado ${selectedInstitutions.length} instituciones`,
                life: 5000
            });

            setMultipleDeleteDialog(false);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudieron eliminar algunas instituciones',
                life: 5000
            });
            console.error('Error al eliminar instituciones:', error);
        }
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
        deleteSelected,
        editData,
        deleteDialog,
        setDeleteDialog,
        multipleDeleteDialog,
    };
}
