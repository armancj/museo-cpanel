import { ReproductionConditionsResponse, ReproductionConditionsService, emptyReproductionConditions } from '@/app/service/ReproductionConditionsService';
import { capitalize } from '@/app/(main)/pages/util/export.functions';
import { useGenericHook } from '@/app/common/hooks/useGenericHook';


export const useHookReproductionConditions = () => {
    return useGenericHook<ReproductionConditionsResponse>({
        service: {
            fetchAll: ReproductionConditionsService.getReproductionConditions,
            create: ReproductionConditionsService.createReproductionConditions,
            update: ReproductionConditionsService.updateReproductionConditions,
            delete: ReproductionConditionsService.deleteReproductionConditions,
            emptyItem: emptyReproductionConditions,
        },
        capitalizeFunc: capitalize,
        messages: {
            createSuccess: 'Condición de reproducción creada satisfactoriamente',
            updateSuccess: 'Condición de reproducción actualizada satisfactoriamente',
            deleteSuccess: 'Condición de reproducción eliminada',
            errorDefault: 'No se pudo completar la operación',
        },
    });
};
