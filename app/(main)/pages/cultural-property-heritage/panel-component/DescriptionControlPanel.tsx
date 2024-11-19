import React from 'react';
import { Panel } from 'primereact/panel';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { DescriptionControl } from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';

interface Props {
    descriptionControl: DescriptionControl;
}

const DescriptionControlPanel = ({ descriptionControl }: Props) => {
    return (
        <Panel header="Control de Descripción" toggleable collapsed>
            <Card>
                <div className="p-grid">
                    <div className="p-col-12">
                        <p><b>Hecho por:</b> {descriptionControl.descriptionMadeBy}</p>
                    </div>
                    <Divider align="center" type="dashed">
                        <b>Fecha de Descripción</b>
                    </Divider>
                    <div className="p-col-12">
                        <p>{new Date(descriptionControl.descriptionDateTime).toLocaleDateString()}</p>
                    </div>
                    <Divider align="center" type="dashed">
                        <b>Revisado por</b>
                    </Divider>
                    <div className="p-col-12">
                        <p>{descriptionControl.reviewedBy}</p>
                    </div>
                    <Divider align="center" type="dashed">
                        <b>Fecha de Revisión</b>
                    </Divider>
                    <div className="p-col-12">
                        <p>{new Date(descriptionControl.reviewDateTime).toLocaleDateString()}</p>
                    </div>
                </div>
            </Card>
        </Panel>
    );
};

export default DescriptionControlPanel;