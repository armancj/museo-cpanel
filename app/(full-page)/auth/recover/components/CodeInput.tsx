'use client';
import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { classNames } from 'primereact/utils';

interface CodeInputProps {
    code: string;
    setCode: (code: string) => void;
    codeError: boolean;
}

const CodeInput: React.FC<CodeInputProps> = ({ code, setCode, codeError }) => {
    return (
        <div>
            <label htmlFor="code" className="block text-900 font-medium mb-2">Código de Recuperación</label>
            <InputText id="code" type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Código de Recuperación" className={classNames('w-full mb-2', { 'p-invalid': codeError })} style={{ borderRadius: '25px', padding: '1rem' }} required />
            {codeError && <Message severity="error" text="Código es requerido" style={{ marginBottom: '1rem' }} />}
        </div>
    );
};

export default CodeInput;
