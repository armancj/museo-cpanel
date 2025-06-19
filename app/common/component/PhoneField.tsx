import React from 'react';
import { InputMask } from 'primereact/inputmask';
import { classNames } from 'primereact/utils';

interface PhoneFieldProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    submitted: boolean;
}



export const validateMobile = (mobile: string): boolean => {
    if (!mobile) return false;
    const cleanMobile = mobile.replace(/[\s\(\)\+\-]/g, '');
    return cleanMobile.length >= 8;
};

export const PhoneField: React.FC<PhoneFieldProps> = ({ value, onChange, submitted }) => (
    <div className="col-12 md:col-5 mt-2">
        <label htmlFor="mobile">Teléfono*</label>
        <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
                <i className="pi pi-phone"></i>
            </span>
            <InputMask
                id="mobile"
                value={value || ''}
                onChange={onChange as any}
                mask="(+53) 99-99-99-99"
                placeholder="(+53) 99-99-99-99"
                required
                className={classNames({ 'p-invalid': submitted && !validateMobile(value || '') })}
            />
        </div>
        {submitted && !validateMobile(value || '') && (
            <small className="p-error">Teléfono no válido.</small>
        )}
    </div>
);
