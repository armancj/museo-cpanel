import React, { useState } from 'react';
import { UsersDatum, UsersResponse } from '@/app/(main)/pages/user/UserService';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';

interface UserFormProps {
    user: Omit<UsersDatum, 'uuid' | 'deleted' | 'active'>;
    setUser: React.Dispatch<React.SetStateAction<UsersDatum>;
}

export const UserForm: React.FC<UserFormProps> = ({ user, setUser }) => {
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        setUser({ ...user, [name]: val });
    };

    return (
        <div>
            <div className="field">
                <label htmlFor="name">Nombre</label>
                <InputText
                    id="name"
                    name="name"
                    value={user.name}
                    onChange={onInputChange}
                    required
                />
            </div>
            <div className="field">
                <label htmlFor="lastName">Apellidos</label>
                <InputText
                    id="lastName"
                    name="lastName"
                    value={user.lastName}
                    onChange={onInputChange}
                    required
                />
            </div>
            <div className="field">
                <label htmlFor="mobile">Teléfono</label>
                <InputText
                    id="mobile"
                    name="mobile"
                    value={user.mobile}
                    onChange={onInputChange}
                    required
                />
            </div>
            <div className="field">
                <label htmlFor="municipal">Municipio</label>
                <InputText
                    id="municipal"
                    name="municipal"
                    value={user.municipal}
                    onChange={onInputChange}
                    required
                />
            </div>
            <div className="field">
                <label htmlFor="province">Provincia</label>
                <InputText
                    id="province"
                    name="province"
                    value={user.province}
                    onChange={onInputChange}
                    required
                />
            </div>
            <div className="field">
                <label htmlFor="nationality">País</label>
                <InputText
                    id="nationality"
                    name="nationality"
                    value={user.nationality}
                    onChange={onInputChange}
                    required
                />
            </div>
            <div className="field">
                <label htmlFor="email">Correo</label>
                <InputText
                    id="email"
                    name="email"
                    value={user.email}
                    onChange={onInputChange}
                    required
                />
            </div>
            <div className="field">
                <label htmlFor="address">Dirección</label>
                <InputTextarea
                    id="address"
                    name="address"
                    value={user.address}
                    onChange={onInputChange}
                    required
                />
            </div>
            <div className="field">
                <label htmlFor="roles">Rol</label>
                <InputText
                    id="roles"
                    name="roles"
                    value={user.roles}
                    onChange={onInputChange}
                    required
                />
            </div>
        </div>

    );
};
