import React from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Notes } from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';

interface NotesStepProps {
    data: Notes; // Datos del paso
    onChange: (field: keyof Notes, value: Notes[keyof Notes]) => void; // Evento principal de cambio
}

const NotesStep: React.FC<NotesStepProps> = ({ data, onChange }) => {
    return (
        <div className="p-fluid">
            {/* Notas */}
            <div className="field">
                <label htmlFor="notes">Notas</label>
                <InputTextarea
                    id="notes"
                    value={data.notes}
                    onChange={(e) => onChange('notes', e.target.value)}
                    rows={10}
                    cols={30}
                    autoResize
                />
            </div>
        </div>
    );
};

export default NotesStep;
