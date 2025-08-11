import { useCallback, useEffect } from 'react';
import { AddressOption, useGeographicData } from './useGeographicData';

interface UseEditInitializationProps {
    editingUser: any;
    countries: AddressOption[];
    loadProvinces: (country: AddressOption) => Promise<AddressOption[]>;
    loadMunicipalities: (province: AddressOption) => Promise<AddressOption[]>;
    loadInstitutions: (municipality: AddressOption) => Promise<AddressOption[]>;
    resetDependentStates: () => void;
}

export const useEditInitialization = ({
                                          editingUser,
                                          countries,
                                          loadProvinces,
                                          loadMunicipalities,
                                          loadInstitutions,
                                          resetDependentStates,
                                      }: UseEditInitializationProps) => {

    const initializeForEdit = useCallback(async () => {
        try {
            const country = countries.find(c => c.name === editingUser?.nationality);
            if (!country) return;

            const provincesData = await loadProvinces(country);

            if (editingUser?.province) {
                const province = provincesData.find(p => p.name === editingUser.province);
                if (province) {
                    const municipalitiesData = await loadMunicipalities(province);

                    if (editingUser?.municipal) {
                        const municipality = municipalitiesData.find(m => m.name === editingUser.municipal);
                        if (municipality) {
                            await loadInstitutions(municipality);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error initializing edit data:', error);
        }
    }, [
        countries,
        editingUser,
        loadProvinces,
        loadMunicipalities,
        loadInstitutions
    ]);

    useEffect(() => {
        if (editingUser && countries.length > 0) {
            initializeForEdit();
        } else if (!editingUser) {
            resetDependentStates();
        }
    }, [editingUser, countries, initializeForEdit, resetDependentStates]);

};
