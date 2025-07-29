import { useGeographicData } from './useGeographicData';
import { useEditInitialization } from './useEditInitialization';
import { AddressOption } from './useGeographicData';

interface UseUserDetailsFormProps {
    editingUser: any;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
}

export const useUserDetailsForm = ({ editingUser, onInputChange }: UseUserDetailsFormProps) => {
    const {
        countries,
        provinces,
        municipalities,
        institutions,
        isProvinceDisabled,
        isMunicipalityDisabled,
        isInstitutionDisabled,
        loadProvinces,
        loadMunicipalities,
        loadInstitutions,
        resetDependentStates,
    } = useGeographicData();

    useEditInitialization({
        editingUser,
        countries,
        loadProvinces,
        loadMunicipalities,
        loadInstitutions,
        resetDependentStates,
    });

    const handleCountryChange = async (selectedCountry: AddressOption) => {
        onInputChange({ target: { value: selectedCountry.name } } as any, 'nationality');

        await loadProvinces(selectedCountry);

        onInputChange({ target: { value: '' } } as any, 'province');
        onInputChange({ target: { value: '' } } as any, 'municipal');
        onInputChange({ target: { value: '' } } as any, 'institutionId');
    };

    const handleProvinceChange = async (selectedProvince: AddressOption) => {
        onInputChange({ target: { value: selectedProvince.name } } as any, 'province');

        await loadMunicipalities(selectedProvince);

        onInputChange({ target: { value: '' } } as any, 'municipal');
        onInputChange({ target: { value: '' } } as any, 'institutionId');
    };

    const handleMunicipalityChange = async (selectedMunicipality: AddressOption) => {
        onInputChange({ target: { value: selectedMunicipality.name } } as any, 'municipal');

        await loadInstitutions(selectedMunicipality);

        onInputChange({ target: { value: '' } } as any, 'institutionId');
    };

    const handleInstitutionChange = (selectedInstitution: AddressOption) => {
        onInputChange({ target: { value: selectedInstitution.uuid } } as any, 'institutionId');
    };

    return {
        countries,
        provinces,
        municipalities,
        institutions,
        isProvinceDisabled,
        isMunicipalityDisabled,
        isInstitutionDisabled,
        handleCountryChange,
        handleProvinceChange,
        handleMunicipalityChange,
        handleInstitutionChange,
    };
};
