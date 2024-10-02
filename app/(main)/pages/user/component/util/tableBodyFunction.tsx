import { UsersDatum } from '@/app/(main)/pages/user/UserService';
import { Button } from 'primereact/button';
import React from 'react';

export function TableBodyFunction(toggleUserActivation: (uuid: string, active: boolean) => Promise<void>) {
    const nameBodyTemplate = (rowData: UsersDatum) => {
        return (
            <>
                <span className="p-column-title">Name</span>
        {rowData.name}
        </>
    );
    };

    const actionBodyTemplate = (rowData: UsersDatum) => {
        return (
            <Button
                icon={rowData.active ? 'pi pi-times' : 'pi pi-check'}
        className={`p-button-rounded p-button-text ${rowData.active ? 'p-button-danger' : 'p-button-success'}`}
        tooltip={rowData.active ? 'Desactivar Usuario' : 'Activar Usuario'}
        tooltipOptions={{ position: 'top' }}
        onClick={() => toggleUserActivation(rowData.uuid, !rowData.active)}
        />
    );
    };

    const statusBodyTemplate = (rowData: UsersDatum) => {
        const status = rowData.active ? 'ACTIVADO' : 'DESACTIVADO';
        const statusCss = rowData.active ? 'status-instock' : 'status-outofstock';
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`product-badge ${statusCss}`}>{status}</span>
        </>
    );
    };
    return { nameBodyTemplate, actionBodyTemplate, statusBodyTemplate };
}
