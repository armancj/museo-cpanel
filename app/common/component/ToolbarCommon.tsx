import React from 'react';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';

interface ToolbarProps {
    selects: any[];
    setDialog: (value: ((prevState: boolean) => boolean) | boolean) => void;
    confirmDeleteSelected: (select: any) => void;
    exportExcel: () => void;
    openNew: () => void;
    labels?: {
        add?: string;
        delete?: string;
        export?: string;
    };
    start?: () => JSX.Element;
    end?: () => JSX.Element;
}

export function ToolbarCommon({ selects, setDialog, confirmDeleteSelected, exportExcel, openNew, labels = { add: 'Agregar', delete: 'Eliminar', export: 'Exportar' }, start, end }: ToolbarProps) {
    const handleDelete = () => {
        if (selects.length) {
            confirmDeleteSelected(selects[0]);
        }
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label={labels.add} icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
                    <Button label={labels.delete} icon="pi pi-trash" severity="danger" onClick={handleDelete} disabled={!selects || !selects.length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label={labels.export} icon="pi pi-upload" severity="help" onClick={exportExcel} />
            </React.Fragment>
        );
    };

    return <Toolbar className="mb-4" start={start} end={end}></Toolbar>;
}
