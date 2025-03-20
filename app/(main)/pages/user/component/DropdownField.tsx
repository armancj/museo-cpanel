import React from 'react';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';

interface DropdownFieldProps {
    id: string,
    name: string,
    value: any,
    options: any[],
    onChange: (e: DropdownChangeEvent) => void,
    optionLabel: string,
    placeholder: string,
    submitted: boolean,
    disabled?: boolean,
    required?: boolean,
    filter?: boolean,
    className?: string | undefined
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
                                                         disabled = false,
                                                         required = false,
                                                         filter = false,
                                                         className,
                                                     }) => {
    const isInvalid = submitted && required && !value;
    const combinedClassNames = classNames(className, { 'p-invalid': isInvalid });


    return (
        <div className="field">
            <Dropdown
                id={id}
                name={name}
                value={value}
                options={options}
                onChange={onChange}
                optionLabel={optionLabel}
                placeholder={placeholder}
                className={combinedClassNames}
                disabled={disabled}
                filter={filter}
            />
            {isInvalid && <small className="p-error">Este campo es requerido.</small>}
        </div>
    );
};

export default DropdownField;
