'use client';
import React, { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/navigation';
import { post } from '@/adapter/httpAdapter';
import { EmailInput } from './EmailInput';
import { PasswordInput } from './PasswordInput';
import { RememberMeCheckbox } from './RememberMeCheckbox';
import { WebEnvConst } from '@/app/webEnvConst';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const toast = useRef<Toast>(null);
    const router = useRouter();

    const handleLogin = async () => {
        let valid = true;

        if (!email) {
            setEmailError(true);
            valid = false;
        } else {
            setEmailError(false);
        }

        if (!password) {
            setPasswordError(true);
            valid = false;
        } else {
            setPasswordError(false);
        }

        if (!valid) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error de inicio de sesión',
                detail: 'Por favor, complete todos los campos',
                life: 3000
            });
            return; // No realizar la solicitud si hay errores
        }

        try {
            const response = await post<any>(WebEnvConst.auth.login, {
                email,
                password
            });
            localStorage.setItem('authUser', JSON.stringify(response.data));
            console.log('Login successful:', response);
            router.push('/');
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error de inicio de sesión',
                detail: 'Correo o contraseña incorrectos',
                life: 3000
            });
        }
    };

    return (
        <div>
            <Toast ref={toast} />
            <EmailInput email={email} setEmail={setEmail} emailError={emailError} />
            <PasswordInput password={password} setPassword={setPassword} passwordError={passwordError} />
            <RememberMeCheckbox checked={checked} setChecked={setChecked} />
            <Button label="Entrar" className="w-full p-3 text-xl" style={{ borderRadius: '25px', backgroundColor: '#926941', borderColor: '#926941' }} onClick={handleLogin}></Button>
        </div>
    );
};

export default LoginForm;
