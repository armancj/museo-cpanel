import React from 'react';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

interface NameFieldProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    submitted: boolean;
    required?: boolean;
}

export const NameField: React.FC<NameFieldProps> = ({
                                                        value,
                                                        onChange,
                                                        submitted,
                                                        required = false
                                                    }) => (
    <div className="col-12 md:col-5">
        <label htmlFor="name">Nombre{required && '*'}</label>
        <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
                <i className="pi pi-user"></i>
            </span>
            <InputText
                id="name"
                value={value || ''}
                onChange={onChange}
                required={required}
                className={classNames({ 'p-invalid': submitted && required && !value })}
            />
        </div>
        {submitted && required && !value && (
            <small className="p-error">Nombre es requerido.</small>
        )}
    </div>
);
