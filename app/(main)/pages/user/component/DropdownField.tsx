import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';

interface DropdownFieldProps {
    id: string,
    name: string,
    value: any,
    options: any[],
    onChange: (e: any) => void,
    optionLabel: string,
    placeholder: string,
    submitted: boolean,
    disabled?: boolean
}

const DropdownField: React.FC<DropdownFieldProps> = ({
                                                         id,
                                                         name,
                                                         value,
                                                         options,
                                                         onChange,
                                                         optionLabel,
                                                         placeholder,
                                                         submitted,
                                                         disabled
                                                     }) => {
    return (
            <Dropdown
                id={id}
                name={name}
                value={value}
                options={options}
                onChange={onChange}
                optionLabel={optionLabel}
                placeholder={placeholder}
                className={classNames({ 'p-invalid': submitted && !value })}
                disabled={disabled}
            />
    );
};

export default DropdownField;
