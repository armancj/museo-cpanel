import { useRef, useState } from 'react';

import { Toast } from 'primereact/toast';
import { UsersDatum } from '@/app/(main)/pages/user/UserService';
import { Dialog } from 'primereact/dialog';
import { UserForm } from '@/app/(main)/pages/user/component/UserForm';
import { Button } from 'primereact/button';
import { UserTable } from '@/app/(main)/pages/user/component/UserTable';
import { emptyUser, useUserManagement } from '@/app/(main)/pages/user/useUserManagement';
import { DataTable } from 'primereact/datatable';
import { UserToolbar } from '@/app/(main)/pages/user/component/UserToolbar';
import * as XLSX from 'xlsx';

export const UserList = () => {
    const {
        users,
        userDialog,
        setUserDialog,
        saveUser,
        user,
        totalPage,
        totalElement,
        setUser,
        submitted,
        setSubmitted,
        toast,  } = useUserManagement();


    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<UsersDatum[]>([]);
    const [globalFilter, setGlobalFilter] = useState('');

    const dt = useRef<DataTable<UsersDatum[]>>(null);

    const openNew = () => {
        setUser(emptyUser);
        setUserDialog(true);
    };

    const hideDialog = () => {
        setUserDialog(false);
    };


    const confirmDeleteSelected = () => {
        setDeleteUserDialog(true);
    };

    const exportCSV = () => {
        const table = dt.current?.getTable();
        const worksheet = XLSX.utils.table_to_sheet(table);

        // Ajustar el ancho de las columnas automáticamente
        const colWidths: any = [];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        data.forEach((row: any) => {
            row.forEach((cell: any, index: number) => {
                const cellLength = cell ? cell.toString().length : 10;
                colWidths[index] = Math.max(colWidths[index] || 10, cellLength);
            });
        });
        worksheet['!cols'] = colWidths.map((width: any) => ({ wch: width }));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'data.xlsx');
    };

    const userDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" text onClick={() => saveUser()} />
        </>
    );

    const handleImageUpload = (file: File) => {
        console.log(file)
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <UserToolbar
                        selectedUsers={selectedUsers}
                        setUserDialog={setUserDialog}
                        confirmDeleteSelected={confirmDeleteSelected}
                        exportExcel={exportCSV}
                        openNew={ openNew }
                    />

                    <UserTable
                        dt={dt}
                        users={users}
                        selectedUsers={selectedUsers}
                        setSelectedUsers={setSelectedUsers}
                        globalFilter={globalFilter}
                        setGlobalFilter = {setGlobalFilter}
                        totalPage={totalPage}
                        totalElement={{totalElement}}
                    />
                    <Dialog visible={userDialog} header="User Details" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                        <UserForm
                            onImageUpload={handleImageUpload}
                            user={user}
                            onInputChange={(e, field) => setUser({ ...user, [field]: e.target.value })}
                            submitted={submitted}
                        />
                    </Dialog>
                    <Dialog visible={deleteUserDialog} header="Confirm" modal footer={userDialogFooter} onHide={() => setDeleteUserDialog(false)}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {user && <span>Are you sure you want to delete <b>{user.name}</b>?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};
