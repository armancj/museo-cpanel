import { useGenericHook } from '@/app/common/hooks/useGenericHook';
import { capitalize } from '@/app/(main)/pages/util/export.functions';
import { useMemo } from 'react';
import {
    CategoryMuseumService,
    emptyCategoryMuseum,
    MuseumCategoriesResponse,
} from '@/app/service/CategoryMuseumService';

export const useHookMuseumCategory = () => {
    const service = useMemo(() => ({
        fetchAll: CategoryMuseumService.get,
        create: CategoryMuseumService.create,
        update: CategoryMuseumService.update,
        delete: CategoryMuseumService.delete,
        emptyItem: emptyCategoryMuseum
    }), []);

    return useGenericHook<MuseumCategoriesResponse>({
        service,
        capitalizeFunc: capitalize,
        messages: {
            createSuccess: 'Categoría de museo creada satisfactoriamente',
            updateSuccess: 'Categoría de museo actualizado satisfactoriamente',
            deleteSuccess: 'Categoría de museo eliminado',
            errorDefault: 'No se pudo completar la operación',
        },
    });
};
