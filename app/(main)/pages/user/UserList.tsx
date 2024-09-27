import { useRef, useState } from 'react';

import { Toast } from 'primereact/toast';
import { UsersDatum } from '@/app/(main)/pages/user/UserService';
import { Dialog } from 'primereact/dialog';
import { UserForm } from '@/app/(main)/pages/user/UserForm';
import { Button } from 'primereact/button';
import { UserTable } from '@/app/(main)/pages/user/UserTable';
import { emptyUser, useUserManagement } from '@/app/(main)/pages/user/useUserManagement';
import { DataTable } from 'primereact/datatable';
import { UserToolbar } from '@/app/(main)/pages/user/UserToolbar';

export const UserList = () => {
    const { users, userDialog, setUserDialog, saveUser, user, totalPage, totalElement, setUser, submitted, setSubmitted, toast,  } = useUserManagement();


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


    const confirmDeleteSelected = (user: UsersDatum) => {
        setDeleteUserDialog(true);
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
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
                        <UserForm onImageUpload={handleImageUpload} user={user} onInputChange={(e, field) => setUser({ ...user, [field]: e.target.value })}  submitted={submitted} />
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
