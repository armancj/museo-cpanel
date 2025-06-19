import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { NameField } from '@/app/common/component/NameFieldProps';
import { useUserDetailsForm } from '@/app/(main)/pages/user/hooks/useUserDetailsForm';
import { ROLES_REQUIRING_INSTITUTION, USER_ROLES } from '@/app/(main)/pages/user/util/user-roles.const';
import { EmailField } from '@/app/common/component/EmailField';
import { PhoneField } from '@/app/common/component/PhoneField';
import { findOptionByValue } from '@/app/(main)/pages/user/util/validation';
import { UsersDatum } from '@/app/service/UserService';


interface UserDetailsFormProps {
    user: any;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
    submitted: boolean;
    editingUser?: UsersDatum | null | undefined;
}

const UserDetailsForm: React.FC<UserDetailsFormProps> = ({
                                                             user,
                                                             onInputChange,
                                                             submitted,
                                                             editingUser
                                                         }) => {
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
        handleInstitutionChange,
    } = useUserDetailsForm({ editingUser, onInputChange });

    const showInstitutionField = ROLES_REQUIRING_INSTITUTION.includes(user.roles as any);

    return (
        <div className="grid">
            <NameField
                value={user.name}
                onChange={(e) => onInputChange(e, 'name')}
                submitted={submitted}
                required
            />

            {/* Apellidos */}
            <div className="col-12 md:col-7">
                <label htmlFor="lastName">Apellidos</label>
                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-id-card"></i>
                    </span>
                    <InputText
                        id="lastName"
                        value={user.lastName || user.surname || ''}
                        onChange={(e) => onInputChange(e, 'lastName')}
                    />
                </div>
            </div>

            <EmailField
                value={user.email}
                onChange={(e) => onInputChange(e, 'email')}
                submitted={submitted}
            />

            <PhoneField
                value={user.mobile || user.phone}
                onChange={(e) => onInputChange(e as React.ChangeEvent<HTMLInputElement>, 'mobile')}
                submitted={submitted}
            />

            {/* Rol */}
            <div className="field col-12 md:col-3 mt-2">
                <label htmlFor="roles">Rol*</label>
                <Dropdown
                    id="roles"
                    value={user.roles}
                    options={USER_ROLES}
                    onChange={(e) => onInputChange({ target: { value: e.value } } as any, 'roles')}
                    placeholder="Seleccionar Rol"
                    className={classNames({ 'p-invalid': submitted && !user.roles })}
                />
                {submitted && !user.roles && (
                    <small className="p-error">Rol es requerido.</small>
                )}
            </div>

            {/* País */}
            <div className="field col-12 md:col-3 mt-2">
                <label htmlFor="nationality">País*</label>
                <Dropdown
                    id="nationality"
                    value={findOptionByValue(countries, user.nationality)}
                    options={countries}
                    optionLabel="name"
                    onChange={(e) => handleCountryChange(e.value)}
                    placeholder="Seleccionar País"
                    className={classNames({ 'p-invalid': submitted && !user.nationality })}
                    filter
                />
                {submitted && !user.nationality && (
                    <small className="p-error">País es requerido.</small>
                )}
            </div>

            {/* Provincia */}
            <div className="field col-12 md:col-4 mt-2">
                <label htmlFor="province">Provincia*</label>
                <Dropdown
                    id="province"
                    value={findOptionByValue(provinces, user.province)}
                    options={provinces}
                    optionLabel="name"
                    onChange={(e) => handleProvinceChange(e.value)}
                    placeholder="Seleccionar Provincia"
                    disabled={isProvinceDisabled}
                    className={classNames({ 'p-invalid': submitted && !user.province })}
                    filter
                />
                {submitted && !user.province && (
                    <small className="p-error">Provincia es requerida.</small>
                )}
            </div>

            {/* Municipio */}
            <div className="field col-12 md:col-4">
                <label htmlFor="municipal">Municipio*</label>
                <Dropdown
                    id="municipal"
                    value={findOptionByValue(municipalities, user.municipal)}
                    options={municipalities}
                    optionLabel="name"
                    onChange={(e) => handleMunicipalityChange(e.value)}
                    placeholder="Seleccionar Municipio"
                    disabled={isMunicipalityDisabled}
                    className={classNames({ 'p-invalid': submitted && !user.municipal })}
                    filter
                />
                {submitted && !user.municipal && (
                    <small className="p-error">Municipio es requerido.</small>
                )}
            </div>

            {/* Institución */}
            {showInstitutionField && (
                <div className="field col-12 md:col-4">
                    <label htmlFor="institutionId">Institución*</label>
                    <Dropdown
                        id="institutionId"
                        value={(() => {
                            const institutionId = user.institutionId || user.institution?.uuid;
                            return institutions.find(inst => inst.uuid === institutionId) || null;
                        })()}
                        options={institutions}
                        optionLabel="name"
                        onChange={(e) => handleInstitutionChange(e.value)}
                        placeholder="Seleccionar Institución"
                        disabled={isInstitutionDisabled}
                        className={classNames({
                            'p-invalid': submitted && !user.institutionId
                        })}
                        filter
                    />
                    {submitted && !user.institutionId && (
                        <small className="p-error">Institución es requerida.</small>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserDetailsForm;
