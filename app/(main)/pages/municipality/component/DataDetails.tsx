
import React from 'react';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { useAddressData } from '@/app/(main)/pages/user/useAddressData';
import { MunicipalityResponse } from '@/app/service/MunicipalityService';

interface DataDetailsProps {
    data: MunicipalityResponse,
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void,
    submitted: boolean
}

export function DataDetails({ data, onInputChange, submitted }: DataDetailsProps) {
    const validateName = (name: string) => name.trim().length > 0;
    const { provinces } = useAddressData();

    const onProvinceChange = (e: DropdownChangeEvent) => {
        onInputChange({
            target: {
                name: 'province',
                value: e.value.name // Extract only the name
            }
        } as any, 'province');
    };


    return (
        <div className="field col-12 md:col-6">
            <label htmlFor="name">Nombre de la Provincia</label>
            <InputText
                id="name"
                name="name"
                value={data.name}
                onChange={(e) => onInputChange(e, 'name')}
                required
                className={classNames({
                    'p-invalid': submitted && (!validateName(data.name))
                })}
            />
            {submitted && !validateName(data.name) && <small className="p-invalid">El nombre es requerido.</small>}
            <label htmlFor={'province'}>Nombre de la Provincia</label>
            <Dropdown
                id="province"
                name="province"
                value={provinces.find((list) => list.name === data.province)  || null}
                options={provinces}
                onChange={onProvinceChange}
                optionLabel="name"
                placeholder={`Seleccionar Provincia`}
                className="w-full md:w-14rem"
                /*className={classNames({ 'p-invalid': submitted && !data.country })}*/
            />
        </div>
    );
}
