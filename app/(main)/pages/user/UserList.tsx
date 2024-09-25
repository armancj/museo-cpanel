import { useEffect, useRef, useState } from 'react';

import { Toast } from 'primereact/toast';
import { UserTable } from '@/app/(main)/pages/user/UserTable';
import { UserService, UsersResponse } from '@/app/(main)/pages/user/UserService';
import { UserToolbar } from '@/app/(main)/pages/user/UserToolbar';
import { UserDialog } from '@/app/(main)/pages/user/UserDialog';

export const UserList = () => {

    const [users, setUsers] = useState<UsersResponse>();
    const [selectedUsers, setSelectedUsers] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);


    useEffect(() => {
        UserService.getUsers().then((data) => setUsers(data));
    }, []);

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <UserToolbar setUsers={setUsers} selectedUsers={selectedUsers} />
                    <UserTable
                        users={users}
                        selectedUsers={selectedUsers}
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                    />
                   <UserDialog setUsers={setUsers} />
                </div>
            </div>
        </div>
    );
};
