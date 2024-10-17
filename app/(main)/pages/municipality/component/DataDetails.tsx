
import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { MunicipalityResponse } from '@/app/service/MunicipalityService';
import { ProvinceService } from '@/app/service/ProvinceService';
import { AddressResponse } from '@/app/service/UserService';

interface DataDetailsProps {
    data: MunicipalityResponse,
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void,
    submitted: boolean
}

export function DataDetails({ data, onInputChange, submitted }: DataDetailsProps) {
    const validateName = (name: string) => name.trim().length > 0;
    const [provinces, setProvinces] = useState<AddressResponse[]>([]);


    useEffect(() => {
        ProvinceService.getProvinces().then(data => {
            setProvinces(data);
        });
    }, []);

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
            <label htmlFor="name">Nombre del Municipio</label>
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
            {submitted && !validateName(data.name) && <small className="p-invalid">El nombre del municipio es requerido.</small>}
            <label htmlFor={'province'}>Nombre de la Provincia</label>
            <Dropdown
                id="province"
                name="province"
                value={provinces.find((list) => list.name === data.province)  || null}
                options={provinces}
                onChange={onProvinceChange}
                optionLabel="name"
                placeholder={`Seleccionar Provincia`}
                className={classNames('w-full md:w-14rem', { 'p-invalid': submitted && !data.country })}
            />
            {submitted && !validateName(data.province) && <small className="p-invalid">El nombre de la provincia es requerido.</small>}
        </div>
    );
}
