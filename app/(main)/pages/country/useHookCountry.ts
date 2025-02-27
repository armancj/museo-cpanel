import { CountryResponse, CountryService, emptyCountry } from '@/app/service/CountryService';
import { capitalize } from '@/app/(main)/pages/util/export.functions';
import { useGenericHook } from '@/app/common/hooks/useGenericHook';


export const useHookCountry = () => {
    return useGenericHook<CountryResponse>({
        service: {
            fetchAll: CountryService.getCountries,
            create: CountryService.createCountry,
            update: CountryService.updateCountry,
            delete: CountryService.deleteCountry,
            emptyItem: emptyCountry,
        },
        capitalizeFunc: capitalize,
        messages: {
            createSuccess: 'País creado satisfactoriamente',
            updateSuccess: 'País actualizado satisfactoriamente',
            deleteSuccess: 'País eliminado',
            errorDefault: 'No se pudo completar la operación',
        },
    });
};

