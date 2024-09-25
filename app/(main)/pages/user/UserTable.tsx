import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import React, { useRef } from 'react';
import { UsersDatum, UsersResponse } from '@/app/(main)/pages/user/UserService';
import { Demo } from '@/types';
import { ImageBodyTemplate } from '@/app/(main)/pages/user/imageBodyTemplate';

interface UserTableProps {
    users: UsersResponse | null,
    selectedUsers: any,
    globalFilter: string,
    setGlobalFilter: (value: (((prevState: string) => string) | string)) => void,
    setSelectedUsers: (value: (((prevState: UsersDatum[]) => UsersDatum[]) | UsersDatum[])) => void
}

export const UserTable = ({ users, selectedUsers, globalFilter, setGlobalFilter, setSelectedUsers }: UserTableProps) => {
    const dt = useRef<DataTable<UsersDatum[]>>(null);

    const nameBodyTemplate = (rowData: UsersDatum) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const statusBodyTemplate = (rowData: UsersDatum) => {
        const status = rowData.active ? 'ACTIVADO' : 'DESACTIVADO';
        const statusCss =  rowData.active? 'status-instock' : 'status-outofstock'
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`product-badge ${statusCss}`}>{status}</span>
            </>
        );
    };

    return (
        <>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    type="search"
                    onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                    placeholder="Search..."
                />
            </span>
            <DataTable
                ref={dt}
                value={users?.usersData}
                selection={selectedUsers}
                onSelectionChange={(e) => setSelectedUsers(e.value as any)}
                dataKey="uuid"
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                className="datatable-responsive"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuarios"
                globalFilter={globalFilter}
                emptyMessage="No hay usuarios agregados."
                responsiveLayout="scroll"
            >
                <Column selectionMode="multiple" headerStyle={{ width: '4rem' }} />
                <Column field="name" sortable body={nameBodyTemplate} header="Nombre" headerStyle={{ minWidth: '5rem' }} />
                <Column field="lastName" sortable header="Apellidos" headerStyle={{ minWidth: '5rem' }} />
                <Column field="municipal" header="Municipio" sortable headerStyle={{ minWidth: '5rem' }} />
                <Column field="province" header="Provincia" headerStyle={{ minWidth: '5rem' }} />
                <Column field="nationality" header="Pais" headerStyle={{ minWidth: '5rem' }} />
                <Column field="mobile" header="Teléfono" headerStyle={{ minWidth: '5rem' }} />
                <Column field="email" header="Correo" sortable headerStyle={{ minWidth: '5rem' }} />
                <Column field="address" header="Dirección" headerStyle={{ minWidth: '5rem' }} />
                <Column field="active" header="Estado" body={statusBodyTemplate} sortable headerStyle={{ minWidth: '5rem' }} />
                <Column field="roles" header="Rol" sortable />
                <Column field="avatar"  body={ImageBodyTemplate} header="Avatar" />
            </DataTable>
        </>
    );
};
