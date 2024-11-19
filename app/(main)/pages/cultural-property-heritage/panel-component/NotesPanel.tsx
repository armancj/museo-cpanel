import React from 'react';
import { Panel } from 'primereact/panel';
import { Notes } from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';

interface Props {
    notes: Notes;
}

const NotesPanel = ({ notes }: Props) => {
    return (
        <Panel header="Notas" toggleable collapsed>
            <div className="p-grid">
                <div className="p-col-12">
                    <p>{notes.notes}</p>
                </div>
            </div>
        </Panel>
    );
};

export default NotesPanel;