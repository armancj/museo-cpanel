import React from 'react';
import { InputText } from 'primereact/inputtext';
import {
    ProducerAuthor
} from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';

interface ProducerAuthorStepProps {
    data: ProducerAuthor,
    onChange: (field: keyof ProducerAuthor, value: string) => void;
}

const ProducerAuthorStep: React.FC<ProducerAuthorStepProps> = ({ data, onChange }) => {
    return (
        <div className="card p-fluid formgrid grid font-medium">
            {/* Nombre del Productor/Autor */}
            <div className="field col-12 md:col-6">
                <label htmlFor="producerAuthorNames">Nombres del Productor/Autor</label>
                <InputText
                    id="producerAuthorNames"
                    value={data.producerAuthorNames}
                    onChange={(e) => onChange('producerAuthorNames', e.target.value)}
                />
            </div>

            {/* Historia Institucional */}
            <div className="field col-12 md:col-6">
                <label htmlFor="institutionalHistory">Historia Institucional</label>
                <InputText
                    id="institutionalHistory"
                    value={data.institutionalHistory}
                    onChange={(e) => onChange('institutionalHistory', e.target.value)}
                />
            </div>

            {/* Historia de Entrada del Objeto */}
            <div className="field col-12 md:col-6">
                <label htmlFor="objectEntryHistory">Historia de Entrada del Objeto</label>
                <InputText
                    id="objectEntryHistory"
                    value={data.objectEntryHistory}
                    onChange={(e) => onChange('objectEntryHistory', e.target.value)}
                />
            </div>

            {/* Dirección: Calle y Número */}
            <div className="field col-12 md:col-6">
                <label htmlFor="street">Calle</label>
                <InputText
                    id="street"
                    value={data.street}
                    onChange={(e) => onChange('street', e.target.value)}
                />
            </div>
            <div className="field col-12 md:col-6">
                <label htmlFor="number">Número</label>
                <InputText
                    id="number"
                    value={data.number}
                    onChange={(e) => onChange('number', e.target.value)}
                />
            </div>

            {/* Entre calles */}
            <div className="field col-12 md:col-6">
                <label htmlFor="betweenStreet1">Entre Calle 1</label>
                <InputText
                    id="betweenStreet1"
                    value={data.betweenStreet1}
                    onChange={(e) => onChange('betweenStreet1', e.target.value)}
                />
            </div>
            <div className="field col-12 md:col-6">
                <label htmlFor="betweenStreet2">Entre Calle 2</label>
                <InputText
                    id="betweenStreet2"
                    value={data.betweenStreet2}
                    onChange={(e) => onChange('betweenStreet2', e.target.value)}
                />
            </div>

            {/* Provincia y Municipio */}
            <div className="field col-12 md:col-6">
                <label htmlFor="province">Provincia</label>
                <InputText
                    id="province"
                    value={data.province}
                    onChange={(e) => onChange('province', e.target.value)}
                />
            </div>
            <div className="field col-12 md:col-6">
                <label htmlFor="municipality">Municipio</label>
                <InputText
                    id="municipality"
                    value={data.municipality}
                    onChange={(e) => onChange('municipality', e.target.value)}
                />
            </div>

            {/* Distrito y Localidad */}
            <div className="field col-12 md:col-6">
                <label htmlFor="district">Distrito</label>
                <InputText
                    id="district"
                    value={data.district}
                    onChange={(e) => onChange('district', e.target.value)}
                />
            </div>
            <div className="field col-12 md:col-6">
                <label htmlFor="locality">Localidad</label>
                <InputText
                    id="locality"
                    value={data.locality}
                    onChange={(e) => onChange('locality', e.target.value)}
                />
            </div>
        </div>
    );
};

export default ProducerAuthorStep;
