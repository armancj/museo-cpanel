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

    const handleDropdownChange = async (field: string, value: any) => {
        if (field === 'nationality') {
            await handleCountryChange(value);
        } else if (field === 'province') await handleProvinceChange(value);
        onInputChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>, field);
    }

    return (
        <div className="grid">
            {/* Nombre */}
            <div className="col-12 md:col-6">
                <label htmlFor="name">Nombre*</label>
                <InputText
                    id="name"
                    value={user.name}
                    onChange={(e) => onInputChange(e, 'name')}
                    required
                    className={classNames({ 'p-invalid': submitted && !user.name })}
                />
                {submitted && !user.name && <small className="p-error">Nombre es requerido.</small>}
            </div>

            {/* Apellidos */}
            <div className="col-12 md:col-6">
                <label htmlFor="lastName">Apellidos</label>
                <InputText
                    id="lastName"
                    value={user.lastName}
                    onChange={(e) => onInputChange(e, 'lastName')}
                />
            </div>

            {/* Email */}
            <div className="col-12 md:col-6">
                <label htmlFor="email">Correo*</label>
                <InputText
                    id="email"
                    value={user.email}
                    onChange={(e) => onInputChange(e, 'email')}
                    required
                    className={classNames({ 'p-invalid': submitted && !validateEmail(user.email) })}
                />
                {submitted && !validateEmail(user.email) && (
                    <small className="p-error">Correo no válido.</small>
                )}
            </div>

            {/* Teléfono */}
            <div className="col-12 md:col-6">
                <label htmlFor="mobile">Teléfono*</label>
                <InputText
                    id="mobile"
                    value={user.mobile}
                    onChange={(e) => onInputChange(e, 'mobile')}
                    required
                    className={classNames({ 'p-invalid': submitted && !validateMobile(user.mobile) })}
                />
                {submitted && !validateMobile(user.mobile) && (
                    <small className="p-error">Teléfono no válido.</small>
                )}
            </div>

            {/* Roles */}
            <div className="field col-12 md:col-3">
                <label htmlFor="roles">Rol*</label>
                <DropdownField
                    id="roles"
                    name="roles"
                    value={user.roles}
                    options={roles}
                    optionLabel="name"
                    placeholder="Seleccionar un Rol"
                    onChange={(e) => handleDropdownChange('roles', e.value)}
                    required
                    submitted={submitted}
                    className={classNames({ 'p-invalid': submitted && !user.roles })}
                />
                {submitted && !user.roles && (
                    <small className="p-error">Rol es requerido.</small>
                )}
            </div>

            {/* País */}
            <div className="field col-12 md:col-3">
                <label htmlFor="nationality">País*</label>
                <DropdownField
                    id="nationality"
                    name="nationality"
                    value={user.nationality}
                    options={countries}
                    optionLabel="name"
                    placeholder="Seleccionar País"
                    required
                    submitted={submitted}
                    onChange={(e) => handleDropdownChange('nationality', e.value)}
                    className={classNames({ 'p-invalid': submitted && !user.nationality })}
                />
                {submitted && !user.nationality && (
                    <small className="p-error">País es requerido.</small>
                )}
            </div>

            {/* Provincia */}
            <div className="field col-12 md:col-3">
                <label htmlFor="province">Provincia*</label>
                <DropdownField
                    id="province"
                    name="province"
                    value={user.province}
                    options={provinces}
                    optionLabel="name"
                    placeholder="Seleccionar Provincia"
                    disabled={isProvinceDisabled}
                    required
                    submitted={submitted}
                    className={classNames({ 'p-invalid': submitted && !user.province })}
                    onChange={(e) => handleDropdownChange('province', e.value)}
                />
                {submitted && !user.province && (
                    <small className="p-error">Provincia es requerida.</small>
                )}
            </div>

            {/* Municipio */}
            <div className="field col-12 md:col-3">
                <label htmlFor="municipal">Municipio*</label>
                <DropdownField
                    id="municipal"
                    name="municipal"
                    value={user.municipal}
                    options={municipalities}
                    optionLabel="name"
                    placeholder="Seleccionar Municipio"
                    disabled={isMunicipalityDisabled}
                    required
                    submitted={submitted}
                    onChange={(e) =>  handleDropdownChange('municipal', e.value)}
                    className={classNames({ 'p-invalid': submitted && !user.municipal })}
                />
                {submitted && !user.municipal && (
                    <small className="p-error">Municipio es requerido.</small>
                )}
            </div>

        </div>
    );
}

