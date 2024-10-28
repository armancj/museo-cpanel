import { useEffect, useState } from 'react';
import {
    AddressResponse,
} from '@/app/service/UserService';
import { CountryService } from '@/app/service/CountryService';
import { ProvinceService } from '@/app/service/ProvinceService';
import { MunicipalityService } from '@/app/service/MunicipalityService';

export const useAddressData = () => {
    const [countries, setCountries] = useState<AddressResponse[]>([]);
    const [provinces, setProvinces] = useState<AddressResponse[]>([]);
    const [municipalities, setMunicipalities] = useState<AddressResponse[]>([]);
    const [isProvinceDisabled, setIsProvinceDisabled] = useState(true);
    const [isMunicipalityDisabled, setIsMunicipalityDisabled] = useState(true);

    useEffect(() => {
        CountryService.getCountries().then(data => {
            setCountries(data);
        });
    }, []);

    const handleCountryChange = (country: AddressResponse, onInputChange: (e: any, field: string) => void) => {
        onInputChange({ target: { value: country } }, 'nationality');
        ProvinceService.getProvinces(country).then(provincesData => setProvinces(provincesData));
        setMunicipalities([]);
        setIsProvinceDisabled(false); // Enable province dropdown
        setIsMunicipalityDisabled(true); // Disable municipality dropdown
    };

    const handleProvinceChange = (province: AddressResponse, onInputChange: (e: any, field: string) => void) => {
        onInputChange({ target: { value: province } }, 'province');
        MunicipalityService.getMunicipalities(province).then(municipalitiesData => setMunicipalities(municipalitiesData));
        setIsMunicipalityDisabled(false); // Enable municipality dropdown

    };

    return {
        countries,
        provinces,
        municipalities,
        isProvinceDisabled,
        isMunicipalityDisabled,
        handleCountryChange,
        handleProvinceChange
    };
};
