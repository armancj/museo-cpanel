import React from 'react';
import {
    UsersDatum
} from '@/app/(main)/pages/user/UserService';
import { Fieldset } from 'primereact/fieldset';
import { UserDetails } from '@/app/(main)/pages/user/component/UserDetails';
import UserPassword from '@/app/(main)/pages/user/component/UserPassword';
import UserAddress from '@/app/(main)/pages/user/component/UserAddress';
import UserAvatar from '@/app/(main)/pages/user/component/UserAvatar';

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
                <UserDetails user={user} onInputChange={onInputChange} submitted={submitted} />
                <UserPassword user={user} onInputChange={onInputChange} submitted={submitted} />
                <UserAddress user={user} onInputChange={onInputChange} submitted={submitted} />
                <UserAvatar handleImageUpload={handleImageUpload} />
            </Fieldset>
        </div>
    );
};
