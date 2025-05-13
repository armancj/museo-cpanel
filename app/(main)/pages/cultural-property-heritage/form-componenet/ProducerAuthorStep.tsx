import React, { useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { ProducerAuthor } from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';
import { classNames } from 'primereact/utils';
import { InputNumber } from 'primereact/inputnumber';

interface ProducerAuthorStepProps {
    data: ProducerAuthor,
    onChange: (field: keyof ProducerAuthor, value: string) => void;
    errors: Partial<Record<keyof ProducerAuthor, string>>;
    onValidate: () => boolean;
    submitted: boolean;
}

const ProducerAuthorStep: React.FC<ProducerAuthorStepProps> = ({
                                                                   data,
                                                                   onChange,
                                                                   errors,
                                                                   onValidate,
                                                                   submitted,
                                                               }) => {
    const {
        producerAuthorNames,
        betweenStreet2,
        betweenStreet1,
        street,
        institutionalHistory,
        objectEntryHistory,
        number,
        locality,
        province,
        municipality,
        district,
    } = data;

    useEffect(() => {
        if (submitted) {
            onValidate();
        }
    }, [data, submitted, onValidate]);

    return (
        <div className="card p-fluid formgrid grid font-medium">
            {/* Nombre del Productor/Autor */}
            <div className="field col-12 md:col-4">
                <label htmlFor="producerAuthorNames" className={classNames({ 'p-error': errors.producerAuthorNames })}
                >Nombres del Productor/Autor</label>
                <InputText
                    id="producerAuthorNames"
                    value={producerAuthorNames.value}
                    onChange={(e) => onChange('producerAuthorNames', e.target.value)}
                    className={classNames({ 'p-invalid': errors.producerAuthorNames })}
                />
                {errors.producerAuthorNames && <small className="p-error">{errors.producerAuthorNames}</small>}
            </div>

            {/* Historia Institucional */}
            <div className="field col-12 md:col-4">
                <label htmlFor="institutionalHistory"
                       className={classNames({ 'p-error': errors.institutionalHistory })}>Historia Institucional</label>
                <InputText
                    id="institutionalHistory"
                    value={institutionalHistory?.value}
                    onChange={(e) => onChange('institutionalHistory', e.target.value)}
                    className={classNames({ 'p-error': errors.institutionalHistory })}
                />
                {errors.institutionalHistory && <small className="p-error">{errors.institutionalHistory}</small>}
            </div>

            {/* Historia de Entrada del Objeto */}
            <div className="field col-12 md:col-4">
                <label htmlFor="objectEntryHistory" className={classNames({ 'p-error': errors.objectEntryHistory })}>Historia
                    de Entrada del Objeto</label>
                <InputText
                    id="objectEntryHistory"
                    value={objectEntryHistory?.value}
                    onChange={(e) => onChange('objectEntryHistory', e.target.value)}
                    className={classNames({ 'p-invalid': errors.objectEntryHistory })}
                />
                {errors.objectEntryHistory && <small className="p-error">{errors.objectEntryHistory}</small>}
            </div>

            {/* Dirección: Calle y Número */}
            <div className="field col-12 md:col-8">
                <label htmlFor="street" className={classNames({ 'p-error': errors.street })}>Calle</label>
                <InputText
                    id="street"
                    value={street.value}
                    onChange={(e) => onChange('street', e.target.value)}
                    className={classNames({ 'p-invalid': errors.street })}
                />
                {errors.street && <small className="p-error">{errors.street}</small>}
            </div>
            <div className="field col-12 md:col-4">
                <label htmlFor="number" className={classNames({ 'p-error': errors.number })}>Número</label>
                <InputNumber
                    id="number"
                    value={number.value ? parseInt(number.value) : 0}
                    onChange={(e) => onChange('number', `${e.value!}`)}
                    className={classNames({ 'p-invalid': errors.number })}
                    useGrouping={false}
                />
                {errors.number && <small className="p-error">{errors.number}</small>}
            </div>

            {/* Entre calles */}
            <div className="field col-12 md:col-6">
                <label htmlFor="betweenStreet1" className={classNames({ 'p-error': errors.betweenStreet1 })}>Entre Calle
                    1</label>
                <InputText
                    id="betweenStreet1"
                    value={betweenStreet1.value}
                    onChange={(e) => onChange('betweenStreet1', e.target.value)}
                    className={classNames({ 'p-invalid': errors.betweenStreet1 })}
                />
                {errors.betweenStreet1 && <small className="p-error">{errors.betweenStreet1}</small>}
            </div>
            <div className="field col-12 md:col-6">
                <label htmlFor="betweenStreet2" className={classNames({ 'p-error': errors.betweenStreet2 })}>Entre Calle
                    2</label>
                <InputText
                    id="betweenStreet2"
                    value={betweenStreet2.value}
                    onChange={(e) => onChange('betweenStreet2', e.target.value)}
                    className={classNames({ 'p-invalid': errors.betweenStreet2 })}
                />
                {errors.betweenStreet2 && <small className="p-error">{errors.betweenStreet2}</small>}
            </div>

            {/* Provincia y Municipio */}
            <div className="field col-12 md:col-3">
                <label htmlFor="province" className={classNames({ 'p-error': errors.province })}>Provincia</label>
                <InputText
                    id="province"
                    value={province.value}
                    onChange={(e) => onChange('province', e.target.value)}
                    className={classNames({ 'p-invalid': errors.province })}
                />
                {errors.province && <small className="p-error">{errors.province}</small>}
            </div>
            <div className="field col-12 md:col-3">
                <label htmlFor="municipality"
                       className={classNames({ 'p-error': errors.municipality })}>Municipio</label>
                <InputText
                    id="municipality"
                    value={municipality.value}
                    onChange={(e) => onChange('municipality', e.target.value)}
                    className={classNames({ 'p-invalid': errors.municipality })}
                />
                {errors.municipality && <small className="p-error">{errors.municipality}</small>}
            </div>

            {/* Distrito y Localidad */}
            <div className="field col-12 md:col-3">
                <label htmlFor="district" className={classNames({ 'p-error': errors.district })}>Distrito</label>
                <InputText
                    id="district"
                    value={district.value}
                    onChange={(e) => onChange('district', e.target.value)}
                    className={classNames({ 'p-invalid': errors.district })}
                />
                {errors.district && <small className="p-error">{errors.district}</small>}
            </div>
            <div className="field col-12 md:col-3">
                <label htmlFor="locality" className={classNames({ 'p-error': errors.locality })}>Localidad</label>
                <InputText
                    id="locality"
                    value={locality.value}
                    onChange={(e) => onChange('locality', e.target.value)}
                    className={classNames({ 'p-invalid': errors.locality })}
                />
                {errors.locality && <small className="p-error">{errors.locality}</small>}
            </div>
        </div>
    );
};

export default ProducerAuthorStep;
