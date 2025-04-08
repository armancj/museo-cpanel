import React from 'react';
import { Chips } from 'primereact/chips';
import { InputText } from 'primereact/inputtext';
import { AccessAndUseConditions } from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';

interface AccessConditionsStepProps {
    data: AccessAndUseConditions;
    onChange: (field: keyof AccessAndUseConditions, value: any) => void; // Función de cambio
}

const AccessConditionsStep: React.FC<AccessConditionsStepProps> = ({ data, onChange }) => {
    const { accessConditions, reproductionConditions, technicalRequirements } = data;
    return (
        <div className="card p-fluid">
            {/* Condiciones de Acceso */}
            <div className="formgrid grid">
            <div className="field col">
                <label htmlFor="accessConditions">Condiciones de Acceso</label>
                <Chips
                    id="accessConditions"
                    value={accessConditions.value}
                    onChange={(e) => onChange('accessConditions', e.value)}
                />
            </div>

            {/* Condiciones de Reproducción */}
            <div className="field col">
                <label htmlFor="reproductionConditions">Condiciones de Reproducción</label>
                <Chips
                    id="reproductionConditions"
                    value={reproductionConditions.value}
                    onChange={(e) => onChange('reproductionConditions', e.value)}
                />
            </div>

            {/* Requisitos Técnicos */}
            <div className="field col">
                <label htmlFor="technicalRequirements">Requisitos Técnicos</label>
                <InputText
                    id="technicalRequirements"
                    value={technicalRequirements.value}
                    onChange={(e) => onChange('technicalRequirements', e.target.value)}
                />
            </div>
        </div>
        </div>
    );
};

export default AccessConditionsStep;
