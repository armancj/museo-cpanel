import { useEffect, useState, useCallback } from 'react';
import { AddressResponse } from '@/app/service/UserService';
import { CountryService } from '@/app/service/CountryService';
import { ProvinceService } from '@/app/service/ProvinceService';
import { MunicipalityService } from '@/app/service/MunicipalityService';
import { InstitutionService, InstitutionResponse } from '@/app/service/InstitutionService';

export const useAddressData = () => {
    const [countries, setCountries] = useState<AddressResponse[]>([]);
    const [provinces, setProvinces] = useState<AddressResponse[]>([]);
    const [municipalities, setMunicipalities] = useState<AddressResponse[]>([]);
    const [institutions, setInstitutions] = useState<InstitutionResponse[]>([]);
    const [dropdownState, setDropdownState] = useState({
        isProvinceDisabled: true,
        isMunicipalityDisabled: true,
        isInstitutionDisabled: true,
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
        async (country: AddressResponse, onInputChange?: (e: any, field: string) => void) => {
            // Asumiendo que 'country' es el objeto completo, pasamos solo el valor necesario
            if(onInputChange)
            onInputChange({ target: { name: 'country', value: country.name } }, 'country');

            try {
                const provincesData = await ProvinceService.getProvinces(country);
                setProvinces(provincesData);
                setMunicipalities([]);  // Reseteamos los municipios al seleccionar un nuevo país
                setInstitutions([]); // Reseteamos las instituciones al seleccionar un nuevo país
                setDropdownState({
                    isProvinceDisabled: false,
                    isMunicipalityDisabled: true,
                    isInstitutionDisabled: true
                });
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
        async (province: AddressResponse, onInputChange?: (e: any, field: string) => void) => {
            if(onInputChange)
            onInputChange({ target: { name: 'province', value: province.name } }, 'province');

            try {
                const municipalitiesData = await MunicipalityService.getMunicipalities(province);
                setMunicipalities(municipalitiesData);
                setInstitutions([]); // Reset institutions when province changes
                setDropdownState((prev) => ({
                    ...prev,
                    isMunicipalityDisabled: false,
                    isInstitutionDisabled: true
                }));
            } catch (error) {
                console.error('Error fetching municipalities:', error);
            }
        },
        []
    );

    /**
     * Handles changes when a municipality is selected.
     */
    const handleMunicipalityChange = useCallback(
        async (municipality: AddressResponse, onInputChange?: (e: any, field: string) => void) => {
            if(onInputChange)
            onInputChange({ target: { name: 'municipal', value: municipality.name } }, 'municipal');

            try {
                // Filter institutions by municipality
                const institutionsData = await InstitutionService.getInstitutions(municipality);
                // Filter institutions to only include those that match the selected municipality
                const filteredInstitutions = institutionsData.filter(
                    institution => institution.municipality === municipality.name
                );
                setInstitutions(filteredInstitutions);
                setDropdownState((prev) => ({ ...prev, isInstitutionDisabled: false }));
            } catch (error) {
                console.error('Error fetching institutions:', error);
            }
        },
        []
    );

    return {
        countries,
        provinces,
        municipalities,
        institutions,
        isProvinceDisabled: dropdownState.isProvinceDisabled,
        isMunicipalityDisabled: dropdownState.isMunicipalityDisabled,
        isInstitutionDisabled: dropdownState.isInstitutionDisabled,
        handleCountryChange,
        handleProvinceChange,
        handleMunicipalityChange,
    };
};
