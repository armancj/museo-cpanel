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
    const {
        languages,
        backgroundTitle,
        sectionTitle,
        objectTitle,
        objectDescription,
        descriptionInstrument,
        descriptionLevel,
        volumesQuantities,
        dimensions,
        supports,
        extremeDates,
        letters,
        conservationState,
        subjectDescriptors,
        onomasticDescriptors,
        geographicDescriptors,
        institutionalDescriptors,
        valueGrade,
        valuation,
    } = data;

    const handleExtremeDatesChange = (field: keyof ExtremeDates, value: Date) => {
        const updatedExtremeDates = {
            ...extremeDates,
            [field]: value as Date,
        };
        onChange('extremeDates', updatedExtremeDates as any);
    };

    const handleVolumesQuantitiesChange = (field: keyof VolumesQuantities, value: number) => {
        const updatedVolumesQuantities = {
            ...volumesQuantities,
            [field]: value,
        };
        onChange('volumesQuantities', updatedVolumesQuantities);
    };

    const handleDimensionsChange = (field: keyof Dimensions, value: number) => {
        const updatedDimensions = {
            ...dimensions,
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
                        value={objectTitle.value}
                        onChange={(e) => onChange('objectTitle', { ...objectTitle, value: e.target.value })}
                    />
                </div>

                {/* Descripción del Objeto */}
                <div className="field col-5">
                    <label htmlFor="objectDescription">Descripción del Objeto</label>
                    <InputText
                        id="objectDescription"
                        value={objectDescription.value}
                        onChange={(e) => onChange('objectDescription', { ...objectDescription, value: e.target.value })}
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
                                value={extremeDates?.value.start}
                                onChange={(e) => handleExtremeDatesChange('start', e.value ?? new Date(Date.now()))}
                                showButtonBar
                                dateFormat="yy-mm-dd"
                            />
                        </div>
                        <div className="p-col">
                            <label htmlFor="end">Fin</label>
                            <Calendar
                                id="end"
                                value={extremeDates?.value.end}
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
                                value={volumesQuantities.value.file}
                                onValueChange={(e) => handleVolumesQuantitiesChange('file', e.value || 0)}
                            />
                        </div>
                        <div className="p-col-4">
                            <label htmlFor="pages">Páginas</label>
                            <InputNumber
                                id="pages"
                                value={volumesQuantities.value.pages}
                                onValueChange={(e) => handleVolumesQuantitiesChange('pages', e.value || 0)}
                            />
                        </div>
                        <div className="p-col-4">
                            <label htmlFor="books">Libros</label>
                            <InputNumber
                                id="books"
                                value={volumesQuantities.value.books}
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
                                value={dimensions.value.heightCms}
                                onValueChange={(e) => handleDimensionsChange('heightCms', e.value!)}
                            />
                        </div>
                        <div className="p-col">
                            <label htmlFor="widthCms">Anchura (cms)</label>
                            <InputNumber
                                id="widthCms"
                                value={dimensions.value.widthCms}
                                onValueChange={(e) => handleDimensionsChange('widthCms', e.value!)}
                            />
                        </div>
                        <div className="p-col">
                            <label htmlFor="lengthCms">Longitud (cms)</label>
                            <InputNumber
                                id="lengthCms"
                                value={dimensions.value.lengthCms}
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
                        value={languages?.value || []}
                        onChange={(e) => onChange('languages', { ...languages, value: e.value ?? ['Español'] })}
                    />
                </div>
            </div>
        </div>
    );
};

export default CulturalRecordStep;
