import React from 'react';
import { CountryResponse } from '@/app/service/CountryService';
import { Fieldset } from 'primereact/fieldset';
import { DataDetails } from '@/app/(main)/pages/country/component/DataDetails';


interface DataFormProps {
    data: CountryResponse;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void;
    submitted: boolean;
}

export function DataForm({ data, submitted, onInputChange }: DataFormProps) {

    return (
        <div className="flex">
            <Fieldset legend="Detalles del País" className="p-4 flex-grow-1">
                <DataDetails data={data} onInputChange={onInputChange} submitted={submitted} />
            </Fieldset>
        </div>
    );
}
