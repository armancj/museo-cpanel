import { AddressResponse } from '@/app/service/UserService';
import { InstitutionResponse } from '@/app/service/InstitutionService';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DropdownChangeEvent } from 'primereact/dropdown';

export function useAddress(countries: AddressResponse[], data: InstitutionResponse, setSelectedCountry: (value: (((prevState: (AddressResponse | null)) => (AddressResponse | null)) | AddressResponse | null)) => void, provinces: AddressResponse[], setSelectedProvince: (value: (((prevState: (AddressResponse | null)) => (AddressResponse | null)) | AddressResponse | null)) => void, municipalities: AddressResponse[], setSelectedMunicipality: (value: (((prevState: (AddressResponse | null)) => (AddressResponse | null)) | AddressResponse | null)) => void, handleCountryChange: (country: AddressResponse, onInputChange?: (e: any, field: string) => void) => Promise<void>, onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void, handleProvinceChange: (province: AddressResponse, onInputChange?: (e: any, field: string) => void) => Promise<void>) {

    const [loading, setLoading] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const initialProvinceLoaded = useRef(false);
    const initialMunicipalityLoaded = useRef(false);

    const stableHandleCountryChange = useCallback(handleCountryChange, []);
    const stableOnInputChange = useCallback(onInputChange, []);
    const stableHandleProvinceChange = useCallback(handleProvinceChange, []);


    useEffect(() => {
        const loadInitialCountry = async () => {
            if (!initialized && countries.length > 0 && data?.country) {
                setInitialized(true);
                setLoading(true);

                const countryMatch = countries.find((c) => c.name === data.country);

                if (countryMatch) {
                    setSelectedCountry(countryMatch);

                    // Carga los detalles del país y espera antes de continuar
                    await stableHandleCountryChange(countryMatch, stableOnInputChange);
                    initialProvinceLoaded.current = true;
                }

                setLoading(false);
            }
        };

        loadInitialCountry().then(() => console.log('Initial country loaded.'));
    }, [countries, data?.country, initialized, setSelectedCountry, stableHandleCountryChange, stableOnInputChange]);

    useEffect(() => {
        const loadInitialProvince = async () => {
            if (
                initialProvinceLoaded.current && // País ya cargado
                provinces.length > 0 &&
                data?.province &&
                !initialMunicipalityLoaded.current // Asegura que el municipio no se haya cargado todavía
            ) {
                setLoading(true);

                const provinceMatch = provinces.find((p) => p.name === data.province);

                if (provinceMatch) {
                    setSelectedProvince(provinceMatch);

                    // Carga los detalles de la provincia
                    await stableHandleProvinceChange(provinceMatch, stableOnInputChange);
                    initialMunicipalityLoaded.current = true;
                }

                setLoading(false);
            }
        };

        loadInitialProvince().then(() => console.log('Initial province loaded.'));
    }, [provinces, data?.province, setSelectedProvince, stableHandleProvinceChange, stableOnInputChange]);


    useEffect(() => {
        if (initialMunicipalityLoaded.current && municipalities.length > 0 && data?.municipality) {
            const municipalityMatch = municipalities.find((m) => m.name === data.municipality);

            if (municipalityMatch) {
                setSelectedMunicipality(municipalityMatch);

                // Ejecuta el input change solo si el municipio coincide
                stableOnInputChange(
                    { target: { name: 'municipality', value: municipalityMatch.name } } as React.ChangeEvent<HTMLInputElement>,
                    'municipality'
                );
            }
        }
    }, [municipalities, data?.municipality, setSelectedMunicipality, stableOnInputChange]);


    const onCountryChange = async (e: DropdownChangeEvent) => {
        const country = e.value as AddressResponse;
        setSelectedCountry(country);
        setSelectedProvince(null);
        setSelectedMunicipality(null);

        await stableHandleCountryChange(country, stableOnInputChange);
    };


    const onProvincesChange = async (e: DropdownChangeEvent) => {
        const province = e.value as AddressResponse;
        setSelectedProvince(province);
        setSelectedMunicipality(null);

        await stableHandleProvinceChange(province, stableOnInputChange);
    };


    const onMunicipalitiesChange = (e: DropdownChangeEvent) => {
        const municipality = e.value as AddressResponse;
        setSelectedMunicipality(municipality);

        stableOnInputChange(
            { target: { name: 'municipality', value: municipality.name } } as React.ChangeEvent<HTMLInputElement>,
            'municipality'
        );
    };

    return { onCountryChange, onProvincesChange, onMunicipalitiesChange, loading };
}
