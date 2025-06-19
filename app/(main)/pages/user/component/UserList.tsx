import { useRef, useState } from 'react';

import { Toast } from 'primereact/toast';
import { UsersDatum } from '@/app/service/UserService';
import { Dialog } from 'primereact/dialog';
import { UserForm } from '@/app/(main)/pages/user/component/UserForm';
import { Button } from 'primereact/button';
import { UserTable } from '@/app/(main)/pages/user/component/UserTable';
import { emptyUser, useManagement } from '@/app/(main)/pages/user/hooks/useManagement';
import { DataTable } from 'primereact/datatable';
import { UserToolbar } from '@/app/(main)/pages/user/component/UserToolbar';
import { OrganizationalChart } from '@/app/(main)/pages/user/component/OrganizationalChart';
import { createdExportExcel } from '@/app/(main)/pages/util/export.functions';


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
        toast,
        toggleUserActivation,
        deleteUser,
        editUser,
        setSelectedAvatar,
        editingUser
    } = useManagement();

    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<UsersDatum[]>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');

    const dt = useRef<DataTable<UsersDatum[]>>(null);

    const openNew = () => {
        console.log('🆕 === CREANDO NUEVO USUARIO ===');
        setUser(emptyUser);
        setSubmitted(false);
        setUserDialog(true);
    };


    const hideDialog = () => {
        console.log('🚪 === CERRANDO DIÁLOGO ===');
        setSubmitted(false);
        setUserDialog(false);
    };

    const confirmDeleteSelected = () => {
        setDeleteUserDialog(true);
    };

    const exportCSV = createdExportExcel(dt);

    const userDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" text onClick={() => saveUser()} />
        </>
    );

    const handleImageUpload = (file: File) => {
        setSelectedAvatar(file);
        console.log("selected file:", file);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
        const { value } = e.target;

        // 🔍 DEBUG TEMPORAL
        console.log('🔥 Input change:', field, '=', value);

        setUser(prevUser => ({
            ...prevUser,
            [field]: value
        }));
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
                        openNew={openNew}
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                    />

                    {viewMode === 'table' ? (
                        <UserTable
                            dt={dt}
                            users={users}
                            selectedUsers={selectedUsers}
                            setSelectedUsers={setSelectedUsers}
                            globalFilter={globalFilter}
                            setGlobalFilter={setGlobalFilter}
                            totalPage={totalPage}
                            totalElement={{totalElement}}
                            toggleUserActivation={toggleUserActivation}
                            deleteUser={deleteUser}
                            editUser={editUser}
                        />
                    ) : (
                        <OrganizationalChart users={users} />
                    )}

                    <Dialog
                        visible={userDialog}
                        header="Detalles de usuarios"
                        modal
                        className="p-fluid"
                        footer={userDialogFooter}
                        onHide={hideDialog}
                    >
                        <UserForm
                            onImageUpload={handleImageUpload}
                            user={user}
                            onInputChange={handleInputChange}
                            submitted={submitted}
                            editingUser={editingUser}
                        />
                    </Dialog>

                    <Dialog
                        visible={deleteUserDialog}
                        header="Confirm"
                        modal
                        footer={userDialogFooter}
                        onHide={() => setDeleteUserDialog(false)}
                    >
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {user && <span>¿Estás seguro de que deseas eliminar a <b>{user.name}</b>?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};
