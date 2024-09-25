import { UsersResponse } from '@/app/(main)/pages/user/UserService';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';

interface UserToolbarProps {
    setUsers: (value: (((prevState: (UsersResponse | undefined)) => (UsersResponse | undefined)) | UsersResponse | undefined)) => void,
    selectedUsers: any
}

export const UserToolbar = ({ setUsers, selectedUsers }: UserToolbarProps) => {

    const openNew = () => {
        // Funcionalidad para abrir un nuevo diálogo
    };

    const confirmDeleteSelected = () => {
        // Confirmar borrado
    };

    const exportCSV = () => {
        // Exportar productos
    };

    return (
        <div className="my-2">
            <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
            <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedUsers?.length} />
            <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
            <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
        </div>
    );
};
