import { UsersDatum, UsersResponse } from '@/app/(main)/pages/user/UserService';
import React, { ChangeEvent, useState } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';

interface UserDialogProps {
    setUsers: React.Dispatch<React.SetStateAction<UsersResponse>>;
}

export const UserDialog = ({ setUsers }: UserDialogProps) => {
    const [user, setUser] = useState<Omit<UsersDatum, 'uuid' | 'deleted' | 'active'>>({
        mobile: '',
        municipal: '',
        email: '',
        address: '',
        lastName: '',
        name: '',
        nationality: '',
        province: '',
        avatar: undefined,
        roles: '',
    });

    const onInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const saveUser = () => {
        const newUser = { ...user } as UsersDatum;
        setUsers((prevUsers: UsersResponse) => ({
            ...prevUsers,
            usersData: [...prevUsers.usersData, newUser],
            totalElement: prevUsers.totalElement + 1,
        }));

        setUser({
            mobile: '',
            municipal: '',
            email: '',
            address: '',
            lastName: '',
            name: '',
            nationality: '',
            province: '',
            avatar: undefined,
            roles: '',
        });
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
            <button onClick={saveUser} className="p-button p-component">
                Guardar Usuario
            </button>
        </div>
    );
};
