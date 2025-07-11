import { Toast } from 'primereact/toast';
import React from 'react';
import { post } from '@/adapter/httpAdapter';
import { WebEnvConst } from '@/app/webEnvConst';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
type Severity = 'success' | 'info' | 'warn' | 'error' | undefined;

export const handleRecover = async (
    email: string,
    setEmailError: (value: boolean) => void,
    setInvalidEmailError: (value: boolean) => void,
    setStep: (value: number) => void,
    showToast: (severity: Severity, summary: string, detail: string, toast: React.RefObject<Toast>) => void,
    toast: React.RefObject<Toast>
) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
        setEmailError(true);
        setInvalidEmailError(false);
        showToast('error', 'Error', 'Por favor, ingrese su correo electrónico', toast);
        return;
    }

    if (!emailRegex.test(email)) {
        setEmailError(false);
        setInvalidEmailError(true);
        showToast('error', 'Error', 'Por favor, ingrese un correo electrónico válido', toast);
        return;
    }

    setEmailError(false);
    setInvalidEmailError(false);

    try {
        const response = await post(WebEnvConst.auth.recover, { email });
        showToast('success', 'Correo enviado', 'Se ha enviado un correo con el código de recuperación', toast);
        setStep(2);
    } catch (error) {
        console.error('Error al enviar el correo de recuperación:', error);
        showToast('error', 'Error', 'No se pudo enviar el correo de recuperación', toast);
    }
};

export const handleVerifyCode = async (
    email: string,
    code: string,
    setCodeError: (value: boolean) => void,
    setStep: (value: number) => void,
    showToast: (severity: Severity, summary: string, detail: string, toast: React.RefObject<Toast>) => void,
    toast: React.RefObject<Toast>
) => {
    if (!code) {
        setCodeError(true);
        showToast('error', 'Error', 'Por favor, ingrese el código de recuperación', toast);
        return;
    }

    setCodeError(false);

    try {
        const response = await post(WebEnvConst.auth.verifyCode, { email, code });
        showToast('success', 'Código verificado', 'El código de recuperación es correcto', toast);
        setStep(3);
    } catch (error) {
        console.error('Error al verificar el código:', error);
        showToast('error', 'Error', 'Código de recuperación incorrecto', toast);
    }
};

export const handleChangePassword = async (
    email: string,
    code: string,
    newPassword: string,
    confirmPassword: string,
    setPasswordError: (value: boolean) => void,
    setConfirmPasswordError: (value: boolean) => void,
    resetForm: () => void,
    showToast: (severity: Severity, summary: string, detail: string, toast: React.RefObject<Toast>) => void,
    toast: React.RefObject<Toast>,
    router: AppRouterInstance
) => {
    if (!newPassword) {
        setPasswordError(true);
        showToast('error', 'Error', 'Por favor, ingrese la nueva contraseña', toast);
        return;
    }

    if (newPassword !== confirmPassword) {
        setConfirmPasswordError(true);
        showToast('error', 'Error', 'Las contraseñas no coinciden', toast);
        return;
    }

    setPasswordError(false);
    setConfirmPasswordError(false);

    try {
        const response = await post(WebEnvConst.auth.changePassword, { email, code, newPassword });
        showToast('success', 'Contraseña cambiada', 'Su contraseña ha sido cambiada exitosamente', toast);
        resetForm();
        router.push('/auth/login');

    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        showToast('error', 'Error', 'No se pudo cambiar la contraseña', toast);
    }
};

export const showToast = (
    severity: Severity,
    summary: string,
    detail: string,
    toast: React.RefObject<Toast>
) => {
    toast.current?.show({
        severity,
        summary,
        detail,
        life: 3000
    });
};

export const resetForm = (
    setStep: (value: number) => void,
    setEmail: (value: string) => void,
    setCode: (value: string) => void,
    setNewPassword: (value: string) => void,
    setConfirmPassword: (value: string) => void
) => {
    setStep(1);
    setEmail('');
    setCode('');
    setNewPassword('');
    setConfirmPassword('');
};
