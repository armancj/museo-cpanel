import { CulturalHeritageProperty, emptyCulturalHeritageProperty } from '@/app/(main)/pages/cultural-property-heritage/types';
import { CulturalHeritagePropertyService } from '@/app/service/CulturalHeritagePropertyService';
import { capitalize } from '@/app/(main)/pages/util/export.functions';
import { useGenericHook } from '@/app/common/hooks/useGenericHook';

export const useHookCulturalHeritageProperty = () => {
    return useGenericHook<CulturalHeritageProperty>({
        service: {
            fetchAll: CulturalHeritagePropertyService.getCulturalHeritageProperties,
            create: CulturalHeritagePropertyService.createCulturalHeritageProperty,
            update: CulturalHeritagePropertyService.updateCulturalHeritageProperty,
            delete: CulturalHeritagePropertyService.deleteCulturalHeritageProperty,
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
