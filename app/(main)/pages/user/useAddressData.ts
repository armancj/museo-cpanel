import { useEffect, useState, useCallback } from 'react';
import { AddressResponse } from '@/app/service/UserService';
import { CountryService } from '@/app/service/CountryService';
import { ProvinceService } from '@/app/service/ProvinceService';
import { MunicipalityService } from '@/app/service/MunicipalityService';

export const useAddressData = () => {
    const [countries, setCountries] = useState<AddressResponse[]>([]);
    const [provinces, setProvinces] = useState<AddressResponse[]>([]);
    const [municipalities, setMunicipalities] = useState<AddressResponse[]>([]);
    const [dropdownState, setDropdownState] = useState({
        isProvinceDisabled: true,
        isMunicipalityDisabled: true,
    });

    // Fetch countries on component mount
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const data = await CountryService.getCountries();
                setCountries(data);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };
        fetchCountries();
    }, []);

    /**
     * Handles changes when a country is selected.
     */
    const handleCountryChange = useCallback(
        async (country: AddressResponse, onInputChange: (e: any, field: string) => void) => {
            // Asumiendo que 'country' es el objeto completo, pasamos solo el valor necesario
            onInputChange({ target: { name: 'country', value: country.name } }, 'country');

            try {
                const provincesData = await ProvinceService.getProvinces(country);
                setProvinces(provincesData);
                setMunicipalities([]);  // Reseteamos los municipios al seleccionar un nuevo país
                setDropdownState({ isProvinceDisabled: false, isMunicipalityDisabled: true });
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        },
        []
    );

    /**
     * Handles changes when a province is selected.
     */
    const handleProvinceChange = useCallback(
        async (province: AddressResponse, onInputChange: (e: any, field: string) => void) => {
            onInputChange({ target: { name: 'province', value: province.name } }, 'province');

            try {
                const municipalitiesData = await MunicipalityService.getMunicipalities(province);
                setMunicipalities(municipalitiesData);
                setDropdownState((prev) => ({ ...prev, isMunicipalityDisabled: false }));
            } catch (error) {
                console.error('Error fetching municipalities:', error);
            }
        },
        []
    );

    return {
        countries,
        provinces,
        municipalities,
        isProvinceDisabled: dropdownState.isProvinceDisabled,
        isMunicipalityDisabled: dropdownState.isMunicipalityDisabled,
        handleCountryChange,
        handleProvinceChange,
    };
};
