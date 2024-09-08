'use client';
import React from 'react';
import { Password } from 'primereact/password';
import { Message } from 'primereact/message';
import { classNames } from 'primereact/utils';

interface PasswordInputProps {
    newPassword: string;
    setNewPassword: (password: string) => void;
    confirmPassword: string;
    setConfirmPassword: (password: string) => void;
    passwordError: boolean;
    confirmPasswordError: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ newPassword, setNewPassword, confirmPassword, setConfirmPassword, passwordError, confirmPasswordError }) => {
    return (
        <div>
            <label htmlFor="newPassword" className="block text-900 font-medium mb-2">Nueva Contraseña</label>
            <Password
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nueva Contraseña"
                toggleMask
                className={classNames('w-full mb-2', { 'p-invalid': passwordError })}
                inputClassName="w-full p-3 md:w-30rem"
                inputStyle={{ borderRadius: '25px' }}
                weakLabel={'muy simple'}
                mediumLabel={"medio nivel"}
                strongLabel={"alto nivel"}
                required />
            {passwordError &&
                <Message severity="error" text="Contraseña es requerida" style={{ marginBottom: '1rem' }} />}
            <label htmlFor="confirmPassword" className="block text-900 font-medium mb-2">Confirmar Contraseña</label>
            <Password
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmar Contraseña"
                toggleMask
                feedback={false}
                className={classNames('w-full mb-2', { 'p-invalid': confirmPasswordError })}
                inputClassName="w-full p-3 md:w-30rem"
                inputStyle={{ borderRadius: '25px' }}
                required />
            {confirmPasswordError &&
                <Message severity="error" text="Las contraseñas no coinciden" style={{ marginBottom: '1rem' }} />}
        </div>
    );
};

export default PasswordInput;

