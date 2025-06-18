import { useEffect, useState, useCallback } from 'react';
import { AddressResponse } from '@/app/service/UserService';
import { CountryService } from '@/app/service/CountryService';
import { ProvinceService } from '@/app/service/ProvinceService';
import { MunicipalityService } from '@/app/service/MunicipalityService';
import { InstitutionService, InstitutionResponse } from '@/app/service/InstitutionService';

interface DropdownState {
    isProvinceDisabled: boolean;
    isMunicipalityDisabled: boolean;
    isInstitutionDisabled: boolean;
}

export const useAddressData = () => {
    const [countries, setCountries] = useState<AddressResponse[]>([]);
    const [provinces, setProvinces] = useState<AddressResponse[]>([]);
    const [municipalities, setMunicipalities] = useState<AddressResponse[]>([]);
    const [institutions, setInstitutions] = useState<InstitutionResponse[]>([]);
    const [dropdownState, setDropdownState] = useState<DropdownState>({
        isProvinceDisabled: true,
        isMunicipalityDisabled: true,
        isInstitutionDisabled: true,
    });

    // Cargar países al inicio
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

    // Función para resetear todos los estados dependientes
    const resetDependentStates = useCallback(() => {
        setProvinces([]);
        setMunicipalities([]);
        setInstitutions([]);
        setDropdownState({
            isProvinceDisabled: true,
            isMunicipalityDisabled: true,
            isInstitutionDisabled: true,
        });
    }, []);

    // 🔥 ACTUALIZADO: Inicializar datos para edición con institutionId
    const initializeForEdit = useCallback(async (
        countryName: string,
        provinceName?: string,
        municipalityName?: string,
        institutionId?: string
    ) => {
        try {
            // Buscar y cargar el país
            const country = countries.find(c => c.name === countryName);
            if (!country) return;

            // Cargar provincias
            const provincesData = await ProvinceService.getProvinces(country);
            setProvinces(provincesData);
            setDropdownState(prev => ({ ...prev, isProvinceDisabled: false }));

            if (provinceName) {
                // Buscar y cargar municipios
                const province = provincesData.find(p => p.name === provinceName);
                if (province) {
                    const municipalitiesData = await MunicipalityService.getMunicipalities(province);
                    setMunicipalities(municipalitiesData);
                    setDropdownState(prev => ({ ...prev, isMunicipalityDisabled: false }));

                    if (municipalityName) {
                        // Cargar instituciones
                        const municipality = municipalitiesData.find(m => m.name === municipalityName);
                        if (municipality) {
                            const institutionsData = await InstitutionService.getInstitutions(municipality);
                            const filteredInstitutions = institutionsData.filter(
                                institution => institution.municipality === municipality.name
                            );
                            setInstitutions(filteredInstitutions);
                            setDropdownState(prev => ({ ...prev, isInstitutionDisabled: false }));

                            // 🔍 Debug para verificar si encontramos la institución
                            if (institutionId) {
                                const foundInstitution = filteredInstitutions.find(inst => inst.uuid === institutionId);
                                console.log('🎯 Institución encontrada para edición:', foundInstitution?.name || 'No encontrada');
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error initializing address data for edit:', error);
        }
    }, [countries]);

    // 🆕 Nueva función para encontrar institución por UUID
    const findInstitutionByUuid = useCallback((uuid: string): InstitutionResponse | null => {
        if (!uuid || !institutions.length) return null;
        return institutions.find(institution => institution.uuid === uuid) || null;
    }, [institutions]);

    const handleCountryChange = useCallback(
        async (country: AddressResponse, onInputChange?: (e: any, field: string) => void) => {
            if (onInputChange) {
                onInputChange({ target: { name: 'nationality', value: country.name } }, 'nationality');
            }

            try {
                const provincesData = await ProvinceService.getProvinces(country);
                setProvinces(provincesData);
                setMunicipalities([]);
                setInstitutions([]);
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

    const handleProvinceChange = useCallback(
        async (province: AddressResponse, onInputChange?: (e: any, field: string) => void) => {
            if (onInputChange) {
                onInputChange({ target: { name: 'province', value: province.name } }, 'province');
            }

            try {
                const municipalitiesData = await MunicipalityService.getMunicipalities(province);
                setMunicipalities(municipalitiesData);
                setInstitutions([]);
                setDropdownState(prev => ({
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

    const handleMunicipalityChange = useCallback(
        async (municipality: AddressResponse, onInputChange?: (e: any, field: string) => void) => {
            if (onInputChange) {
                onInputChange({ target: { name: 'municipal', value: municipality.name } }, 'municipal');
            }

            try {
                const institutionsData = await InstitutionService.getInstitutions(municipality);
                const filteredInstitutions = institutionsData.filter(
                    institution => institution.municipality === municipality.name
                );
                setInstitutions(filteredInstitutions);
                setDropdownState(prev => ({ ...prev, isInstitutionDisabled: false }));
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
        initializeForEdit,
        resetDependentStates,
        findInstitutionByUuid, // 🆕 Nueva función exportada
    };
};
