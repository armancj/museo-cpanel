import React, { useEffect, useState } from 'react';
import {
    addressResponse,
    CountryService,
    MunicipalityService,
    ProvinceService
} from '@/app/(main)/pages/user/UserService';

export const useAddressData = () => {
    const [countries, setCountries] = useState<addressResponse[]>([]);
    const [provinces, setProvinces] = useState<addressResponse[]>([]);
    const [municipalities, setMunicipalities] = useState<addressResponse[]>([]);
    const [isProvinceDisabled, setIsProvinceDisabled] = useState(true);
    const [isMunicipalityDisabled, setIsMunicipalityDisabled] = useState(true);

    useEffect(() => {
        CountryService.getCountries().then(data => {
            setCountries(data);
        });
    }, []);

    const handleCountryChange = (country: addressResponse, onInputChange: (e: any, field: string) => void) => {
        onInputChange({ target: { value: country } }, 'nationality');
        ProvinceService.getProvinces(country).then(provincesData => setProvinces(provincesData));
        setMunicipalities([]);
        setIsProvinceDisabled(false); // Enable province dropdown
        setIsMunicipalityDisabled(true); // Disable municipality dropdown
    };

    const handleProvinceChange = (province: addressResponse, onInputChange: (e: any, field: string) => void) => {
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
