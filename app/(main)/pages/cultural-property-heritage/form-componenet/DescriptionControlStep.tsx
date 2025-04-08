import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { DescriptionControl } from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';

interface DescriptionControlStepProps {
    data: DescriptionControl; // Datos del paso
    onChange: <K extends keyof DescriptionControl>(field: K, value: DescriptionControl[K]) => void; // Evento principal de cambio
}

const DescriptionControlStep: React.FC<DescriptionControlStepProps> = ({ data, onChange }) => {
    const { reviewDateTime, reviewedBy, descriptionDateTime, descriptionMadeBy } = data;
    return (
        <div className="p-fluid">
            {/* Fecha y Hora de la Revisión */}
            <div className="field">
                <label htmlFor="reviewDateTime">Fecha y Hora de Revisión</label>
                <Calendar
                    id="reviewDateTime"
                    value={reviewDateTime?.value || null}
                    onChange={(e) => onChange('reviewDateTime', { ...reviewDateTime, value: e.value ?? new Date(Date.now()) })}
                    showTime
                    showButtonBar
                    dateFormat="yy-mm-dd"
                />
            </div>

            {/* Revisado por */}
            <div className="field">
                <label htmlFor="reviewedBy">Revisado por</label>
                <InputText
                    id="reviewedBy"
                    value={reviewedBy.value}
                    onChange={(e) => onChange('reviewedBy', { ...reviewedBy, value: e.target.value })}
                />
            </div>

            {/* Fecha y Hora de la Descripción */}
            <div className="field">
                <label htmlFor="descriptionDateTime">Fecha y Hora de Descripción</label>
                <Calendar
                    id="descriptionDateTime"
                    value={descriptionDateTime.value}
                    onChange={(e) => onChange('descriptionDateTime', { ...descriptionDateTime, value: e.value ?? new Date(Date.now()) })}
                    showTime
                    showButtonBar
                    dateFormat="yy-mm-dd"
                />
            </div>

            {/* Descripción realizada por */}
            <div className="field">
                <label htmlFor="descriptionMadeBy">Descripción realizada por</label>
                <InputText
                    id="descriptionMadeBy"
                    value={descriptionMadeBy.value}
                    onChange={(e) => onChange('descriptionMadeBy', { ...descriptionMadeBy, value: e.target.value })}
                />
            </div>
        </div>
    );
};

export default DescriptionControlStep;
