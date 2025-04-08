import React from 'react';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { AccessAndUseConditions } from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';

interface Props {
    accessAndUseConditions: AccessAndUseConditions;
}

const AccessAndUseConditionsPanel = ({ accessAndUseConditions }: Props) => {
    const { accessConditions, reproductionConditions, technicalRequirements } = accessAndUseConditions;
    return (
        <Panel header="Condiciones de Acceso y Uso" toggleable collapsed>
            <div className="p-grid">
                <div className="p-col-12">
                    <p><b>Condiciones de Acceso:</b> {accessConditions?.value.join(', ')}</p>
                </div>
                <Divider />
                <div className="p-col-12">
                    <p><b>Condiciones de Reproducción:</b> {reproductionConditions?.value.join(', ')}</p>
                </div>
                <Divider />
                <div className="p-col-12">
                    <p><b>Requisitos Técnicos:</b> {technicalRequirements?.value}</p>
                </div>
            </div>
        </Panel>
    );
};

export default AccessAndUseConditionsPanel;
