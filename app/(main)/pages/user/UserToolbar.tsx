import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';
import React from 'react';

interface UserToolbarProps {
    selectedUsers: any,
    setUserDialog: (value: (((prevState: boolean) => boolean) | boolean)) => void
}

export const UserToolbar = ({ selectedUsers, setUserDialog }: UserToolbarProps) => {

    const openNew = () => {
        setUserDialog(true);
    };

    const confirmDeleteSelected = () => {
        setUser(product);
        setDeleteProductDialog(true);
    };

    const exportCSV = () => {
        // Exportar productos
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !(selectedProducts as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    return (
        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
    );
};
