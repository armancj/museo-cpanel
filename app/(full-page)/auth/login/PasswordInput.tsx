'use client';
import React from 'react';
import { Password } from 'primereact/password';
import { Message } from 'primereact/message';
import { classNames } from 'primereact/utils';
interface PasswordInputProps {
    password: string;
    setPassword: (password: string) => void;
    passwordError: boolean;
}
export const PasswordInput: React.FC<PasswordInputProps> = ({ password, setPassword, passwordError }) => {
    return (
        <div>
            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                Contraseña
            </label>
            <Password inputId="password1" inputStyle={{ borderRadius: '25px' }} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" toggleMask feedback={false} className={classNames('w-full mb-2', { 'p-invalid': passwordError })} inputClassName="w-full p-3 md:w-30rem" required />
            {passwordError && <Message severity="error" text="Contraseña es requerida" style={{ marginBottom: '1rem' }} />}
        </div>
    );
};
