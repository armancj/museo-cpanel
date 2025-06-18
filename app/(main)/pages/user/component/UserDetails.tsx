import React, { useMemo, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { useAddressData } from '@/app/(main)/pages/user/useAddressData';
import DropdownField from '@/app/(main)/pages/user/component/DropdownField';
import { UsersDatum } from '@/app/service/UserService';
import { InputMask } from 'primereact/inputmask';

interface UserDetailsProps {
    submitted: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void;
    user: UsersDatum;
    editingUser?: UsersDatum | null;
}

export function UserDetails({ user, onInputChange, submitted, editingUser }: Readonly<UserDetailsProps>) {
    const {
        countries,
        provinces,
        municipalities,
        institutions,
        isProvinceDisabled,
        isMunicipalityDisabled,
        isInstitutionDisabled,
        handleCountryChange,
        handleProvinceChange,
        handleMunicipalityChange,
        initializeForEdit,
        resetDependentStates,
    } = useAddressData();

    const roles = useMemo(
        () => [
            { name: 'Super Administrador', value: 'super Administrador' },
            { name: 'Administrador', value: 'Administrador' },
            { name: 'Especialista', value: 'Especialista' },
            { name: 'Técnico', value: 'Técnico' },
        ],
        [],
    );

    // Inicializar datos cuando se está editando un usuario
    useEffect(() => {
        if (editingUser && countries.length > 0) {
            if (editingUser.nationality) {
                initializeForEdit(
                    editingUser.nationality,
                    editingUser.province || undefined,
                    editingUser.municipal || undefined
                );
            }
        } else if (!editingUser) {
            resetDependentStates();
        }
    }, [editingUser, countries, initializeForEdit, resetDependentStates]);

    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validateMobile = (mobile: string): boolean => {
        return mobile.trim().length > 0;
    };

    const handleDropdownChange = async (field: string, value: any) => {
        if (field === 'nationality') {
            await handleCountryChange(value, onInputChange);
        } else if (field === 'province') {
            await handleProvinceChange(value, onInputChange);
        } else if (field === 'municipal') {
            await handleMunicipalityChange(value, onInputChange);
        } else {
            onInputChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>, field);
        }
    };

    // Función para encontrar el objeto completo en las opciones
    const findOptionByValue = (options: any[], value: string, optionLabel: string = 'name', optionValue?: string) => {
        if (!value || !options?.length) return null;

        const searchKey = optionValue || optionLabel;
        return options.find(option => option[searchKey] === value) || null;
    };

    return (
        <div className="grid">
            {/* Nombre */}
            <div className="col-12 md:col-5">
                <label htmlFor="name">Nombre*</label>
                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi pi-user"></i>
                    </span>
                    <InputText
                        id="name"
                        value={user.name}
                        onChange={(e) => onInputChange(e, 'name')}
                        required
                        className={classNames({ 'p-invalid': submitted && !user.name })}
                    />
                </div>
                {submitted && !user.name && <small className="p-error">Nombre es requerido.</small>}
            </div>

            {/* Apellidos */}
            <div className="col-12 md:col-7">
                <label htmlFor="lastName">Apellidos</label>
                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-id-card"></i>
                    </span>
                    <InputText
                        id="lastName"
                        value={user.lastName}
                        onChange={(e) => onInputChange(e, 'lastName')}
                    />
                </div>
            </div>

            {/* Email */}
            <div className="col-12 md:col-7 mt-2">
                <label htmlFor="email">Correo*</label>
                <div className="p-inputgroup">
                     <span className="p-inputgroup-addon">
                        <i className="pi pi-envelope"></i>
                     </span>
                    <InputText
                        id="email"
                        value={user.email}
                        onChange={(e) => onInputChange(e, 'email')}
                        required
                        className={classNames({ 'p-invalid': submitted && !validateEmail(user.email) })}
                    />
                </div>
                {submitted && !validateEmail(user.email) && (
                    <small className="p-error">Correo no válido.</small>
                )}
            </div>

            {/* Teléfono */}
            <div className="col-12 md:col-5 mt-2">
                <label htmlFor="mobile">Teléfono*</label>
                <div className="p-inputgroup">
                     <span className="p-inputgroup-addon">
                        <i className="pi pi-phone"></i>
                     </span>
                    <InputMask
                        id="mobile"
                        value={user.mobile}
                        onChange={(e) => onInputChange(e as unknown as React.ChangeEvent<HTMLInputElement>, 'mobile')}
                        mask="(+53) 99-99-99-99" placeholder="(+53) 99-99-99-99"
                        required
                        className={classNames({ 'p-invalid': submitted && !validateMobile(user.mobile) })}
                    />
                </div>
                {submitted && !validateMobile(user.mobile) && (
                    <small className="p-error">Teléfono no válido.</small>
                )}
            </div>

            {/* Roles */}
            <div className="field col-12 md:col-3 mt-2">
                <label htmlFor="roles">Rol*</label>
                <DropdownField
                    id="roles"
                    name="roles"
                    value={findOptionByValue(roles, user.roles, 'name', 'value')}
                    options={roles}
                    optionLabel="name"
                    optionValue="value"
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
            <div className="field col-12 md:col-3 mt-2">
                <label htmlFor="nationality">País*</label>
                <DropdownField
                    id="nationality"
                    name="nationality"
                    value={findOptionByValue(countries, user.nationality)}
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
            <div className="field col-12 md:col-4 mt-2">
                <label htmlFor="province">Provincia*</label>
                <DropdownField
                    id="province"
                    name="province"
                    value={findOptionByValue(provinces, user.province)}
                    options={provinces}
                    optionLabel="name"
                    placeholder="Seleccionar Provincia"
                    disabled={isProvinceDisabled}
                    required
                    submitted={submitted}
                    className={classNames({ 'p-invalid': submitted && !user.province })}
                    onChange={(e) => handleDropdownChange('province', e.value)}
                    filter={true}
                />
                {submitted && !user.province && (
                    <small className="p-error">Provincia es requerida.</small>
                )}
            </div>

            {/* Municipio */}
            <div className="field col-12 md:col-4">
                <label htmlFor="municipal">Municipio*</label>
                <DropdownField
                    id="municipal"
                    name="municipal"
                    value={findOptionByValue(municipalities, user.municipal)}
                    options={municipalities}
                    optionLabel="name"
                    placeholder="Seleccionar Municipio"
                    disabled={isMunicipalityDisabled}
                    required
                    submitted={submitted}
                    onChange={(e) => handleDropdownChange('municipal', e.value)}
                    className={classNames({ 'p-invalid': submitted && !user.municipal })}
                    filter={true}
                />
                {submitted && !user.municipal && (
                    <small className="p-error">Municipio es requerido.</small>
                )}
            </div>

            {/* Institución - solo para Especialista y Técnico */}
            {(user.roles === 'Especialista' || user.roles === 'Técnico') && (
                <div className="field col-12 md:col-4">
                    <label htmlFor="institution">Institución*</label>
                    <DropdownField
                        id="institution"
                        name="institution"
                        value={findOptionByValue(institutions, user.institution, 'name', 'uuid')}
                        options={institutions}
                        optionLabel="name"
                        optionValue="uuid"
                        placeholder="Seleccionar Institución"
                        disabled={isInstitutionDisabled}
                        required
                        submitted={submitted}
                        onChange={(e) => handleDropdownChange('institution', e.value)}
                        className={classNames({ 'p-invalid': submitted && !user.institution })}
                        filter={true}
                    />
                    {submitted && !user.institution && (
                        <small className="p-error">Institución es requerida.</small>
                    )}
                </div>
            )}
        </div>
    );
}
