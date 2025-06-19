import React from 'react';
import {
    UsersDatum
} from '@/app/service/UserService';
import { Fieldset } from 'primereact/fieldset';
import UserPassword from '@/app/(main)/pages/user/component/UserPassword';
import UserAddress from '@/app/(main)/pages/user/component/UserAddress';
import UserAvatar from '@/app/(main)/pages/user/component/UserAvatar';
import UserDetailsForm from './UserDetails';


interface UserFormProps {
    user: UsersDatum;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void;
    submitted: boolean;
    onImageUpload: (file: File) => void;
    editingUser?: UsersDatum | null;
}

export const UserForm: React.FC<UserFormProps> = ({
                                                      user,
                                                      onInputChange,
                                                      submitted,
                                                      onImageUpload,
                                                      editingUser
                                                  }) => {

    const handleImageUpload = (file: File) => {
        onImageUpload(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
    };

    const avatarURL = user.avatar?.id ? process.env.NEXT_PUBLIC_API_BASE_URL + `file-storage/${user.avatar.id}` : undefined;

    return (
        <div className="p-fluid formgrid grid gap-4">
            <Fieldset legend="Detalles del Usuario" className="col-12 md:col-8 lg:col-6">
                <UserDetailsForm
                    user={user}
                    onInputChange={onInputChange}
                    submitted={submitted}
                    editingUser={editingUser}
                />
            </Fieldset>

            <Fieldset legend="Avatar" className="col-12 md:col-5 lg:col-4">
                <UserAvatar handleImageUpload={handleImageUpload} avatarURL={avatarURL} />
            </Fieldset>

            <Fieldset legend="Contacto y Dirección" className="col-12 md:col-8 lg:col-6">
                <UserAddress user={user} onInputChange={onInputChange} submitted={submitted} />
            </Fieldset>

            <Fieldset legend="Seguridad" className="col-12 md:col-4 lg:col-3">
                <UserPassword user={user} onInputChange={onInputChange} submitted={submitted} />
            </Fieldset>
        </div>
    );
};
