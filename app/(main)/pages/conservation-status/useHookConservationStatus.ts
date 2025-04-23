import { ConservationStatusResponse, ConservationStatusService, emptyConservationStatus } from '@/app/service/ConservationStatusService';
import { capitalize } from '@/app/(main)/pages/util/export.functions';
import { useGenericHook } from '@/app/common/hooks/useGenericHook';


export const useHookConservationStatus = () => {
    return useGenericHook<ConservationStatusResponse>({
        service: {
            fetchAll: ConservationStatusService.getConservationStatuses,
            create: ConservationStatusService.createConservationStatus,
            update: ConservationStatusService.updateConservationStatus,
            delete: ConservationStatusService.deleteConservationStatus,
            emptyItem: emptyConservationStatus,
        },
        capitalizeFunc: capitalize,
        messages: {
            createSuccess: 'Estado de conservación creado satisfactoriamente',
            updateSuccess: 'Estado de conservación actualizado satisfactoriamente',
            deleteSuccess: 'Estado de conservación eliminado',
            errorDefault: 'No se pudo completar la operación',
        },
    });
};
