import React from 'react';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';


interface EmailFieldProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    submitted: boolean;
}

const validateEmail = (email: string): boolean => {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const EmailField: React.FC<EmailFieldProps> = ({ value, onChange, submitted }) => (
    <div className="col-12 md:col-7 mt-2">
        <label htmlFor="email">Correo*</label>
        <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
                <i className="pi pi-envelope"></i>
            </span>
            <InputText
                id="email"
                value={value || ''}
                onChange={onChange}
                required
                className={classNames({ 'p-invalid': submitted && !validateEmail(value || '') })}
            />
        </div>
        {submitted && !validateEmail(value || '') && (
            <small className="p-error">Correo no válido.</small>
        )}
    </div>
);
