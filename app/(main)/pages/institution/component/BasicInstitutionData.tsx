import { InstitutionResponse } from '@/app/service/InstitutionService';
import React from 'react';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

interface BasicInstitutionDataProps {
    data: InstitutionResponse;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void;
    submitted: boolean;
    validateField: (field: (string | undefined | null)) => '' | undefined | null | boolean;
}

export const BasicInstitutionData: React.FC<BasicInstitutionDataProps> = ({
    data,
    onInputChange,
    submitted,
    validateField
}) => {
    return (
        <>
            <div className="field col-12">
                <Divider align="center">
                    <b>Datos Básicos</b>
                </Divider>
            </div>

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
        </>
    );
}
