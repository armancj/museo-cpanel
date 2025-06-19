import { InstitutionResponse } from '@/app/service/InstitutionService';
import React from 'react';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

interface ContactInformationFormProps {
    data: InstitutionResponse;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void;
    submitted: boolean;
    validateField: (field: (string | undefined | null)) => '' | undefined | null | boolean;
}

export const ContactInformationForm: React.FC<ContactInformationFormProps> = ({
    data,
    onInputChange,
    submitted,
    validateField
}) => {
    return (
        <>
            <div className="field col-12">
                <Divider align="center">
                    <b>Información de Contacto</b>
                </Divider>
            </div>

            <div className="field col-12 md:col-3">
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
                    <small className="p-error">El email es requerido.</small>
                )}
            </div>

            <div className="field col-12 md:col-3">
                <label htmlFor="phone1">Teléfono 1</label>
                <InputText
                    id="phone1"
                    name="phone1"
                    value={data.phone1}
                    onChange={(e) => onInputChange(e, 'phone1')}
                    required
                    className={classNames({ 'p-invalid': submitted && !validateField(data.phone1) })}
                />
                {submitted && !validateField(data.phone1) && (
                    <small className="p-error">El teléfono 1 es requerido.</small>
                )}
            </div>

            <div className="field col-12 md:col-3">
                <label htmlFor="phone2">Teléfono 2</label>
                <InputText
                    id="phone2"
                    name="phone2"
                    value={data.phone2}
                    onChange={(e) => onInputChange(e, 'phone2')}
                />
            </div>

            <div className="field col-12 md:col-3">
                <label htmlFor="website">Sitio Web</label>
                <InputText
                    id="website"
                    name="website"
                    value={data.website}
                    onChange={(e) => onInputChange(e, 'website')}
                />
            </div>
        </>
    );
}
