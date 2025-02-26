import React from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Chips } from 'primereact/chips';
import {
    CulturalRecord,
    Dimensions,
    ExtremeDates,
    VolumesQuantities,
} from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';

interface CulturalRecordStepProps {
    data: CulturalRecord;
    onChange: <K extends keyof CulturalRecord>(field: K, value: CulturalRecord[K]) => void; // Evento de cambio principal
}

const CulturalRecordStep: React.FC<CulturalRecordStepProps> = ({ data, onChange }) => {

    const handleExtremeDatesChange = (field: keyof ExtremeDates, value: Date) => {
        const updatedExtremeDates = {
            ...data.extremeDates,
            [field]: value,
        };
        onChange('extremeDates', updatedExtremeDates);
    };

    const handleVolumesQuantitiesChange = (field: keyof VolumesQuantities, value: number) => {
        const updatedVolumesQuantities = {
            ...data.volumesQuantities,
            [field]: value,
        };
        onChange('volumesQuantities', updatedVolumesQuantities);
    };

    const handleDimensionsChange = (field: keyof Dimensions, value: number) => {
        const updatedDimensions = {
            ...data.dimensions,
            [field]: value,
        };
        onChange('dimensions', updatedDimensions);
    };

    return (
        <div className="card p-fluid">
            <div className="formgrid grid">
            {/* Título del Objeto */}
            <div className="field col">
                <label htmlFor="objectTitle">Título del Objeto</label>
                <InputText
                    id="objectTitle"
                    value={data.objectTitle}
                    onChange={(e) => onChange('objectTitle', e.target.value)}
                />
            </div>

            {/* Descripción del Objeto */}
            <div className="field col-5">
                <label htmlFor="objectDescription">Descripción del Objeto</label>
                <InputText
                    id="objectDescription"
                    value={data.objectDescription}
                    onChange={(e) => onChange('objectDescription', e.target.value)}
                />
            </div>

            {/* Descripción Extrema */}
            <div className="field col-2">
                <label>Fechas Extremas</label>
                <div className="p-grid">
                    <div className="p-col">
                        <label htmlFor="start">Inicio</label>
                        <Calendar
                            id="start"
                            value={data.extremeDates.start}
                            onChange={(e) => handleExtremeDatesChange('start', e.value ?? new Date(Date.now()))}
                            showButtonBar
                            dateFormat="yy-mm-dd"
                        />
                    </div>
                    <div className="p-col">
                        <label htmlFor="end">Fin</label>
                        <Calendar
                            id="end"
                            value={data.extremeDates.end}
                            onChange={(e) => handleExtremeDatesChange('end', e.value ?? new Date(Date.now()))}
                            showButtonBar
                            dateFormat="yy-mm-dd"
                        />
                    </div>
                </div>
            </div>

            {/* Cantidades y Volúmenes */}
            <div className="field col-6">
                <label>Cantidades (Volúmenes)</label>
                <div className="p-grid">
                    <div className="p-col-4">
                        <label htmlFor="file">Archivos</label>
                        <InputNumber
                            id="file"
                            value={data.volumesQuantities.file}
                            onValueChange={(e) => handleVolumesQuantitiesChange('file', e.value || 0)}
                        />
                    </div>
                    <div className="p-col-4">
                        <label htmlFor="pages">Páginas</label>
                        <InputNumber
                            id="pages"
                            value={data.volumesQuantities.pages}
                            onValueChange={(e) => handleVolumesQuantitiesChange('pages', e.value || 0)}
                        />
                    </div>
                    <div className="p-col-4">
                        <label htmlFor="books">Libros</label>
                        <InputNumber
                            id="books"
                            value={data.volumesQuantities.books}
                            onValueChange={(e) => handleVolumesQuantitiesChange('books', e.value || 0)}
                        />
                    </div>
                </div>
            </div>

            {/* Dimensiones */}
            <div className="field">
                <label>Dimensiones</label>
                <div className="p-grid">
                    <div className="p-col">
                        <label htmlFor="heightCms">Altura (cms)</label>
                        <InputNumber
                            id="heightCms"
                            value={data.dimensions.heightCms}
                            onValueChange={(e) => handleDimensionsChange('heightCms', e.value!)}
                        />
                    </div>
                    <div className="p-col">
                        <label htmlFor="widthCms">Anchura (cms)</label>
                        <InputNumber
                            id="widthCms"
                            value={data.dimensions.widthCms}
                            onValueChange={(e) => handleDimensionsChange('widthCms', e.value!)}
                        />
                    </div>
                    <div className="p-col">
                        <label htmlFor="lengthCms">Longitud (cms)</label>
                        <InputNumber
                            id="lengthCms"
                            value={data.dimensions.lengthCms}
                            onValueChange={(e) => handleDimensionsChange('lengthCms', e.value!)}
                        />
                    </div>
                </div>
            </div>

            {/* Idiomas */}
            <div className="field">
                <label htmlFor="languages">Idiomas</label>
                <Chips
                    id="languages"
                    value={data.languages}
                    onChange={(e) => onChange('languages', e.value ?? ['Español'])}
                />
            </div>
        </div>
        </div>
    );
};

export default CulturalRecordStep;
