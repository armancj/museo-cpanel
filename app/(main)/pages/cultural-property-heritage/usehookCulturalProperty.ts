import { useGenericHook } from '@/app/common/hooks/useGenericHook';
import { capitalize } from '@/app/(main)/pages/util/export.functions';
import { CulturalPropertyModel } from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';
import { CulturalPropertyService } from '@/app/service/CulturalPropertyService';
import { emptyCulturalProperty } from '@/app/service/utilities/culturalproperty.data';
import { useMemo } from 'react';

export const useHookCulturalProperty = () => {
    const service = useMemo(() => ({
        fetchAll: CulturalPropertyService.getCulturalProperties,
        create: CulturalPropertyService.createCulturalProperty,
        update: CulturalPropertyService.updateCulturalProperty,
        delete: CulturalPropertyService.deleteCulturalProperty,
        emptyItem: emptyCulturalProperty
    }), []);

    return useGenericHook<CulturalPropertyModel>({
        service,
        capitalizeFunc: capitalize,
        messages: {
            createSuccess: 'País creado satisfactoriamente',
            updateSuccess: 'País actualizado satisfactoriamente',
            deleteSuccess: 'País eliminado',
            errorDefault: 'No se pudo completar la operación',
        },
    });
};
