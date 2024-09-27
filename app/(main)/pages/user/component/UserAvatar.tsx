import React from 'react';
import { FileUpload } from 'primereact/fileupload';

interface UserAvatarProps {
    handleImageUpload: (file: File) => void;
}
const UserAvatar = ({ handleImageUpload }: UserAvatarProps) => (
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
            uploadLabel="Subir imagen"
            cancelLabel="Cancelar"
            multiple={false}
        />
    </div>
);

export default UserAvatar;
