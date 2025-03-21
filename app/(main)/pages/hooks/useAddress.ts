import { AddressResponse } from '@/app/service/UserService';
import { InstitutionResponse } from '@/app/service/InstitutionService';
import React, { useEffect, useRef, useState } from 'react';
import { DropdownChangeEvent } from 'primereact/dropdown';

export function useAddress(countries: AddressResponse[], data: InstitutionResponse, setSelectedCountry: (value: (((prevState: (AddressResponse | null)) => (AddressResponse | null)) | AddressResponse | null)) => void, provinces: AddressResponse[], setSelectedProvince: (value: (((prevState: (AddressResponse | null)) => (AddressResponse | null)) | AddressResponse | null)) => void, municipalities: AddressResponse[], setSelectedMunicipality: (value: (((prevState: (AddressResponse | null)) => (AddressResponse | null)) | AddressResponse | null)) => void, handleCountryChange: (country: AddressResponse, onInputChange?: (e: any, field: string) => void) => Promise<void>, onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void, handleProvinceChange: (province: AddressResponse, onInputChange?: (e: any, field: string) => void) => Promise<void>) {

    const [loading, setLoading] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const initialProvinceLoaded = useRef(false);
    const initialMunicipalityLoaded = useRef(false);

    useEffect(() => {
        const loadInitialCountry = async () => {
            if (!initialized && countries.length > 0 && data?.country) {
                setInitialized(true);
                setLoading(true);

                const countryMatch = countries.find(c => c.name === data.country);

                if (countryMatch) {
                    setSelectedCountry(countryMatch);
                    await handleCountryChange(countryMatch, onInputChange);
                    initialProvinceLoaded.current = true;
                }

                setLoading(false);
            }
        };

        loadInitialCountry().then(() => console.log('Initial country loaded.'));
    }, [countries, data?.country, initialized, setSelectedCountry, handleCountryChange, onInputChange]);
    useEffect(() => {
        const loadInitialProvince = async () => {
            if (initialProvinceLoaded.current && provinces.length > 0 && data?.province && !initialMunicipalityLoaded.current) {
                setLoading(true);

                const provinceMatch = provinces.find(p => p.name === data.province);

                if (provinceMatch) {
                    setSelectedProvince(provinceMatch);

                    await handleProvinceChange(provinceMatch, onInputChange);
                    initialMunicipalityLoaded.current = true;
                }

                setLoading(false);
            }
        };

        loadInitialProvince().then(() => console.log('Initial province loaded.'));
    }, [provinces, data?.province, setSelectedProvince, handleProvinceChange, onInputChange]);

    useEffect(() => {
        if (initialMunicipalityLoaded.current && municipalities.length > 0 && data?.municipality) {

            const municipalityMatch = municipalities.find(m => m.name === data.municipality);

            if (municipalityMatch) {
                setSelectedMunicipality(municipalityMatch);

                onInputChange(
                    { target: { name: 'municipality', value: municipalityMatch.name } } as React.ChangeEvent<HTMLInputElement>,
                    'municipality'
                );
            }
        }
    }, [municipalities, data?.municipality, setSelectedMunicipality, onInputChange]);



    const onCountryChange = async (e: DropdownChangeEvent) => {
        const country = e.value as AddressResponse;
        setSelectedCountry(country);
        setSelectedProvince(null);
        setSelectedMunicipality(null);

        await handleCountryChange(country, onInputChange);
    };

    const onProvincesChange = async (e: DropdownChangeEvent) => {
        const province = e.value as AddressResponse;
        setSelectedProvince(province);
        setSelectedMunicipality(null);

        await handleProvinceChange(province, onInputChange);
    };

    const onMunicipalitiesChange = (e: DropdownChangeEvent) => {
        const municipality = e.value as AddressResponse;
        setSelectedMunicipality(municipality);

        onInputChange(
            { target: { name: 'municipality', value: municipality.name } } as React.ChangeEvent<HTMLInputElement>,
            'municipality',
        );
    };
    return { onCountryChange, onProvincesChange, onMunicipalitiesChange, loading };
}
