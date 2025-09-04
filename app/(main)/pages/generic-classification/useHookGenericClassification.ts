import { GenericClassificationResponse, GenericClassificationService, emptyGenericClassification } from '@/app/service/GenericClassificationService';
import { capitalize } from '@/app/(main)/pages/util/export.functions';
import { useGenericHook } from '@/app/common/hooks/useGenericHook';


export const useHookGenericClassification = () => {
    return useGenericHook<GenericClassificationResponse>({
        service: {
            fetchAll: GenericClassificationService.getGenericClassifications,
            create: GenericClassificationService.createGenericClassification,
            update: GenericClassificationService.updateGenericClassification,
            delete: GenericClassificationService.deleteGenericClassification,
            emptyItem: emptyGenericClassification,
        },
        capitalizeFunc: capitalize,
        messages: {
            createSuccess: 'Clasificación genérica creada satisfactoriamente',
            updateSuccess: 'Clasificación genérica actualizada satisfactoriamente',
            deleteSuccess: 'Clasificación genérica eliminada',
            errorDefault: 'No se pudo completar la operación',
        },
    });
};
