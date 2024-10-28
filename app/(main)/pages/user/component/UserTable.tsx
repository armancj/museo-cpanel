import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import React from 'react';
import { UsersDatum } from '@/app/service/UserService';
import { ImageBodyTemplate } from '@/app/(main)/pages/user/component/imageBodyTemplate';
import { TableBodyFunction } from '@/app/(main)/pages/user/component/util/tableBodyFunction';
import styles from './UserTable.module.css';

interface UserTableProps {
    users: UsersDatum[] | null,
    selectedUsers: any,
    globalFilter: string,
    setGlobalFilter: (value: (((prevState: string) => string) | string)) => void,
    setSelectedUsers: (value: (((prevState: UsersDatum[]) => UsersDatum[]) | UsersDatum[])) => void,
    totalPage: number,
    totalElement: { totalElement: any },
    dt: React.RefObject<DataTable<UsersDatum[]>>,
    toggleUserActivation: (uuid: string, active: boolean) => Promise<void>,
    deleteUser: (uuid: string) => void,
    editUser: (updatedUser: Partial<UsersDatum>) => Promise<void>
}

export const UserTable = ({
                              users,
                              selectedUsers,
                              globalFilter,
                              setGlobalFilter,
                              setSelectedUsers,
                              dt,
                              toggleUserActivation,
                              deleteUser,
                              editUser
                          }: UserTableProps) => {

    const { nameBodyTemplate, actionBodyTemplate, statusBodyTemplate } = TableBodyFunction({toggleUserActivation, deleteUser, editUser});


    return (
        <>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    type="search"
                    onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                    placeholder="Buscar..."
                />
            </span>
            <DataTable
                ref={dt}
                value={users || []}
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
                style={{ tableLayout: 'auto' }}
            >
                <Column selectionMode="multiple" headerStyle={{ width: '4rem' }} />
                <Column field="name" sortable body={nameBodyTemplate} header="Nombre" headerStyle={{ minWidth: '5rem' }} />
                <Column field="lastName" sortable header="Apellidos" headerStyle={{ minWidth: '5rem', width: 'auto' }} style={{ whiteSpace: 'nowrap' }} />
                <Column field="municipal" header="Municipio" sortable />
                <Column field="province" header="Provincia" headerStyle={{ minWidth: '5rem', width: 'auto' }} style={{ whiteSpace: 'nowrap' }} />
                <Column field="nationality" header="Pais" headerStyle={{ minWidth: '5rem' }} />
                <Column field="mobile" header="Teléfono" headerStyle={{ minWidth: '5rem' }} />
                <Column field="email" header="Correo" sortable headerStyle={{ minWidth: '5rem' }} />
                <Column field="address" header="Dirección" headerStyle={{ minWidth: '20rem', width: 'auto' }} style={{ whiteSpace: 'normal' }} />
                <Column field="active" header="Estado" body={statusBodyTemplate} sortable headerStyle={{ minWidth: '5rem' }} />
                <Column field="roles" header="Rol" sortable />
                <Column field="avatar" body={ImageBodyTemplate} header="Avatar" />
                <Column body={actionBodyTemplate} header="Acciones" headerStyle={{ minWidth: '12rem' }} bodyStyle={{ overflow: 'visible' }} className={styles.stickyColumn} headerClassName={styles.stickyHeader} />
            </DataTable>
        </>
    );
};
