import React from 'react';
import { Button } from 'primereact/button';
import EmailInput from './EmailInput';

interface StepOneRecoverProps {
    email: string;
    setEmail: (email: string) => void;
    emailError: boolean;
    invalidEmailError: boolean;
    handleRecover: () => void;
}

const StepOneRecover: React.FC<StepOneRecoverProps> = ({ email, setEmail, emailError, invalidEmailError, handleRecover }) => (
    <>
        <h5>Recuperar Contraseña</h5>
        <p>Ingrese su correo electrónico para recibir instrucciones de recuperación de contraseña.</p>
        <EmailInput email={email} setEmail={setEmail} emailError={emailError} invalidEmailError={invalidEmailError} />
        <Button label="Enviar" className="w-full p-3 text-xl" style={{ borderRadius: '25px', backgroundColor: '#926941', borderColor: '#926941' }} onClick={handleRecover}></Button>
    </>
);

export default StepOneRecover;
