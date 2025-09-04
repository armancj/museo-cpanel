import React from 'react';
import { Button } from 'primereact/button';
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
                    <Button label="Agregar Tipo de Patrimonio" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Eliminar Tipo de Patrimonio" icon="pi pi-trash" severity="danger" onClick={handleDelete} disabled={!selects  || !selects.length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportExcel} />
            </React.Fragment>
        );
    };

    return (
        <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>
    );
}
