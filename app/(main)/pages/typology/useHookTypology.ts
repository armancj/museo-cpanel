import { useGenericHook } from '@/app/common/hooks/useGenericHook';
import { capitalize } from '@/app/(main)/pages/util/export.functions';
import { useMemo } from 'react';
import { emptyTypology, TypologyResponse, TypologyService } from '@/app/service/TypologyService';

export const useHookTypology = () => {
    const service = useMemo(() => ({
        fetchAll: TypologyService.getTypologies,
        create: TypologyService.create,
        update: TypologyService.updateTypology,
        delete: TypologyService.deleteTypology,
        emptyItem: emptyTypology
    }), []);

    return useGenericHook<TypologyResponse>({
        service,
        capitalizeFunc: capitalize,
        messages: {
            createSuccess: 'Tipología creada satisfactoriamente',
            updateSuccess: 'Tipología actualizado satisfactoriamente',
            deleteSuccess: 'Tipología eliminado',
            errorDefault: 'No se pudo completar la operación',
        },
    });
};
