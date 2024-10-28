import { CountryResponse } from '@/app/service/CountryService';
import React from 'react';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

interface DataDetailsProps {
    data: CountryResponse,
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void,
    submitted: boolean
}

export function DataDetails({ data, onInputChange, submitted }: DataDetailsProps) {
    const validateName = (name: string) => name.trim().length > 0;

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
        </div>
    );
}
