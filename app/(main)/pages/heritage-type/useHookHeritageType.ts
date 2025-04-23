import { HeritageTypeResponse, HeritageTypeService, emptyHeritageType } from '@/app/service/HeritageTypeService';
import { capitalize } from '@/app/(main)/pages/util/export.functions';
import { useGenericHook } from '@/app/common/hooks/useGenericHook';


export const useHookHeritageType = () => {
    return useGenericHook<HeritageTypeResponse>({
        service: {
            fetchAll: HeritageTypeService.getHeritageTypes,
            create: HeritageTypeService.createHeritageType,
            update: HeritageTypeService.updateHeritageType,
            delete: HeritageTypeService.deleteHeritageType,
            emptyItem: emptyHeritageType,
        },
        capitalizeFunc: capitalize,
        messages: {
            createSuccess: 'Tipo de patrimonio creado satisfactoriamente',
            updateSuccess: 'Tipo de patrimonio actualizado satisfactoriamente',
            deleteSuccess: 'Tipo de patrimonio eliminado',
            errorDefault: 'No se pudo completar la operación',
        },
    });
};
