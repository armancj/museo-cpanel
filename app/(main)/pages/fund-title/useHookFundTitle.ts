import { FundTitleResponse, FundTitleService, emptyFundTitle } from '@/app/service/FundTitleService';
import { capitalize } from '@/app/(main)/pages/util/export.functions';
import { useGenericHook } from '@/app/common/hooks/useGenericHook';


export const useHookFundTitle = () => {
    return useGenericHook<FundTitleResponse>({
        service: {
            fetchAll: FundTitleService.getFundTitles,
            create: FundTitleService.createFundTitle,
            update: FundTitleService.updateFundTitle,
            delete: FundTitleService.deleteFundTitle,
            emptyItem: emptyFundTitle,
        },
        capitalizeFunc: capitalize,
        messages: {
            createSuccess: 'Título de fondo creado satisfactoriamente',
            updateSuccess: 'Título de fondo actualizado satisfactoriamente',
            deleteSuccess: 'Título de fondo eliminado',
            errorDefault: 'No se pudo completar la operación',
        },
    });
};
