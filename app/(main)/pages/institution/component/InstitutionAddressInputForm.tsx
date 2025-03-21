import { InstitutionResponse } from '@/app/service/InstitutionService';
import React from 'react';
import { AddressResponse } from '@/app/service/UserService';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import DropdownField from '@/app/(main)/pages/user/component/DropdownField';

export function InstitutionAddressInputForm(data: InstitutionResponse, onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void, submitted: boolean, validateField: (field: (string | undefined | null)) => '' | undefined | null | boolean, selectedCountry: AddressResponse | null, countries: AddressResponse[], onCountryChange: (e: DropdownChangeEvent) => Promise<void>, selectedProvince: AddressResponse | null, provinces: AddressResponse[], onProvincesChange: (e: DropdownChangeEvent) => Promise<void>, isProvinceDisabled: boolean, selectedMunicipality: AddressResponse | null, municipalities: AddressResponse[], onMunicipalitiesChange: (e: DropdownChangeEvent) => void, isMunicipalityDisabled: boolean) {
    return <>
        <div className="field col-12">
            <Divider align="center">
                <b>Dirección de Institución</b>
            </Divider>
        </div>

        <div className="field col-12 md:col-5">
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

        <div className="field col-12 md:col-1">
            <label htmlFor="number">Número</label>
            <InputText
                id="number"
                name="number"
                value={data.number}
                onChange={(e) => onInputChange(e, 'number')}
                required
                className={classNames({ 'p-invalid': submitted && !validateField(data.number) })}
            />
            {submitted && !validateField(data.number) && (
                <small className="p-error">El número es requerido.</small>
            )}
        </div>

        <div className="field col-12 md:col-3">
            <label htmlFor="betweenStreet1">Entre Calle 1</label>
            <InputText
                id="betweenStreet1"
                name="betweenStreet1"
                value={data.betweenStreet1}
                onChange={(e) => onInputChange(e, 'betweenStreet1')}
            />
        </div>

        <div className="field col-12 md:col-3">
            <label htmlFor="betweenStreet2">Entre Calle 2</label>
            <InputText
                id="betweenStreet2"
                name="betweenStreet2"
                value={data.betweenStreet2}
                onChange={(e) => onInputChange(e, 'betweenStreet2')}
            />
        </div>

        <div className="field col-12 md:col-4">
            <label htmlFor="district">Distrito</label>
            <InputText
                id="district"
                name="district"
                value={data.district}
                onChange={(e) => onInputChange(e, 'district')}
            />
        </div>

        <div className="field col-12 md:col-2">
            <label htmlFor="locality">Localidad</label>
            <InputText
                id="locality"
                name="locality"
                value={data.locality}
                onChange={(e) => onInputChange(e, 'locality')}
            />
        </div>

        <div className="field col-12 md:col-2">
            <label htmlFor="country">País</label>
            <DropdownField
                id="country"
                name="country"
                value={selectedCountry}
                options={countries}
                onChange={onCountryChange}
                optionLabel="name"
                placeholder="Seleccione el país"
                className={classNames({ 'p-invalid': submitted && !validateField(data.country) })}
                submitted={submitted}
                required={true}
                filter={true}
            />
            {submitted && !validateField(data.country) && (
                <small className="p-error">El País es requerido.</small>
            )}
        </div>

        <div className="field col-12 md:col-2">
            <label htmlFor="province">Provincia</label>
            <DropdownField
                id="province"
                name="province"
                value={selectedProvince}
                options={provinces}
                onChange={onProvincesChange}
                optionLabel="name"
                placeholder="Seleccione la provincia"
                className={classNames({ 'p-invalid': submitted && !validateField(data.province) })}
                submitted={submitted}
                required={true}
                filter={true}
                disabled={isProvinceDisabled}
            />
            {submitted && !validateField(data.province) && (
                <small className="p-error">La provincia es requerida.</small>
            )}
        </div>

        <div className="field col-12 md:col-2">
            <label htmlFor="municipality">Municipio</label>
            <DropdownField
                id="municipality"
                name="municipality"
                value={selectedMunicipality}
                options={municipalities}
                onChange={onMunicipalitiesChange}
                optionLabel="name"
                placeholder="Seleccione el municipio"
                className={classNames({ 'p-invalid': submitted && !validateField(data.municipality) })}
                submitted={submitted}
                required={true}
                filter={true}
                disabled={isMunicipalityDisabled}
            />
            {submitted && !validateField(data.municipality) && (
                <small className="p-error">El municipio es requerido.</small>
            )}
        </div>
    </>;
}
