/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from './context/layoutcontext';
import { Tooltip } from 'primereact/tooltip';
import { ProfileService, UserProfile } from '@/demo/service/ProfileService';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { UserService } from '@/app/service/UserService';
import { FileStorageService } from '@/app/service/FileStorageService';
import { Toast } from 'primereact/toast';
import { OverlayPanel } from 'primereact/overlayPanel';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar, setLayoutConfig } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const menuRef = useRef<Menu>(null);
    const toastRef = useRef<Toast>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const calendarRef = useRef<OverlayPanel>(null);

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [showProfileDialog, setShowProfileDialog] = useState(false);
    const [editProfile, setEditProfile] = useState({
        name: '',
        lastName: '',
        email: '',
        mobile: '',
        address: '',
        nationality: '',
        province: '',
        municipal: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const profileData = await ProfileService.getProfile();
            setProfile(profileData);
            setEditProfile({
                name: profileData.name || '',
                lastName: profileData.lastName || '',
                email: profileData.email || '',
                mobile: profileData.mobile || '',
                address: profileData.address || '',
                nationality: profileData.nationality || '',
                province: profileData.province || '',
                municipal: profileData.municipal || '',
                password: ''
            });
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    };

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const handleLogout = () => {
        localStorage.removeItem('authUser');
        window.location.href = '/auth/login';
    };
    const openProfileMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (menuRef.current) {
            menuRef.current.toggle(event);
        }
    };

    const openProfileDialog = () => {
        setShowProfileDialog(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target) {
                    setAvatarPreview(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileUpdate = async () => {
        try {
            setLoading(true);

            // Update profile data
            await UserService.updateProfile({
                name: editProfile.name,
                lastName: editProfile.lastName,
                email: editProfile.email,
                mobile: editProfile.mobile,
                address: editProfile.address,
                nationality: editProfile.nationality,
                province: editProfile.province,
                municipal: editProfile.municipal,
                ...(editProfile.password ? { password: editProfile.password } : {})
            });

            // Upload avatar if selected
            if (avatarFile) {
                const uuid = profile?.uuid || '';
                await UserService.uploadAvatar(uuid, avatarFile);
            }

            // Reload profile
            await loadProfile();

            setShowProfileDialog(false);
            setAvatarFile(null);
            setAvatarPreview(null);

            if (toastRef.current) {
                toastRef.current.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Perfil actualizado correctamente',
                    life: 3000
                });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            if (toastRef.current) {
                toastRef.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo actualizar el perfil',
                    life: 3000
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const profileItems: MenuItem[] = [
        {
            label: 'Editar Perfil',
            icon: 'pi pi-user-edit',
            command: openProfileDialog
        }
    ];

    const LogoutButton = () => (
        <>
            <button type="button" className="p-link layout-topbar-button" onClick={handleLogout} data-pr-tooltip="Salir" data-pr-position="bottom">
                <i className="pi pi-sign-out"></i>
                <span>Salir</span>
            </button>
            <Tooltip target=".layout-topbar-button" />
        </>
    );

    return (
        <div className="layout-topbar">
            <Toast ref={toastRef} />
            <Menu ref={menuRef} model={profileItems} popup />

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>
            <Link href="/" className="layout-topbar-logo">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.svg`} width="47.22px" height={'35px'} alt="logo" />
                <span>Memorial</span>
            </Link>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>

                <button type="button" className="p-link layout-topbar-button" onClick={openProfileMenu} data-pr-tooltip="Perfil" data-pr-position="bottom">
                    {profile && profile.avatar ? (
                        <img
                            src={typeof profile.avatar === 'string' ? profile.avatar : FileStorageService.getFileUrl(profile.avatar.id || '')}
                            alt={profile.name}
                            className="profile-image"
                            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                    ) : (
                        <i className="pi pi-user"></i>
                    )}
                    <span>{profile ? `${profile.name}` : 'Perfil'}</span>
                </button>
                <LogoutButton />
            </div>

            {/* Dialog de perfil moderno - Solo los 6 campos originales */}
            <Dialog
                header={
                    <div className="flex align-items-center gap-3">
                        <div className="flex align-items-center justify-content-center bg-primary-100 border-round-md"
                             style={{ width: '3rem', height: '3rem' }}>
                            <i className="pi pi-user-edit text-primary text-xl"></i>
                        </div>
                        <div>
                            <h3 className="m-0 text-primary">Editar Perfil</h3>
                            <p className="m-0 text-color-secondary text-sm">Actualiza tu información personal</p>
                        </div>
                    </div>
                }
                visible={showProfileDialog}
                style={{ width: '550px' }}
                onHide={() => setShowProfileDialog(false)}
                footer={
                    <div className="flex justify-content-between align-items-center">
                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-info-circle text-color-secondary"></i>
                            <span className="text-color-secondary text-sm">Los cambios se aplicarán inmediatamente</span>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                label="Cancelar"
                                icon="pi pi-times"
                                onClick={() => setShowProfileDialog(false)}
                                className="p-button-text p-button-secondary"
                            />
                            <Button
                                label="Guardar"
                                icon="pi pi-check"
                                onClick={handleProfileUpdate}
                                loading={loading}
                                className="p-button-raised"
                            />
                        </div>
                    </div>
                }
                modal
                draggable={false}
                resizable={false}
            >
                <div className="p-fluid">
                    {/* Avatar mejorado */}
                    <div className="field text-center mb-4">
                        <div className="relative inline-block">
                            <div
                                className="avatar-container border-3 border-primary-200 hover:border-primary-300 transition-colors transition-duration-300"
                                style={{
                                    width: '120px',
                                    height: '120px',
                                    borderRadius: '50%',
                                    margin: '0 auto',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    backgroundColor: '#f8f9fa',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    position: 'relative'
                                }}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar Preview"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : profile && profile.avatar ? (
                                    <img
                                        src={typeof profile.avatar === 'string' ? profile.avatar : FileStorageService.getFileUrl(profile.avatar.id || '')}
                                        alt={profile.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <i className="pi pi-user text-4xl text-color-secondary"></i>
                                )}

                                {/* Overlay de cámara */}
                                <div
                                    className="absolute inset-0 flex align-items-center justify-content-center bg-black-alpha-50 opacity-0 hover:opacity-100 transition-opacity transition-duration-300"
                                    style={{
                                        borderRadius: '50%',
                                        backdropFilter: 'blur(2px)'
                                    }}
                                >
                                    <i className="pi pi-camera text-white text-xl"></i>
                                </div>
                            </div>

                            {/* Botón de cámara flotante */}
                            <div
                                className="absolute bottom-0 right-0 bg-primary border-round-xl flex align-items-center justify-content-center cursor-pointer hover:bg-primary-600 transition-colors transition-duration-300"
                                style={{ width: '2.5rem', height: '2.5rem' }}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <i className="pi pi-camera text-white"></i>
                            </div>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleAvatarChange}
                        />
                        <div className="mt-3">
                            <p className="text-color-secondary text-sm mb-1">Haz clic para cambiar la imagen</p>
                            <small className="text-color-secondary">
                                <i className="pi pi-info-circle mr-1"></i>
                                Formatos: JPG, PNG, GIF (máx. 2MB)
                            </small>
                        </div>
                    </div>

                    {/* Campos del formulario con mejor diseño */}
                    <div className="grid">
                        {/* Nombre y Apellido */}
                        <div className="col-12 md:col-6">
                            <div className="field">
                                <label htmlFor="name" className="font-medium text-color-secondary mb-2 block">
                                    <i className="pi pi-user mr-2 text-primary"></i>
                                    Nombre
                                </label>
                                <InputText
                                    id="name"
                                    name="name"
                                    value={editProfile.name}
                                    onChange={handleInputChange}
                                    className="w-full"
                                    placeholder="Tu nombre"
                                />
                            </div>
                        </div>

                        <div className="col-12 md:col-6">
                            <div className="field">
                                <label htmlFor="lastName" className="font-medium text-color-secondary mb-2 block">
                                    <i className="pi pi-user mr-2 text-primary"></i>
                                    Apellido
                                </label>
                                <InputText
                                    id="lastName"
                                    name="lastName"
                                    value={editProfile.lastName}
                                    onChange={handleInputChange}
                                    className="w-full"
                                    placeholder="Tu apellido"
                                />
                            </div>
                        </div>

                        {/* Email y Teléfono */}
                        <div className="col-12 md:col-6">
                            <div className="field">
                                <label htmlFor="email" className="font-medium text-color-secondary mb-2 block">
                                    <i className="pi pi-envelope mr-2 text-primary"></i>
                                    Correo Electrónico
                                </label>
                                <InputText
                                    id="email"
                                    name="email"
                                    value={editProfile.email}
                                    onChange={handleInputChange}
                                    className="w-full"
                                    placeholder="ejemplo@correo.com"
                                />
                            </div>
                        </div>

                        <div className="col-12 md:col-6">
                            <div className="field">
                                <label htmlFor="mobile" className="font-medium text-color-secondary mb-2 block">
                                    <i className="pi pi-phone mr-2 text-primary"></i>
                                    Teléfono
                                </label>
                                <InputText
                                    id="mobile"
                                    name="mobile"
                                    value={editProfile.mobile}
                                    onChange={handleInputChange}
                                    className="w-full"
                                    placeholder="+34 123 456 789"
                                />
                            </div>
                        </div>

                        {/* Dirección */}
                        <div className="col-12">
                            <div className="field">
                                <label htmlFor="address" className="font-medium text-color-secondary mb-2 block">
                                    <i className="pi pi-map-marker mr-2 text-primary"></i>
                                    Dirección
                                </label>
                                <InputText
                                    id="address"
                                    name="address"
                                    value={editProfile.address}
                                    onChange={handleInputChange}
                                    className="w-full"
                                    placeholder="Calle, número, ciudad"
                                />
                            </div>
                        </div>

                        {/* Contraseña */}
                        <div className="col-12">
                            <div className="field">
                                <label htmlFor="password" className="font-medium text-color-secondary mb-2 block">
                                    <i className="pi pi-lock mr-2 text-primary"></i>
                                    Contraseña
                                </label>
                                <InputText
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={editProfile.password}
                                    onChange={handleInputChange}
                                    className="w-full"
                                    placeholder="Dejar en blanco para no cambiar"
                                />
                                <small className="text-color-secondary mt-1 block">
                                    <i className="pi pi-info-circle mr-1"></i>
                                    Deja este campo vacío si no deseas cambiar tu contraseña
                                </small>
                            </div>
                        </div>
                    </div>

                    {/* Nota de seguridad */}
                    <div className="flex align-items-center gap-2 p-3 bg-primary-50 border-round mt-4">
                        <i className="pi pi-shield text-primary"></i>
                        <span className="text-primary text-sm">
                Tu información está protegida y encriptada
            </span>
                    </div>
                </div>
            </Dialog>

            <Tooltip target=".layout-topbar-button" />
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
