
import React from 'react';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { ProvinceResponse } from '@/app/service/ProvinceService';
import { Dropdown } from 'primereact/dropdown';
import { useAddressData } from '@/app/(main)/pages/user/useAddressData';

interface DataDetailsProps {
    data: ProvinceResponse,
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void,
    submitted: boolean
}

export function DataDetails({ data, onInputChange, submitted }: DataDetailsProps) {
    const validateName = (name: string) => name.trim().length > 0;
    const { countries, handleCountryChange } = useAddressData();


    return (
        <div className="field col-12 md:col-6">
            <label htmlFor="name">Nombre de la Provincia</label>
            <InputText
                id="name"
                name="name"
                value={data.name}
                onChange={(e) => onInputChange(e, 'name')}
                required
                className={classNames({
                    'p-invalid': submitted && (!validateName(data.name))
                })}
            />
            {submitted && !validateName(data.name) && <small className="p-invalid">El nombre es requerido.</small>}
            <label htmlFor={'country'}>Nombre del País</label>
            <Dropdown
                id="country"
                name="country"
                value={data.country}
                options={countries}
                onChange={(e) => handleCountryChange(e.target.value, onInputChange)}
                optionLabel="name"
                placeholder={`Seleccionar País`}
                className={classNames({ 'p-invalid': submitted && !data.country })}
            />
        </div>
    );
}
