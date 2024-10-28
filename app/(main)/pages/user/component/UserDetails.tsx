import React from 'react';
import { UsersDatum } from '@/app/service/UserService';
import DropdownField from '@/app/(main)/pages/user/component/DropdownField';
import { useAddressData } from '@/app/(main)/pages/user/useAddressData';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
interface UserDetailsProps  {
    submitted: boolean,
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void,
    user: UsersDatum
}
export function UserDetails({ user, onInputChange, submitted }: UserDetailsProps ) {
    const { countries, provinces, municipalities, isProvinceDisabled, isMunicipalityDisabled, handleCountryChange, handleProvinceChange } = useAddressData();
    const dropdownFields = ['municipal', 'province', 'nationality', 'roles'];
    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
    const validateMobile = (mobile: string) => /^\+?[1-9]\d{1,14}$/.test(String(mobile));

    const roles = [
        { name: 'Super Administrador', value: 'super Administrador' },
        { name: 'Administrador', value: 'Administrador' },
        { name: 'Especialista', value: 'Especialista' },
        { name: 'Técnico', value: 'Técnico' },
    ];

    return (
        <div className="grid">
            {[
                { field: 'name', label: 'Nombre', required: true },
                { field: 'lastName', label: 'Apellidos', required: false },
                { field: 'mobile', label: 'Teléfono', required: true },
                { field: 'municipal', label: 'Municipio', required: true },
                { field: 'province', label: 'Provincia', required: true },
                { field: 'nationality', label: 'País', required: true },
                { field: 'email', label: 'Correo', required: true },
                { field: 'roles', label: 'Rol', required: true }
            ].map(({ field, label, required }) => (
                <div className="field col-12 md:col-6" key={field}>
                    <label htmlFor={field}>{label}</label>
                    {dropdownFields.includes(field) ? (
                        <DropdownField
                            id={field}
                            name={field}
                            value={user[field]}
                            options={field === 'nationality' ? countries : field === 'province' ? provinces : field === 'roles' ? roles : municipalities}
                            onChange={field === 'nationality' ? (e) => handleCountryChange(e.target.value, onInputChange) : field === 'province' ? (e) => handleProvinceChange(e.target.value, onInputChange) : (e) => onInputChange(e, field)}
                            optionLabel="name"
                            placeholder={`Seleccionar ${label}`}
                            submitted={submitted}
                            disabled={field === 'nationality' ? false : field === 'province' ? isProvinceDisabled : field === 'roles' ? false : isMunicipalityDisabled}
                        />
                    ) : (
                        <InputText
                            id={field}
                            name={field}
                            value={user[field]}
                            onChange={(e) => onInputChange(e, field)}
                            required={required}
                            className={classNames({
                                'p-invalid': (submitted && !user[field]) || (field === 'email' && !validateEmail(user[field]) && user[field]) || (field === 'mobile' && !validateMobile(user[field])&& user[field])
                            })}
                        />
                    )}
                    {submitted && !user[field] && <small className="p-invalid">{`${label} es requerido.`}</small>}
                    {submitted && field === 'email' && !validateEmail(user[field]) && <small className="p-invalid">Correo no es válido.</small>}
                    {submitted && field === 'mobile' && !validateMobile(user[field]) && <small className="p-invalid">Teléfono no es válido.</small>}
                </div>
            ))}
        </div>
    );
}

