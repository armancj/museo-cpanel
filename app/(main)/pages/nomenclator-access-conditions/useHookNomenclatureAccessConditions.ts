import { useGenericHook } from '@/app/common/hooks/useGenericHook';
import { capitalize } from '@/app/(main)/pages/util/export.functions';
import { useMemo } from 'react';
import {
    emptyNomenclatureAccessConditions,
    NomenclatureAccessConditionsResponse,
    NomenclatureAccessConditionsService,
} from '@/app/service/NomenclatureAccessConditionsService';

export const useHookNomenclatureAccessConditions = () => {
    const service = useMemo(() => ({
        fetchAll: NomenclatureAccessConditionsService.get,
        create: NomenclatureAccessConditionsService.create,
        update: NomenclatureAccessConditionsService.update,
        delete: NomenclatureAccessConditionsService.delete,
        emptyItem: emptyNomenclatureAccessConditions
    }), []);

    return useGenericHook<NomenclatureAccessConditionsResponse>({
        service,
        capitalizeFunc: capitalize,
        messages: {
            createSuccess: 'Condiciones de acceso creada satisfactoriamente',
            updateSuccess: 'Condiciones de acceso actualizado satisfactoriamente',
            deleteSuccess: 'Condiciones de acceso eliminado',
            errorDefault: 'No se pudo completar la operación',
        },
    });
};
