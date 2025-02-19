import React from 'react';
import { InputText } from 'primereact/inputtext';
import { AssociatedDocumentation } from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';

interface DocumentationStepProps {
    data: AssociatedDocumentation; // Datos del paso
    onChange: (field: keyof AssociatedDocumentation, value: string) => void; // Manejador del cambio
}

const DocumentationStep: React.FC<DocumentationStepProps> = ({ data, onChange }) => {
    return (
        <div className="p-fluid">
            {/* Copias Existentes y Localización */}
            <div className="field">
                <label htmlFor="copiesExistenceAndLocation">Copias Existentes y Localización</label>
                <InputText
                    id="copiesExistenceAndLocation"
                    value={data.copiesExistenceAndLocation}
                    onChange={(e) => onChange('copiesExistenceAndLocation', e.target.value)}
                />
            </div>

            {/* Originales Existentes y Localización */}
            <div className="field">
                <label htmlFor="originalsExistenceAndLocation">Originales Existentes y Localización</label>
                <InputText
                    id="originalsExistenceAndLocation"
                    value={data.originalsExistenceAndLocation}
                    onChange={(e) => onChange('originalsExistenceAndLocation', e.target.value)}
                />
            </div>

            {/* Unidades de Descripción Relacionadas */}
            <div className="field">
                <label htmlFor="relatedDescriptionUnits">Unidades de Descripción Relacionadas</label>
                <InputText
                    id="relatedDescriptionUnits"
                    value={data.relatedDescriptionUnits}
                    onChange={(e) => onChange('relatedDescriptionUnits', e.target.value)}
                />
            </div>

            {/* Información de Publicaciones Relacionadas */}
            <div className="field">
                <label htmlFor="relatedPublicationsInformation">Información de Publicaciones Relacionadas</label>
                <InputText
                    id="relatedPublicationsInformation"
                    value={data.relatedPublicationsInformation}
                    onChange={(e) => onChange('relatedPublicationsInformation', e.target.value)}
                />
            </div>
        </div>
    );
};

export default DocumentationStep;
