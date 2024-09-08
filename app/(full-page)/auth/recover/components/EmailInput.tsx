'use client';
import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { classNames } from 'primereact/utils';

interface EmailInputProps {
    email: string;
    setEmail: (email: string) => void;
    emailError: boolean;
    invalidEmailError: boolean;
}

const EmailInput: React.FC<EmailInputProps> = ({ email, setEmail, emailError, invalidEmailError }) => {
    return (
        <div>
            <label htmlFor="email" className="block text-900 font-medium mb-2">Correo Electrónico</label>
            <InputText id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo Electrónico" className={classNames('w-full mb-2', { 'p-invalid': emailError || invalidEmailError })} style={{ borderRadius: '25px', padding: '1rem' }} required />
            {emailError && <Message severity="error" text="Correo es requerido" style={{ marginBottom: '1rem' }} />}
            {invalidEmailError && <Message severity="error" text="Correo electrónico inválido" style={{ marginBottom: '1rem' }} />}
        </div>
    );
};

export default EmailInput;
