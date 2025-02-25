import React from 'react';
import { Chips } from 'primereact/chips';
import { InputText } from 'primereact/inputtext';
import { AccessAndUseConditions } from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';

interface AccessConditionsStepProps {
    data: AccessAndUseConditions; // Datos del paso
    onChange: (field: keyof AccessAndUseConditions, value: any) => void; // Función de cambio
}

const AccessConditionsStep: React.FC<AccessConditionsStepProps> = ({ data, onChange }) => {
    return (
        <div className="grid">
            <div className="col-12 md:col-6">
                <div className="card p-fluid">
        <div className="p-fluid">
            {/* Condiciones de Acceso */}
            <div className="field">
                <label htmlFor="accessConditions">Condiciones de Acceso</label>
                <Chips
                    id="accessConditions"
                    value={data.accessConditions}
                    onChange={(e) => onChange('accessConditions', e.value)}
                />
            </div>

            {/* Condiciones de Reproducción */}
            <div className="field">
                <label htmlFor="reproductionConditions">Condiciones de Reproducción</label>
                <Chips
                    id="reproductionConditions"
                    value={data.reproductionConditions}
                    onChange={(e) => onChange('reproductionConditions', e.value)}
                />
            </div>

            {/* Requisitos Técnicos */}
            <div className="field">
                <label htmlFor="technicalRequirements">Requisitos Técnicos</label>
                <InputText
                    id="technicalRequirements"
                    value={data.technicalRequirements}
                    onChange={(e) => onChange('technicalRequirements', e.target.value)}
                />
            </div>
        </div>
        </div>
        </div>
        </div>
    );
};

export default AccessConditionsStep;
