import React from 'react';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { InstitutionResponse } from '@/app/service/InstitutionService';
import { useAddressData } from '@/app/(main)/pages/user/useAddressData';
import DropdownField from '@/app/(main)/pages/user/component/DropdownField';

interface DataDetailsProps {
    data: InstitutionResponse;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void;
    submitted: boolean;
}

export function DataDetails({ data, onInputChange, submitted }: DataDetailsProps) {
    const validateField = (field: string) => field.trim().length > 0;
    const { countries, provinces, municipalities, handleCountryChange, handleProvinceChange, isProvinceDisabled } = useAddressData();

    const onCountryChange = async (e: DropdownChangeEvent) => {
        onInputChange({ target: { name: 'country', value: e.value.name } } as React.ChangeEvent<HTMLInputElement>, 'country');
        await handleCountryChange(e.value, onInputChange);
    };

    const onProvincesChange = async (e: DropdownChangeEvent) => {
        await handleProvinceChange(e.value, onInputChange);
    };

    const onMunicipalitiesChange = (e: DropdownChangeEvent) => {
        onInputChange({ target: { name: 'municipalities', value: e.value.name } } as React.ChangeEvent<HTMLInputElement>, 'municipalities');
    };

    return (
        <Panel header="Detalles de Institución" className="p-fluid">
            <div className="grid">
                <div className="field col-12 md:col-6">
                    <label htmlFor="name">Nombre de Institución</label>
                    <InputText
                        id="name"
                        name="name"
                        value={data.name}
                        onChange={(e) => onInputChange(e, 'name')}
                        required
                        className={classNames({ 'p-invalid': submitted && !validateField(data.name) })}
                    />
                    {submitted && !validateField(data.name) && (
                        <small className="p-error">El Nombre es requerido.</small>
                    )}
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="street">Calle</label>
                    <InputText
                        id="street"
                        name="street"
                        value={data.street}
                        onChange={(e) => onInputChange(e, 'street')}
                        required
                        className={classNames({ 'p-invalid': submitted && !validateField(data.street) })}
                    />
                    {submitted && !validateField(data.street) && (
                        <small className="p-error">La Calle es requerida.</small>
                    )}
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="number">Número de institución</label>
                    <InputText
                        id="number"
                        name="number"
                        value={data.number}
                        onChange={(e) => onInputChange(e, 'number')}
                        required
                        className={classNames({ 'p-invalid': submitted && !validateField(data.number) })}
                    />
                    {submitted && !validateField(data.number) && (
                        <small className="p-error">El Número de institución es requerido.</small>
                    )}
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="referenceCode">Código De Referencia</label>
                    <InputText
                        id="referenceCode"
                        name="referenceCode"
                        value={data.referenceCode}
                        onChange={(e) => onInputChange(e, 'referenceCode')}
                        required
                        className={classNames({ 'p-invalid': submitted && !validateField(data.referenceCode) })}
                    />
                    {submitted && !validateField(data.referenceCode) && (
                        <small className="p-error">El Código De Referencia es requerido.</small>
                    )}
                </div>

                <Divider align="center" className="col-12">
                    <b>Información Adicional</b>
                </Divider>
                <div className="field col-12 md:col-6">
                    <label htmlFor="email">Email</label>
                    <InputText
                        id="email"
                        name="email"
                        value={data.email}
                        onChange={(e) => onInputChange(e, 'email')}
                        required
                        className={classNames({ 'p-invalid': submitted && !validateField(data.email) })}
                    />
                    {submitted && !validateField(data.email) && (
                        <small className="p-error">Email es requerido.</small>
                    )}
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="phone1">Phone 1</label>
                    <InputText
                        id="phone1"
                        name="phone1"
                        value={data.phone1}
                        onChange={(e) => onInputChange(e, 'phone1')}
                    />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="phone2">Phone 2</label>
                    <InputText
                        id="phone2"
                        name="phone2"
                        value={data.phone2}
                        onChange={(e) => onInputChange(e, 'phone2')}
                    />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="website">Website</label>
                    <InputText
                        id="website"
                        name="website"
                        value={data.website}
                        onChange={(e) => onInputChange(e, 'website')}
                    />
                </div>

                <Divider align="center" className="col-12">
                    <b>Dirección de Institución</b>
                </Divider>

                <div className="field col-12 md:col-6">
                    <label htmlFor="country">País</label>
                    <DropdownField
                        id="country"
                        name="country"
                        value={data.country}
                        options={countries}
                        onChange={onCountryChange}
                        optionLabel="name"
                        placeholder="Seleccione el país"
                        className={classNames({ 'p-invalid': submitted && !validateField(data.country) })}
                        submitted
                    />
                    {submitted && !validateField(data.country) && (
                        <small className="p-error">El País es requerido.</small>
                    )}
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor="province">Provincia</label>
                    <DropdownField
                        id="province"
                        name="province"
                        value={data.province}
                        options={provinces}
                        onChange={onProvincesChange}
                        optionLabel="name"
                        placeholder="Seleccione la provincia"
                        className={classNames({ 'p-invalid': submitted && !validateField(data.province) })}
                        submitted
                    />
                    {submitted && !validateField(data.province) && (
                        <small className="p-error">La provincia es requerida.</small>
                    )}
                </div>

                {/* Sección de municipio (si es necesario) */}
                <div className="field col-12 md:col-6">
                    <label htmlFor="municipalities">Municipio</label>
                    <DropdownField
                        id="municipalities"
                        name="municipalities"
                        value={data.municipalities}
                        options={municipalities}
                        onChange={onMunicipalitiesChange}
                        optionLabel="name"
                        placeholder="Seleccione el municipio"
                        submitted
                        className={classNames({ 'p-invalid': submitted && !validateField(data.municipality) })}
                    />
                </div>
            </div>
        </Panel>
    );
}
