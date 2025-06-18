import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';
import React from 'react';
import { UsersDatum } from '@/app/service/UserService';

interface UserToolbarProps {
    selectedUsers: any,
    setUserDialog: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    confirmDeleteSelected: (user: UsersDatum) => void,
    exportExcel: () => void,
    openNew: () => void,
    viewMode: 'table' | 'chart',
    setViewMode: (mode: 'table' | 'chart') => void
}

export const UserToolbar = ({
    selectedUsers,
    setUserDialog,
    confirmDeleteSelected,
    exportExcel,
    openNew,
    viewMode = 'table',
    setViewMode
}: UserToolbarProps) => {
    const handleDelete = () => {
        if (selectedUsers.length) {
            confirmDeleteSelected(selectedUsers[0]);
        }
    };

    const toggleViewMode = () => {
        setViewMode(viewMode === 'table' ? 'chart' : 'table');
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" className="mr-2" onClick={handleDelete} disabled={!selectedUsers || !selectedUsers.length} />
                    <Button
                        label={viewMode === 'table' ? "Ver Organigrama" : "Ver Tabla"}
                        icon={viewMode === 'table' ? "pi pi-sitemap" : "pi pi-table"}
                        severity="info"
                        onClick={toggleViewMode}
                    />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportExcel} />
            </React.Fragment>
        );
    };

    return (
        <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>
    );
};
