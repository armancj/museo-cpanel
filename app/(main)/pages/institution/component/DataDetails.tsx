import React from 'react';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { InstitutionResponse } from '@/app/service/InstitutionService';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { useAddressData } from '@/app/(main)/pages/user/useAddressData';

interface DataDetailsProps {
    data: InstitutionResponse;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void;
    submitted: boolean;
}

export function DataDetails({ data, onInputChange, submitted }: DataDetailsProps) {
    const validateField = (field: string) => field.trim().length > 0;

    const { countries } = useAddressData();

    const onCountryChange = (e: DropdownChangeEvent) => {
        onInputChange({ target: { name: 'country', value: e.value.name } } as any, 'country');
    };

    return (
        <div className="field col-12 md:col-6">
            <label htmlFor="name">Nombre de la Institución</label>
            <InputText id="name" name="name" value={data.name} onChange={(e) => onInputChange(e, 'name')} required className={classNames({ 'p-invalid': submitted && (!validateField(data.name)) })} />
            {submitted && !validateField(data.name) && <small className="p-invalid">El nombre es requerido.</small>}

            <label htmlFor="street">Calle</label>
            <InputText id="street" name="street" value={data.street} onChange={(e) => onInputChange(e, 'street')} required className={classNames({ 'p-invalid': submitted && (!validateField(data.street)) })} />
            {submitted && !validateField(data.street) && <small className="p-invalid">La calle es requerida.</small>}

            <label htmlFor="number">Número</label>
            <InputText id="number" name="number" value={data.number} onChange={(e) => onInputChange(e, 'number')} required className={classNames({ 'p-invalid': submitted && (!validateField(data.number)) })} />
            {submitted && !validateField(data.number) && <small className="p-invalid">El número es requerido.</small>}

            <label htmlFor="referenceCode">Código de Referencia</label>
            <InputText id="referenceCode" name="referenceCode" value={data.referenceCode} onChange={(e) => onInputChange(e, 'referenceCode')} required className={classNames({ 'p-invalid': submitted && (!validateField(data.referenceCode)) })} />
            {submitted && !validateField(data.referenceCode) && <small className="p-invalid">El código de referencia es requerido.</small>}

            <label htmlFor="betweenStreet1">Entre Calle 1</label>
            <InputText id="betweenStreet1" name="betweenStreet1" value={data.betweenStreet1} onChange={(e) => onInputChange(e, 'betweenStreet1')} />

            <label htmlFor="betweenStreet2">Entre Calle 2</label>
            <InputText id="betweenStreet2" name="betweenStreet2" value={data.betweenStreet2} onChange={(e) => onInputChange(e, 'betweenStreet2')} />

            <label htmlFor="district">Distrito</label>
            <InputText id="district" name="district" value={data.district} onChange={(e) => onInputChange(e, 'district')} />

            <label htmlFor="locality">Localidad</label>
            <InputText id="locality" name="locality" value={data.locality} onChange={(e) => onInputChange(e, 'locality')} />

            <label htmlFor="province">Provincia</label>
            <InputText id="province" name="province" value={data.province} onChange={(e) => onInputChange(e, 'province')} />

            <label htmlFor="municipality">Municipio</label>
            <InputText id="municipality" name="municipality" value={data.municipality} onChange={(e) => onInputChange(e, 'municipality')} />

            <label htmlFor="country">Nombre del País</label>
            <Dropdown id="country" name="country" value={countries.find((country) => country.name === data.country) || null} options={countries} onChange={onCountryChange} optionLabel="name" placeholder="Seleccionar País" required className={classNames({ 'p-invalid': submitted && (!validateField(data.country)) })} />
            {submitted && !validateField(data.country) && <small className="p-invalid">El país es requerido.</small>}

            <label htmlFor="phone1">Teléfono 1</label>
            <InputText id="phone1" name="phone1" value={data.phone1} onChange={(e) => onInputChange(e, 'phone1')} />

            <label htmlFor="phone2">Teléfono 2</label>
            <InputText id="phone2" name="phone2" value={data.phone2} onChange={(e) => onInputChange(e, 'phone2')} />

            <label htmlFor="email">Correo Electrónico</label>
            <InputText id="email" name="email" value={data.email} onChange={(e) => onInputChange(e, 'email')} className={classNames({ 'p-invalid': submitted && (!validateField(data.email)) })} />
            {submitted && !validateField(data.email) && <small className="p-invalid">El correo electrónico es requerido.</small>}

            <label htmlFor="website">Sitio Web</label>
            <InputText id="website" name="website" value={data.website} onChange={(e) => onInputChange(e, 'website')} />

            <label htmlFor="institutionType">Tipo de Institución</label>
            <InputText id="institutionType" name="institutionType" value={data.institutionType} onChange={(e) => onInputChange(e, 'institutionType')} className={classNames({ 'p-invalid': submitted && (!validateField(data.institutionType)) })} />
            {submitted && !validateField(data.institutionType) && <small className="p-invalid">El tipo de institución es requerido.</small>}

            <label htmlFor="classification">Clasificación</label>
            <InputText id="classification" name="classification" value={data.classification} onChange={(e) => onInputChange(e, 'classification')} />

            <label htmlFor="typology">Tipología</label>
            <InputText id="typology" name="typology" value={data.typology} onChange={(e) => onInputChange(e, 'typology')} />

            <label htmlFor="category">Categoría</label>
            <InputText id="category" name="category" value={data.category} onChange={(e) => onInputChange(e, 'category')} />
        </div>
    );
}
