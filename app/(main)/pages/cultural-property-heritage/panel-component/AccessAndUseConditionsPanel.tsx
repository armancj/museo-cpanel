import React from 'react';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { AccessAndUseConditions } from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';

interface Props {
    accessAndUseConditions: AccessAndUseConditions;
}

const AccessAndUseConditionsPanel = ({ accessAndUseConditions }: Props) => {
    return (
        <Panel header="Condiciones de Acceso y Uso" toggleable collapsed>
            <div className="p-grid">
                <div className="p-col-12">
                    <p><b>Condiciones de Acceso:</b> {accessAndUseConditions.accessConditions.join(', ')}</p>
                </div>
                <Divider />
                <div className="p-col-12">
                    <p><b>Condiciones de Reproducción:</b> {accessAndUseConditions.reproductionConditions.join(', ')}</p>
                </div>
                <Divider />
                <div className="p-col-12">
                    <p><b>Requisitos Técnicos:</b> {accessAndUseConditions.technicalRequirements}</p>
                </div>
            </div>
        </Panel>
    );
};

export default AccessAndUseConditionsPanel;
