import { EntryFormResponse, EntryFormService, emptyEntryForm } from '@/app/service/EntryFormService';
import { capitalize } from '@/app/(main)/pages/util/export.functions';
import { useGenericHook } from '@/app/common/hooks/useGenericHook';


export const useHookEntryForm = () => {
    return useGenericHook<EntryFormResponse>({
        service: {
            fetchAll: EntryFormService.getEntryForms,
            create: EntryFormService.createEntryForm,
            update: EntryFormService.updateEntryForm,
            delete: EntryFormService.deleteEntryForm,
            emptyItem: emptyEntryForm,
        },
        capitalizeFunc: capitalize,
        messages: {
            createSuccess: 'Formulario de entrada creado satisfactoriamente',
            updateSuccess: 'Formulario de entrada actualizado satisfactoriamente',
            deleteSuccess: 'Formulario de entrada eliminado',
            errorDefault: 'No se pudo completar la operación',
        },
    });
};
