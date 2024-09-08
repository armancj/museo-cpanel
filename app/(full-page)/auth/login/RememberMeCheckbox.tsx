'use client';
import React from 'react';
import { Checkbox } from 'primereact/checkbox';

interface RememberMeCheckboxProps {
    checked: boolean;
    setChecked: (checked: boolean) => void;
}
export const RememberMeCheckbox: React.FC<RememberMeCheckboxProps> = ({ checked, setChecked }) => {
    return (
        <div className="flex align-items-center justify-content-between mb-5 gap-5">
            <div className="flex align-items-center">
                <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox>
                <label htmlFor="rememberme1">Mantener autenticada la sesión</label>
            </div>
        </div>
    );
};
