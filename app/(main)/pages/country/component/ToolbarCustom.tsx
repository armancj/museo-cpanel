import React from 'react';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';

interface ToolbarProps {
    selects: any[],
    setDialog: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    confirmDeleteSelected: (select: any) => void,
    exportExcel: () => void,
    openNew: () => void
}

export function ToolbarCustom({ selects, setDialog, confirmDeleteSelected, exportExcel, openNew }: ToolbarProps) {

    const handleDelete = () => {
        if (selects.length) {
            confirmDeleteSelected(selects[0]);
        }
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={handleDelete} disabled={!selects  || !selects.length} />
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
}
