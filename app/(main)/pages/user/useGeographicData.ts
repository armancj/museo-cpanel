import { useState, useEffect } from 'react';
import { InstitutionService } from '@/app/service/InstitutionService';
import { ProvinceService } from '@/app/service/ProvinceService';
import { MunicipalityService } from '@/app/service/MunicipalityService';
import { CountryService } from '@/app/service/CountryService';

export interface AddressOption {
    uuid: string;
    name: string;
    municipality?: string;
}

export interface GeographicState {
    countries: AddressOption[];
    provinces: AddressOption[];
    municipalities: AddressOption[];
    institutions: AddressOption[];
    isProvinceDisabled: boolean;
    isMunicipalityDisabled: boolean;
    isInstitutionDisabled: boolean;
}

export const useGeographicData = () => {
    const [state, setState] = useState<GeographicState>({
        countries: [],
        provinces: [],
        municipalities: [],
        institutions: [],
        isProvinceDisabled: true,
        isMunicipalityDisabled: true,
        isInstitutionDisabled: true,
    });

    useEffect(() => {
        loadCountries();
    }, []);

    const loadCountries = async () => {
        try {
            const countriesData = await CountryService.getCountries();
            setState(prev => ({ ...prev, countries: countriesData }));
        } catch (error) {
            console.error('❌ Error loading countries:', error);
        }
    };

    const loadProvinces = async (country: AddressOption) => {
        try {
            const provincesData = await ProvinceService.getProvinces(country);
            setState(prev => ({
                ...prev,
                provinces: provincesData,
                municipalities: [],
                institutions: [],
                isProvinceDisabled: false,
                isMunicipalityDisabled: true,
                isInstitutionDisabled: true,
            }));
            return provincesData;
        } catch (error) {
            console.error('Error fetching provinces:', error);
            return [];
        }
    };

    const loadMunicipalities = async (province: AddressOption) => {
        try {
            const municipalitiesData = await MunicipalityService.getMunicipalities(province);
            setState(prev => ({
                ...prev,
                municipalities: municipalitiesData,
                institutions: [],
                isMunicipalityDisabled: false,
                isInstitutionDisabled: true,
            }));
            return municipalitiesData;
        } catch (error) {
            console.error('Error fetching municipalities:', error);
            return [];
        }
    };

    const loadInstitutions = async (municipality: AddressOption) => {
        try {
            const institutionsData = await InstitutionService.getInstitutions(municipality);
            const filteredInstitutions = institutionsData.filter(
                institution => institution.municipality === municipality.name
            );
            setState(prev => ({
                ...prev,
                institutions: filteredInstitutions,
                isInstitutionDisabled: false,
            }));
            return filteredInstitutions;
        } catch (error) {
            console.error('Error fetching institutions:', error);
            return [];
        }
    };

    const resetDependentStates = () => {
        setState(prev => ({
            ...prev,
            provinces: [],
            municipalities: [],
            institutions: [],
            isProvinceDisabled: true,
            isMunicipalityDisabled: true,
            isInstitutionDisabled: true,
        }));
    };

    return {
        ...state,
        loadProvinces,
        loadMunicipalities,
        loadInstitutions,
        resetDependentStates,
    };
};
