import React from 'react';
import { FileUpload } from 'primereact/fileupload';

interface UserAvatarProps {
    handleImageUpload: (file: File) => void;
}
const UserAvatar = ({ handleImageUpload }: UserAvatarProps) => {
    const onSelect = (e: { files: File[] }) => {
        if (e.files && e.files.length > 0) {
            handleImageUpload(e.files[0]);
        }
    };
    return (
    <div className="avatar-upload">
        <label htmlFor="avatar">Avatar</label>
        <FileUpload
            id="avatar"
            name="avatar"
            mode="advanced"
            accept="image/*"
            maxFileSize={1000000} // 1 MB máximo
            onSelect={onSelect}
            chooseLabel="Seleccionar Imagen"
            cancelLabel="Cancelar"
            multiple={false}
        />
    </div>
);
}

export default UserAvatar;
