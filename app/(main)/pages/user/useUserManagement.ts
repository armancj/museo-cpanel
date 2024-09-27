import { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { UsersDatum, UserService, UsersResponse } from '@/app/(main)/pages/user/UserService';

   export const emptyUser: UsersDatum = {
            active: false, deleted: false, uuid: '',
            mobile: '',
            municipal: '',
            email: '',
            address: '',
            lastName: '',
            name: '',
            nationality: '',
            province: '',
            avatar: {
                id: '', nameFile: ''
            },
            roles: '',
    };
export const useUserManagement = () => {

    const [usersResponse, setUsersResponse] = useState<UsersResponse | null>(null);
    const [user, setUser] = useState<UsersDatum>(emptyUser);
    const [userDialog, setUserDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        UserService.getUsers().then((data) => setUsersResponse(data));
    }, []);

    const saveUser = () => {
        setSubmitted(true);
        if (user.name.trim()) {
            let _usersData = [...(usersResponse?.usersData || [])];
            if (user.uuid) {
                const index = _usersData.findIndex((u) => u.uuid === user.uuid);

                if (index !== -1) {
                    _usersData[index] = user;
                    toast.current?.show({ severity: 'success', summary: 'User Updated', life: 3000 });
                }

            } else {
                user.uuid = createId();
                _usersData.push(user);
                toast.current?.show({ severity: 'success', summary: 'User Created', life: 3000 });
            }
            setUsersResponse({ ...usersResponse, usersData: _usersData } as UsersResponse);
            setUserDialog(false);
            setUser(emptyUser);
        }
    };

    const createId = () => Math.random().toString(36).substring(2, 9);

    return {
        users: usersResponse?.usersData || [],
        userDialog,
        setUserDialog,
        saveUser,
        user,
        setUser,
        submitted,
        setSubmitted,
        toast,
        totalPage: usersResponse?.totalPage || 0,
        totalElement: usersResponse?.totalElement || 0,
    };
};
