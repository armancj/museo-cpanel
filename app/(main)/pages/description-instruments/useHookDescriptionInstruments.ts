import { useGenericHook } from '@/app/common/hooks/useGenericHook';
import { capitalize } from '@/app/(main)/pages/util/export.functions';
import { useMemo } from 'react';
import {
    DescriptionInstrumentsResponse,
    DescriptionInstrumentsService,
    emptyDescriptionInstruments,
} from '@/app/service/DescriptionInstrumentsService';

export const useHookDescriptionInstruments = () => {
    const service = useMemo(() => ({
        fetchAll: DescriptionInstrumentsService.get,
        create: DescriptionInstrumentsService.create,
        update: DescriptionInstrumentsService.update,
        delete: DescriptionInstrumentsService.delete,
        emptyItem: emptyDescriptionInstruments
    }), []);

    return useGenericHook<DescriptionInstrumentsResponse>({
        service,
        capitalizeFunc: capitalize,
        messages: {
            createSuccess: 'Instrumento de descripción creada satisfactoriamente',
            updateSuccess: 'Instrumento de descripción actualizado satisfactoriamente',
            deleteSuccess: 'Instrumento de descripción eliminado',
            errorDefault: 'No se pudo completar la operación',
        },
    });
};
