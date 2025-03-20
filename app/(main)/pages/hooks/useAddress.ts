import { AddressResponse } from '@/app/service/UserService';
import { InstitutionResponse } from '@/app/service/InstitutionService';
import React, { useEffect } from 'react';
import { DropdownChangeEvent } from 'primereact/dropdown';

export function useAddress(countries: AddressResponse[], data: InstitutionResponse, setSelectedCountry: (value: (((prevState: (AddressResponse | null)) => (AddressResponse | null)) | AddressResponse | null)) => void, provinces: AddressResponse[], setSelectedProvince: (value: (((prevState: (AddressResponse | null)) => (AddressResponse | null)) | AddressResponse | null)) => void, municipalities: AddressResponse[], setSelectedMunicipality: (value: (((prevState: (AddressResponse | null)) => (AddressResponse | null)) | AddressResponse | null)) => void, handleCountryChange: (country: AddressResponse, onInputChange?: (e: any, field: string) => void) => Promise<void>, onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void, handleProvinceChange: (province: AddressResponse, onInputChange?: (e: any, field: string) => void) => Promise<void>) {
    useEffect(() => {
        if (countries.length > 0 && data.country) {
            const country = countries.find(c => c.name === data.country);
            if (country) setSelectedCountry(country);
        }
    }, [countries, data.country]);

    useEffect(() => {
        if (provinces.length > 0 && data.province) {
            const province = provinces.find(p => p.name === data.province);
            if (province) setSelectedProvince(province);
        }
    }, [provinces, data.province]);

    useEffect(() => {
        if (municipalities.length > 0 && data.municipalities) {
            const municipality = municipalities.find(m => m.name === data.municipalities);
            if (municipality) setSelectedMunicipality(municipality);
        }
    }, [municipalities, data.municipalities]);

    const onCountryChange = async (e: DropdownChangeEvent) => {
        const country = e.value as AddressResponse;
        setSelectedCountry(country);
        setSelectedProvince(null);
        setSelectedMunicipality(null);

        // Pasamos el objeto completo y la función onInputChange
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
    return { onCountryChange, onProvincesChange, onMunicipalitiesChange };
}
