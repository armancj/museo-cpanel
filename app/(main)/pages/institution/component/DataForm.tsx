import React from 'react';
import { Fieldset } from 'primereact/fieldset';
import { DataDetails } from './DataDetails';
import { InstitutionResponse } from '@/app/service/InstitutionService';

interface DataFormProps {
    data: InstitutionResponse;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void;
    submitted: boolean;
}

export function DataForm({ data, submitted, onInputChange }: DataFormProps) {
    return (
        <div className="flex">
            <Fieldset legend="Detalles de la Institución" className="p-4 flex-grow-1">
                <DataDetails data={data} onInputChange={onInputChange} submitted={submitted} />
            </Fieldset>
        </div>
    );
}
