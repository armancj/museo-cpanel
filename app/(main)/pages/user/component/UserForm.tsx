import React from 'react';
import {
    UsersDatum
} from '@/app/(main)/pages/user/UserService';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import { classNames } from 'primereact/utils';
import { Fieldset } from 'primereact/fieldset';
import DropdownField from '@/app/(main)/pages/user/component/DropdownField';
import { useAddressData } from '@/app/(main)/pages/user/useAddressData';
import { Password } from 'primereact/password';

interface UserFormProps {
    user: UsersDatum;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void;
    submitted: boolean;
    onImageUpload: (file: File) => void; // Nueva prop para manejar la carga de imágenes
}


export const UserForm: React.FC<UserFormProps> = ({ user, onInputChange, submitted, onImageUpload }) => {
    const {
        countries,
        provinces,
        municipalities,
        isProvinceDisabled,
        isMunicipalityDisabled,
        handleCountryChange,
        handleProvinceChange
    } = useAddressData();

    const handleImageUpload = (file: File) => {
        onImageUpload(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
    };

    const dropdownFields = ['municipal', 'province', 'nationality', 'roles'];

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validateMobile = (mobile: string) => {
        const re = /^\+?[1-9]\d{1,14}$/;
        return re.test(String(mobile));
    };

    const roles = [
        { name: 'Super Administrador', value: 'super Administrador' },
        { name: 'Administrador', value: 'Administrador' },
        { name: 'Especialista', value: 'Especialista' },
        { name: 'Técnico', value: 'Técnico' },
    ];

    return (
        <div className="flex">
            <Fieldset legend="Detalles del Usuario" className="p-4 flex-grow-1">
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
                                    options={field === dropdownFields[2] ? countries : field === dropdownFields[1] ? provinces : field === dropdownFields[3] ? roles : municipalities}
                                    onChange={field === dropdownFields[2] ?
                                        (e) => handleCountryChange(e.target.value, onInputChange) :
                                        field === dropdownFields[1] ?
                                            (e) => handleProvinceChange(e.target.value, onInputChange) :
                                            (e) => onInputChange(e, field)}
                                    optionLabel="name"
                                    placeholder={`Seleccionar ${label}`}
                                    submitted={submitted}
                                    disabled={field === dropdownFields[2] ? false:
                                        field === dropdownFields[1] ? isProvinceDisabled:
                                            field === dropdownFields[3] ? false:
                                                isMunicipalityDisabled}
                                />
                            ) : (
                                <InputText
                                    id={field}
                                    name={field}
                                    value={user[field]}
                                    onChange={(e) => onInputChange(e, field)}
                                    required={required}
                                    className={classNames({ 'p-invalid': submitted && !user[field], 'p-invalid': field === 'email' && !validateEmail(user[field]), 'p-invalid': field === 'mobile' && !validateMobile(user[field]) })}
                                />
                            )}
                            {submitted && !user[field] &&
                                <small className="p-invalid">{`${label} es requerido.`}</small>}
                            {submitted && field === 'email' && !validateEmail(user[field]) &&
                                <small className="p-invalid">Correo no es válido.</small>}
                            {submitted && field === 'mobile' && !validateMobile(user[field]) &&
                                <small className="p-invalid">Teléfono no es válido.</small>}
                        </div>
                    ))}
                    <div className="field col-3">
                        <label htmlFor="password">Password</label>
                        <Password
                            id={'password'}
                            name={'password'}
                            value={user.password}
                            onChange={(e) => onInputChange(e, 'password')}
                            required
                            className={classNames({ 'p-invalid': submitted && !user.password })}
                            toggleMask />
                        {submitted && !user.password && <small className="p-invalid">Contraseña es requerida.</small>}
                    </div>
                    <div className="field col-12">
                        <label htmlFor="address">Dirección</label>
                        <InputTextarea
                            id="address"
                            name="address"
                            value={user.address}
                            onChange={(e) => onInputChange(e, 'address')}
                            required
                            className={classNames({ 'p-invalid': submitted && !user.address })}
                        />
                        {submitted && !user.address && <small className="p-invalid">Dirección es requerida.</small>}
                    </div>
                </div>

                <div className="avatar-upload">
                    <label htmlFor="avatar">Avatar</label>
                    <FileUpload
                        id="avatar"
                        name="avatar"
                        mode="advanced"
                        accept="image/*"
                        maxFileSize={1000000}
                        onUpload={(e) => handleImageUpload(e.files[0])}
                        chooseLabel="Seleccionar Imagen"
                        uploadLabel={'Subir imagen'}
                        cancelLabel={'Cancelar'}
                        multiple={false}
                    >
                    </FileUpload>
                </div>
            </Fieldset>

        </div>
    );
};
