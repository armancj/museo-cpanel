import { useState, useEffect, useRef } from 'react';
import { Toast, ToastMessage } from 'primereact/toast';
import { UsersDatum, UserService, UsersResponse } from '@/app/service/UserService';
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
export const useManagement = () => {

    const [usersResponse, setUsersResponse] = useState<UsersResponse | null>(null);
    const [user, setUser] = useState<UsersDatum>(emptyUser);
    const [userDialog, setUserDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);

    const toast = useRef<Toast>(null);

    useEffect(() => {
        UserService.getUsers().then((data) => setUsersResponse(data));
    }, []);

    const uploadAvatar = async (uuid: string, file: File) => {
        if (!file) return;
        try {
            const response = await UserService.uploadAvatar(uuid, file);
            toast.current?.show({ severity: 'success', summary: 'Avatar Subido', life: 5000 });
            return response;
        } catch (error) {
            console.error("Error upload avatar:", error);
            toast.current?.show({ severity: 'error', summary: 'Error al subir avatar', life: 5000 });
            throw error;
        }
    };

    const saveUser = async () => {
        setSubmitted(true);
        if (user.name.trim()) {
            let _usersData = [...(usersResponse?.usersData || [])];
            if (user.uuid) {
                // Actualizar usuario existente
                try {
                    const {active, uuid, deleted, ...userUpdated}=user;
                    const updatedUserData = await UserService.updateUser(user.uuid, userUpdated);
                    const index = _usersData.findIndex((u) => u.uuid === user.uuid);
                    if (index !== -1) {
                        _usersData[index] = updatedUserData;
                        toast.current?.show({ severity: 'success', summary: 'Usuario Actualizado', life: 5000 });
                    }

                    if (selectedAvatar) {
                        await uploadAvatar(uuid, selectedAvatar);
                        setSelectedAvatar(null);
                    }

                    setUserDialog(false);
                } catch (error) {
                    handleError(error, 'No se pudo actualizar el usuario');
                }
            } else {
                // Crear nuevo usuario
                try {
                    const createdUser = await UserService.createUser(user);
                    _usersData.push(createdUser);
                    toast.current?.show({ severity: 'success', summary: 'Usuario Creado', life: 5000 });

                    if (selectedAvatar) {
                        await uploadAvatar(createdUser.uuid, selectedAvatar);
                        setSelectedAvatar(null);
                    }

                    setUserDialog(false);
                    setUser(emptyUser);
                } catch (error) {
                    handleError(error, 'No se pudo crear el usuario');
                }
            }
            setUsersResponse({ ...usersResponse, usersData: _usersData } as UsersResponse);
        }
    };

    const handleError = (error: any, defaultMessage: string) => {
        const show: ToastMessage = {
            severity: 'error',
            summary: 'Error',
            detail: defaultMessage,
            life: 5000
        };
        if (error instanceof AxiosError) {
            const errorMessage = (error.response)?.data?.message || 'failed axio';
            if (error.status === 400) show.detail = errorMessage;
            if (error.status === 401) show.detail = errorMessage;
            if (error.status === 404) show.detail = 'La provincia, el municipio o el pais, no se encuentra en la aplicación';
            if (error.status === 409) {
                const conflictData = JSON.parse(errorMessage.replace('Conflict: ', ''));
                const conflictFields = Object.keys(conflictData);
                conflictFields.forEach(field => {
                    const fieldData = field === 'email' ? 'Correo' : 'Teléfono';
                    show.detail = `El ${fieldData}: ${conflictData[field]} ya se encuentra en el sistema.`;
                });
            }
        }
        toast.current?.show(show);
        setUserDialog(true);
        console.log(error);
    };


    const toggleUserActivation = async (uuid: string, active: boolean) => {
        try {
            await UserService.changeActivateUser({ uuid, active });
                const updatedUsers = usersResponse?.usersData.map(user =>
                    user.uuid === uuid ? { ...user, active } : user
                );
                setUsersResponse({ ...usersResponse, usersData: updatedUsers } as UsersResponse);
                toast.current?.show({ severity: 'success', summary: 'Estado del usuario actualizado', life: 5000 });

        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el estado del usuario', life: 5000 });
            console.error('Error al cambiar el estado del usuario:', error);
        }
    };


    const deleteUser = async (uuid: string) => {
        try {
            const data = await UserService.deleteUser(uuid);
            console.log({ delete:data });
            const updatedUsers = usersResponse?.usersData.filter(user => user.uuid !== uuid);
            setUsersResponse({ ...usersResponse, usersData: updatedUsers } as UsersResponse);
            toast.current?.show({ severity: 'success', summary: 'Usuario Eliminado', life: 5000 });
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el usuario', life: 5000 });
            console.error('Error al eliminar el usuario:', error);
        }
    };
    const editUser = async (updatedUser: Partial<UsersDatum>) => {

        const transformedUser = {
            ...updatedUser,
        }
        console.log({transformedUser});
        setUser({ ...transformedUser } as unknown as  UsersDatum);
        setUserDialog(true);
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
        totalPage: usersResponse?.totalPage ?? 0,
        totalElement: usersResponse?.totalElement ?? 0,
        toggleUserActivation,
        deleteUser, editUser,
        setSelectedAvatar
    };
};
