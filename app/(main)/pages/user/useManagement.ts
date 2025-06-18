import { useState, useEffect, useRef } from 'react';
import { Toast, ToastMessage } from 'primereact/toast';
import { UsersDatum, UserService, UsersResponse } from '@/app/service/UserService';
import { ApiError } from '@/adapter/httpAdapter';

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
        console.log('🚀 === DEBUGGING SAVE USER ===');
        console.log('📋 Usuario completo:', user);
        console.log('🏢 user.institutionId:', user.institutionId);

        setSubmitted(true);
        if (user.name.trim()) {
            let _usersData = [...(usersResponse?.usersData || [])];

            if (user.uuid) {
                // ✅ ACTUALIZAR usuario existente
                try {
                    const {active, uuid, deleted, avatar, ...userUpdated} = user;

                    // Llamar al endpoint que devuelve boolean
                    const success = await UserService.updateUser(user.uuid, userUpdated);

                    if (success) {
                        // ✅ Actualización exitosa - actualizar estado local
                        const index = _usersData.findIndex((u) => u.uuid === user.uuid);

                        if (index !== -1) {
                            // Actualizar con los nuevos datos del formulario
                            _usersData[index] = {
                                ..._usersData[index], // Mantener datos existentes
                                ...userUpdated,       // Aplicar cambios
                                uuid: user.uuid,      // Mantener UUID
                                active: _usersData[index].active, // Mantener estado activo
                                deleted: _usersData[index].deleted // Mantener estado deleted
                            };
                        }

                        // Manejar avatar si se subió uno nuevo
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

                    } else {
                        throw new Error('Error al actualizar usuario');
                    }

                } catch (error) {
                    handleError(error, 'No se pudo actualizar el usuario');
                }
            } else {
                // ✅ CREAR nuevo usuario
                try {
                    console.log('🆕 === INICIANDO CREACIÓN ===');
                    console.log('📤 Datos a enviar:', user);

                    const createdUser = await UserService.createUser(user);
                    console.log('✅ Usuario creado exitosamente:', createdUser);

                    if (selectedAvatar) {
                        console.log('📸 Subiendo avatar...');
                        const response = await uploadAvatar(createdUser.uuid, selectedAvatar);
                        setSelectedAvatar(null);
                        createdUser.avatar = response?.avatar;
                        console.log('✅ Avatar subido:', response?.avatar);
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
            // Actualizar el estado con los cambios
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
            console.error('Error no procesado:', error);
            show.detail = error?.message || defaultMessage;
        }

        toast.current?.show(show);
        setUserDialog(true);
        console.log('Error manejado:', error);
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
        console.log('🔧 === EDIT USER ===');
        console.log('👤 editUser - Usuario recibido:', updatedUser.name);
        console.log('🏢 editUser - institution objeto completo:', (updatedUser.institution as any)?.name || 'N/A');

        // ✅ Extraer institutionId del objeto institution que viene del backend
        const institutionId = (updatedUser.institution as any)?.uuid || '';

        // ✅ Preparar usuario para el formulario
        const userToEdit: UsersDatum = {
            ...updatedUser,
            password: '', // ✅ Limpiar password para edición
            institutionId, // ✅ UUID extraído para el formulario (no el objeto completo)

            // ✅ Completar campos requeridos con valores por defecto seguros
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
            institution: updatedUser.institution || '', // ✅ Mantener objeto original para referencia
            avatar: updatedUser.avatar || { id: '', nameFile: '' },
            roles: updatedUser.roles || ''
        };

        console.log('🏢 editUser - institutionId extraído:', institutionId);
        console.log('✅ editUser - usuario preparado para formulario:', userToEdit.name);

        // ✅ Establecer estados
        setUser(userToEdit);           // Para el formulario
        setEditingUser(updatedUser as UsersDatum); // Para referencia original
        setSelectedAvatar(null);       // Limpiar avatar seleccionado
        setUserDialog(true);          // Abrir diálogo
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
