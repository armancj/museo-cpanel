import { useState, useEffect, useRef } from 'react';
import { Toast, ToastMessage } from 'primereact/toast';
import { UsersDatum, UserService, UsersResponse } from '@/app/service/UserService';
import { ApiError } from '@/adapter/httpAdapter';
import { removeEmptyFields } from '@/app/(main)/utilities/removeEmptyFields';

export const emptyUser: UsersDatum = {
    password: '',
    active: false,
    deleted: false,
    uuid: '',
    mobile: '',
    municipal: '',
    email: '',
    address: '',
    lastName: '',
    name: '',
    nationality: '',
    province: '',
    institution: '',
    institutionId: '',
    avatar: {
        id: '',
        nameFile: ''
    },
    roles: ''
};

export const useManagement = () => {
    const [usersResponse, setUsersResponse] = useState<UsersResponse | null>(null);
    const [user, setUser] = useState<UsersDatum>(emptyUser);
    const [userDialog, setUserDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
    const [editingUser, setEditingUser] = useState<UsersDatum | null>(null);

    const toast = useRef<Toast>(null);

    useEffect(() => {
        UserService.getUsers().then((data) => setUsersResponse(data));
    }, []);

    const uploadAvatar = async (uuid: string, file: File) => {
        if (!file) return;
        try {
            return await UserService.uploadAvatar(uuid, file);
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
                try {
                    const {active, uuid, deleted, avatar, ...userUpdated} = user;

                    const filteredUserData = removeEmptyFields(userUpdated);

                        await UserService.updateUser(user.uuid, filteredUserData);

                        const index = _usersData.findIndex((u) => u.uuid === user.uuid);

                        if (index !== -1) {
                            _usersData[index] = {
                                ..._usersData[index],
                                ...userUpdated,
                                uuid: user.uuid,
                                active: _usersData[index].active,
                                deleted: _usersData[index].deleted
                            };
                        }

                        if (selectedAvatar) {
                            const response = await uploadAvatar(uuid, selectedAvatar);
                            setSelectedAvatar(null);
                            if (response?.avatar && index !== -1) {
                                _usersData[index].avatar = response.avatar;
                            }
                        }

                        toast.current?.show({
                            severity: 'success',
                            summary: 'Usuario Actualizado',
                            life: 5000
                        });

                        setUserDialog(false);
                        setSubmitted(false);
                        setUser(emptyUser);
                        setEditingUser(null);

                } catch (error) {
                    handleError(error, 'No se pudo actualizar el usuario');
                }
            } else {
                try {

                    const createdUser = await UserService.createUser(user);

                    if (selectedAvatar) {
                        const response = await uploadAvatar(createdUser.uuid, selectedAvatar);
                        setSelectedAvatar(null);
                        createdUser.avatar = response?.avatar;
                    }

                    _usersData.push(createdUser);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Usuario Creado',
                        life: 5000
                    });

                    setUserDialog(false);
                    setSubmitted(false);
                    setUser(emptyUser);
                    setEditingUser(null);

                } catch (error) {
                    console.error('❌ === ERROR EN CREACIÓN ===');
                    console.error('❌ Error completo:', error);
                    console.error('❌ Error status:', (error as any)?.status);
                    console.error('❌ Error message:', (error as any)?.message);
                    handleError(error, 'No se pudo crear el usuario');
                    return;
                }
            }

            setUsersResponse({
                ...usersResponse,
                usersData: _usersData
            } as UsersResponse);
        }
    };

    const handleError = (error: any, defaultMessage: string) => {
        const show: ToastMessage = {
            severity: 'error',
            summary: 'Error',
            detail: defaultMessage,
            life: 5000
        };

        if (error instanceof ApiError) {
            show.severity = error.severity;
            show.detail = error.userMessage;

            if (error.status === 409) {
                show.summary = 'Información duplicada';
            } else if (error.status >= 500) {
                show.summary = 'Error del servidor';
            }
        } else {
            show.detail = error?.message || defaultMessage;
        }

        toast.current?.show(show);
        setUserDialog(true);
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
            handleError(error, 'No se pudo actualizar el estado del usuario');
        }
    };

    const deleteUser = async (uuid: string) => {
        try {
            await UserService.deleteUser(uuid);
            const updatedUsers = usersResponse?.usersData.filter(user => user.uuid !== uuid);
            setUsersResponse({ ...usersResponse, usersData: updatedUsers } as UsersResponse);
            toast.current?.show({ severity: 'success', summary: 'Usuario Eliminado', life: 5000 });
        } catch (error) {
            handleError(error, 'No se pudo eliminar el usuario');
        }
    };

    const editUser = async (updatedUser: Partial<UsersDatum>): Promise<void> => {
        const institutionId = (updatedUser.institution as any)?.uuid || '';

        const userToEdit: UsersDatum = {
            ...updatedUser,
            password: '',
            institutionId,
            active: updatedUser.active ?? false,
            deleted: updatedUser.deleted ?? false,
            uuid: updatedUser.uuid || '',
            mobile: updatedUser.mobile || '',
            municipal: updatedUser.municipal || '',
            email: updatedUser.email || '',
            address: updatedUser.address || '',
            lastName: updatedUser.lastName || '',
            name: updatedUser.name || '',
            nationality: updatedUser.nationality || '',
            province: updatedUser.province || '',
            institution: updatedUser.institution || '',
            avatar: updatedUser.avatar || { id: '', nameFile: '' },
            roles: updatedUser.roles || ''
        };

        setUser(userToEdit);
        setEditingUser(updatedUser as UsersDatum);
        setSelectedAvatar(null);
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
        deleteUser,
        editUser,
        setSelectedAvatar,
        editingUser
    };
};
