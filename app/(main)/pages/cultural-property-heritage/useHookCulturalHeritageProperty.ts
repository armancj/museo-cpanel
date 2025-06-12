import { CulturalHeritageProperty, emptyCulturalHeritageProperty } from '@/app/(main)/pages/cultural-property-heritage/types';
import { capitalize } from '@/app/(main)/pages/util/export.functions';
import { useGenericHook } from '@/app/common/hooks/useGenericHook';
import { CulturalPropertyService } from '@/app/service/CulturalPropertyService';

export const useHookCulturalHeritageProperty = () => {
    return useGenericHook<CulturalHeritageProperty>({
        service: {
            fetchAll: CulturalPropertyService.getCulturalProperties,
            create: CulturalPropertyService.createCulturalProperty,
            update: CulturalPropertyService.updateCulturalProperty,
            delete: CulturalPropertyService.deleteCulturalProperty,
            emptyItem: emptyCulturalHeritageProperty,
        },
        capitalizeFunc: capitalize,
        messages: {
            createSuccess: 'Bien patrimonial cultural creado satisfactoriamente',
            updateSuccess: 'Bien patrimonial cultural actualizado satisfactoriamente',
            deleteSuccess: 'Bien patrimonial cultural eliminado',
            errorDefault: 'No se pudo completar la operación',
        },
    });
};
