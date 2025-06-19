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
    optionValue?: string,
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
                                                         optionValue,
                                                         placeholder,
                                                         submitted,
                                                         disabled = false,
                                                         required = false,
                                                         filter = false,
                                                         className,
                                                     }) => {

    // Validación mejorada - verifica que el valor exista y sea válido
    const isInvalid = submitted && required && (!value || (optionValue && !value[optionValue]) || (!optionValue && !value[optionLabel]));
    const combinedClassNames = classNames(className, { 'p-invalid': isInvalid });

    // Debug temporal para el dropdown de roles
    if (id === 'roles') {
        console.log('🔍 DropdownField ROLES DEBUG:');
        console.log('value received:', value);
        console.log('options:', options);
        console.log('optionLabel:', optionLabel);
        console.log('optionValue:', optionValue);
        console.log('isInvalid:', isInvalid);
    }

    return (
        <div className="field">
            <Dropdown
                id={id}
                name={name}
                value={value}
                options={options}
                onChange={onChange}
                optionLabel={optionLabel}
                optionValue={optionValue}
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
