'use client';
import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { classNames } from 'primereact/utils';

interface EmailInputProps {
    email: string;
    setEmail: (email: string) => void;
    emailError: boolean;
}
export const EmailInput: React.FC<EmailInputProps> = ({ email, setEmail, emailError }) => {
    return (
        <div>
            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                Correo/Número de teléfono
            </label>
            <InputText id="email1"
                       type="text"
                       value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo/Número de teléfono" className={classNames('w-full md:w-30rem mb-2', { 'p-invalid': emailError })} style={{ borderRadius: '25px', padding: '1rem' }} required />
            {emailError && <Message severity="error" text="Correo/Número de teléfono es requerido" style={{ marginBottom: '1rem' }} />}
        </div>
    );
};
