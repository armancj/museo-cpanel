import React, { useMemo } from 'react';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { useAddressData } from '@/app/(main)/pages/user/useAddressData';
import DropdownField from '@/app/(main)/pages/user/component/DropdownField';
import { UsersDatum } from '@/app/service/UserService';

interface UserDetailsProps {
    submitted: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void;
    user: UsersDatum;
}

export function UserDetails({ user, onInputChange, submitted }: UserDetailsProps) {
    const {
        countries,
        provinces,
        municipalities,
        isProvinceDisabled,
        isMunicipalityDisabled,
        handleCountryChange,
        handleProvinceChange,
    } = useAddressData();

    const roles = useMemo(
        () => [
            { name: 'Super Administrador', value: 'super Administrador' },
            { name: 'Administrador', value: 'Administrador' },
            { name: 'Especialista', value: 'Especialista' },
            { name: 'Técnico', value: 'Técnico' },
        ],
        []
    );

    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validateMobile = (mobile: string) => /^\+?[1-9]\d{1,14}$/.test(mobile);

    const fields = [
        { field: 'name', label: 'Nombre', required: true },
        { field: 'lastName', label: 'Apellidos', required: false },
        { field: 'mobile', label: 'Teléfono', required: true },
        { field: 'municipal', label: 'Municipio', required: true },
        { field: 'province', label: 'Provincia', required: true },
        { field: 'nationality', label: 'País', required: true },
        { field: 'email', label: 'Correo', required: true },
        { field: 'roles', label: 'Rol', required: true },
    ];

    const handleDropdownChange = async (field: string, value: any) => {
        if (field === 'nationality') {
            await handleCountryChange(value, onInputChange);
        } else if (field === 'province') {
            await handleProvinceChange(value, onInputChange);
        } else {
            onInputChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>, field);
        }
    };

    return (
        <div className="p-grid">
            {fields.map(({ field, label, required }) => {
                const isDropdown = ['nationality', 'province', 'municipal', 'roles'].includes(field);
                const options =
                    field === 'nationality'
                        ? countries
                        : field === 'province'
                            ? provinces
                            : field === 'roles'
                                ? roles
                                : municipalities;

                const isDisabled =
                    field === 'nationality'
                        ? false
                        : field === 'province'
                            ? isProvinceDisabled
                            : field === 'roles'
                                ? false
                                : isMunicipalityDisabled;

                return (
                    <div className="p-field p-col-12 p-md-6" key={field}>
                        <label htmlFor={field} className="p-mb-2">
                            {label} {required && <span className="p-error">*</span>}
                        </label>
                        {isDropdown ? (
                            <DropdownField
                                id={field}
                                name={field}
                                value={user[field]}
                                options={options}
                                onChange={(e) => handleDropdownChange(field, e.target.value)}
                                optionLabel="name"
                                placeholder={`Seleccionar ${label}`}
                                submitted={submitted}
                                disabled={isDisabled}
                            />
                        ) : (
                            <InputText
                                id={field}
                                name={field}
                                value={user[field]}
                                onChange={(e) => onInputChange(e, field)}
                                required={required}
                                className={classNames({
                                    'p-invalid': (submitted && !user[field]) ||
                                        (field === 'email' && !validateEmail(user[field])) ||
                                        (field === 'mobile' && !validateMobile(user[field])),
                                })}
                            />
                        )}
                        {submitted && !user[field] && (
                            <small className="p-error">{`${label} es requerido.`}</small>
                        )}
                        {submitted && field === 'email' && !validateEmail(user[field]) && (
                            <small className="p-error">Correo no válido.</small>
                        )}
                        {submitted && field === 'mobile' && !validateMobile(user[field]) && (
                            <small className="p-error">Teléfono no válido.</small>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
