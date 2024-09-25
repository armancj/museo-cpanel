import { useEffect, useRef, useState } from 'react';

import { Toast } from 'primereact/toast';
import { UsersDatum, UserService, UsersResponse } from '@/app/(main)/pages/user/UserService';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { UserForm } from '@/app/(main)/pages/user/UserForm';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { undefined } from 'zod';
import { UserTable } from '@/app/(main)/pages/user/UserTable';

export const UserList = () => {
    const emptyUser: UsersDatum = {
        active: false, address: '', deleted: false, lastName: '', province: '', roles: '',
        uuid: '',
        mobile: '',
        municipal: '',
        email: '',
        name: '',
        nationality: '',
        avatar: undefined
    };

    const [users, setUsers] = useState<UsersResponse | null>(null);
    const [userDialog, setUserDialog] = useState(false);
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [user, setUser] = useState<UsersDatum>(emptyUser);
    const [selectedUsers, setSelectedUsers] = useState<UsersDatum[]>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);

    useEffect(() => {
        UserService.getUsers().then((data) => setUsers(data));
    }, []);

    const openNew = () => {
        setUser(emptyUser);
        setUserDialog(true);
    };

    const hideDialog = () => {
        setUserDialog(false);
    };

    function createId() {
        return '';
    }

    const saveUser = (user: UsersDatum) => {
        let _users = [...(users?.usersData || [])];

        if (user.uuid) {
            const index = _users.findIndex(u => u.uuid === user.uuid);
            _users[index] = user;
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
        } else {
            user.uuid = createId();
            _users.push(user);
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
        }

        setUsers({ ...users, usersData: _users, totalElement: _users.length, totalPage: _users.length });
        hideDialog();
    };

    const confirmDeleteUser = (user: UsersDatum) => {
        setUser(user);
        setDeleteUserDialog(true);
    };

    const deleteUser = () => {
        const _users = users?.usersData.filter((val) => val.uuid !== user.uuid) || [];
        setUsers({ ...users, usersData: _users, totalElement: _users.length, totalPage: _users.length });
        setDeleteUserDialog(false);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
    };

    const leftToolbarTemplate = () => (
        <div className="my-2">
            <Button label="New" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
            <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={() => confirmDeleteUser(user)} disabled={!selectedUsers.length} />
        </div>
    );

    const userDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={() => saveUser(user)} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                    <UserTable
                        users={users}
                        selectedUsers={selectedUsers}
                        setSelectedUsers={setSelectedUsers}
                        globalFilter={globalFilter}
                        setGlobalFilter = {setGlobalFilter}
                    />
                    <Dialog visible={userDialog} header="User Details" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                        <UserForm user={user} setUser={setUser} />
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
