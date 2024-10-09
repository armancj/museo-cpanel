import { UsersDatum } from '@/app/service/UserService';
import { Button } from 'primereact/button';
import React from 'react';

interface TableBodyFunctionProps {
    toggleUserActivation: (uuid: string, active: boolean) => Promise<void>;
    editUser: (updatedUser: Partial<UsersDatum>) => Promise<void>
    deleteUser: (uuid: string) => void;
}

export function TableBodyFunction({ toggleUserActivation, editUser, deleteUser }: TableBodyFunctionProps) {
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
            <div>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-text p-button-warning"
                    tooltip="Editar Usuario"
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => editUser(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-text p-button-danger"
                    tooltip="Eliminar Usuario"
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => deleteUser(rowData.uuid)}
                />
                <Button
                    icon={rowData.active ? 'pi pi-times' : 'pi pi-check'}
                    className={`p-button-rounded p-button-text ${rowData.active ? `p-button-danger` : `p-button-success`}`}
                    tooltip={rowData.active ? 'Desactivar Usuario' : 'Activar Usuario'}
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => toggleUserActivation(rowData.uuid, !rowData.active)}
                />
            </div>
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
