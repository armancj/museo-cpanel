import { useState, useEffect, useRef } from 'react';
import { Toast, ToastMessage } from 'primereact/toast';
import { UsersDatum, UserService, UsersResponse } from '@/app/service/UserService';
import { CountryService } from '@/app/service/CountryService';
import { ProvinceService } from '@/app/service/ProvinceService';
import { MunicipalityService } from '@/app/service/MunicipalityService';
import { ApiError } from '@/adapter/httpAdapter';

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
    institution: '',
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
                // Actualizar usuario existente
                try {
                    const {active, uuid, deleted, avatar, ...userUpdated}=user;
                    const updatedUserData = await UserService.updateUser(user.uuid, userUpdated);
                    const index = _usersData.findIndex((u) => u.uuid === user.uuid);

                    if (selectedAvatar) {
                        const response = await uploadAvatar(uuid, selectedAvatar);
                        setSelectedAvatar(null);
                        updatedUserData.avatar = response?.avatar
                    }

                    if (index !== -1) {
                        _usersData[index] = updatedUserData;
                        toast.current?.show({ severity: 'success', summary: 'Usuario Actualizado', life: 5000 });
                    }

                    setUserDialog(false);
                } catch (error) {
                    handleError(error, 'No se pudo actualizar el usuario');
                }
            } else {
                // Crear nuevo usuario
                try {
                    const createdUser = await UserService.createUser(user);

                    if (selectedAvatar) {
                        const response = await uploadAvatar(createdUser.uuid, selectedAvatar);
                        setSelectedAvatar(null);
                        createdUser.avatar = response?.avatar
                    }
                    _usersData.push(createdUser);
                    toast.current?.show({ severity: 'success', summary: 'Usuario Creado', life: 5000 });

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

        if (error instanceof ApiError) {
            // El error ya viene procesado desde el httpAdapter
            show.severity = error.severity;
            show.detail = error.userMessage;

            if (error.status === 409) {
                show.summary = 'Información duplicada';
            } else if (error.status >= 500) {
                show.summary = 'Error del servidor';
            }
        } else {
            // Fallback para errores no procesados
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
        const userToEdit = {
            ...emptyUser,
            ...updatedUser,
        };

        setUser(userToEdit);
        setSelectedAvatar(null);

        try {
            // Cargar países
            const countryData = (await CountryService.getCountries({name: userToEdit.nationality}))[0];

            if (countryData) {
                const provincesData = await ProvinceService.getProvinces(countryData);
                if (userToEdit.province) {
                    const province = provincesData.find((province) => province.name === userToEdit.province);
                    if (province) {
                        const municipalitiesData = await MunicipalityService.getMunicipalities(province);

                        setUser((prev) => ({
                            ...prev,
                            nationality: countryData as any,
                            province: provincesData as any,
                        }));
                    }
                }
            }
        } catch (error) {
            console.error('Error cargando datos de país/provincia/municipio:', error);
        }

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
        setSelectedAvatar
    };
};
