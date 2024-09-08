import React from 'react';
import { Button } from 'primereact/button';
import CodeInput from './CodeInput';

interface StepTwoRecoverProps {
    code: string;
    setCode: (code: string) => void;
    codeError: boolean;
    handleVerifyCode: () => void;
}

const StepTwoRecover: React.FC<StepTwoRecoverProps> = ({ code, setCode, codeError, handleVerifyCode }) => (
    <>
        <h5>Verificar Código</h5>
        <p>Ingrese el código de recuperación que se ha enviado a su correo electrónico.</p>
        <CodeInput code={code} setCode={setCode} codeError={codeError} />
        <Button label="Verificar" className="w-full p-3 text-xl" style={{ borderRadius: '25px', backgroundColor: '#926941', borderColor: '#926941' }} onClick={handleVerifyCode}></Button>
    </>
);

export default StepTwoRecover;

