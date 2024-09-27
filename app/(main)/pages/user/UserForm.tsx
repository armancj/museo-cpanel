import React, { useRef, useState } from 'react';
import { UsersDatum } from '@/app/(main)/pages/user/UserService';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import { classNames } from 'primereact/utils';
import { Fieldset } from 'primereact/fieldset';

interface UserFormProps {
    user: UsersDatum;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void;
    submitted: boolean;
    onImageUpload: (file: File) => void; // Nueva prop para manejar la carga de imágenes
}

export const UserForm: React.FC<UserFormProps> = ({ user, onInputChange, submitted, onImageUpload }) => {

    const handleImageUpload = (file: File) => {
        onImageUpload(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
    };


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
                        { field: 'roles', label: 'Rol', required: true },
                    ].map(({ field, label, required }) => (
                        <div className="field col-12 md:col-6" key={field}>
                            <label htmlFor={field}>{label}</label>
                            <InputText
                                id={field}
                                name={field}
                                value={user[field]}
                                onChange={(e) => onInputChange(e, field)}
                                required={required}
                                className={classNames({ 'p-invalid': submitted && !user[field] })}
                            />
                            {submitted && !user[field] &&
                                <small className="p-invalid">{`${label} es requerido.`}</small>}
                        </div>
                    ))}
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
                        uploadLabel={"Subir imagen"}
                        cancelLabel={"Cancelar"}
                        multiple={false}
                    >
                    </FileUpload>
            </div>
            </Fieldset>

        </div>
    );
};
