import { useState, useEffect, useRef } from 'react';
import { Toast, ToastMessage } from 'primereact/toast';
import { UsersDatum, UserService, UsersResponse } from '@/app/(main)/pages/user/UserService';
import { AxiosError } from 'axios';

export const emptyUser: UsersDatum = {
    password: '',
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
    roles: ''
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

    const saveUser = async () => {
        setSubmitted(true);
        if (user.name.trim()) {
            let _usersData = [...(usersResponse?.usersData || [])];
            if (user.uuid) {
                const index = _usersData.findIndex((u) => u.uuid === user.uuid);

                if (index !== -1) {
                    _usersData[index] = user;
                    toast.current?.show({ severity: 'success', summary: 'Usuario Actualizado', life: 5000 });
                    setUserDialog(false);
                }

            } else {
                try {
                    const createdUser = await UserService.createUser(user);
                    _usersData.push(createdUser);
                    toast.current?.show({ severity: 'success', summary: 'Usuario Creado', life: 5000 });
                    setUserDialog(false);
                    setUser(emptyUser);
                } catch (error) {
                    const show: ToastMessage ={
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to create user',
                        life: 5000
                    }
                    if(error instanceof AxiosError){
                        const errorMessage = (error.response)?.data?.message || 'failed axio';
                        if(error.status === 400 )
                            show.detail = errorMessage
                        if(error.status === 401)
                            show.detail = errorMessage
                        if(error.status === 404)
                            show.detail = 'La provincia, el municipio o el pais, no se encuentra en la aplicación'
                        if(error.status === 409) {
                            const conflictData = JSON.parse(errorMessage.replace('Conflict: ', ''));
                            const conflictFields = Object.keys(conflictData);

                            conflictFields.forEach(field => {
                                const fieldData = field === 'email'? 'Correo': 'Teléfono'
                                show.detail =`El ${fieldData}: ${conflictData[field]} ya se encuentra en el sistema.`;
                            });
                        }
                    }
                    toast.current?.show(show);
                    setUserDialog(true);
                    console.log(error);
                }
            }
            setUsersResponse({ ...usersResponse, usersData: _usersData } as UsersResponse);
        }
    };

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
        totalElement: usersResponse?.totalElement || 0
    };
};
