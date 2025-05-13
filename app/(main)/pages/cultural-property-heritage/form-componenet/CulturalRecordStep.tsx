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
        descriptionLevel,
        objectTitle,
        objectDescription,
        descriptionInstrument,
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

    const valueGradeOptions = [
        { label: 'Alta', value: 'Alta' },
        { label: 'Media', value: 'Media' },
        { label: 'Baja', value: 'Baja' },
    ];


    return (
        <div className="card p-fluid shadow-2 border-round">
            <h2 className="mb-3 text-center font-bold">Información del Objeto Cultural</h2>

            <div className="formgrid grid gap-3">
                {/* Título del Objeto */}
                <div className="field col-12 sm:col-6">
                    <label htmlFor="objectTitle" className="font-semibold mb-2">Título del Objeto</label>
                    <InputText
                        id="objectTitle"
                        value={objectTitle.value ?? ''}
                        onChange={(e) => onChange('objectTitle', { ...objectTitle, value: e.target.value })}
                        className="w-full"
                        placeholder="Ingresa el título del objeto"
                    />
                </div>

                {/* Descripción del Objeto */}
                <div className="field col-12 sm:col-6">
                    <label htmlFor="objectDescription" className="font-semibold mb-2">Descripción del Objeto</label>
                    <InputText
                        id="objectDescription"
                        value={objectDescription.value ?? ''}
                        onChange={(e) => onChange('objectDescription', { ...objectDescription, value: e.target.value })}
                        className="w-full"
                        placeholder="Describe brevemente el objeto"
                    />
                </div>

                {/* Extremos Temporales */}
                {/* [Mantengo los calendarios previamente escritos] */}
                <div className="field col-12">
                    <label className="font-semibold mb-2">Fechas Extremas</label>
                    <div className="grid">
                        <div className="col-12 sm:col-6">
                            <label htmlFor="start" className="block mb-1">Inicio</label>
                            <Calendar
                                id="start"
                                value={extremeDates?.value?.start ?? null}
                                onChange={(e) => handleExtremeDatesChange('start', e.value ?? new Date())}
                                showButtonBar
                                dateFormat="dd-mm-yy"
                                className="w-full"
                                placeholder="Selecciona la fecha de inicio"
                            />
                        </div>
                        <div className="col-12 sm:col-6">
                            <label htmlFor="end" className="block mb-1">Fin</label>
                            <Calendar
                                id="end"
                                value={extremeDates?.value?.end ?? null}
                                onChange={(e) => handleExtremeDatesChange('end', e.value ?? new Date())}
                                showButtonBar
                                dateFormat="dd-mm-yy"
                                className="w-full"
                                placeholder="Selecciona la fecha de fin"
                            />
                        </div>
                    </div>
                </div>

                {/* Descriptores (Onomásticos, Geográficos, Institucionales, Temáticos) */}
                <div className="field col-12 sm:col-6">
                    <label htmlFor="onomasticDescriptors" className="font-semibold mb-2">Descriptores Onomásticos</label>
                    <InputText
                        id="onomasticDescriptors"
                        value={onomasticDescriptors?.value ?? ''}
                        onChange={(e) => onChange('onomasticDescriptors', { ...onomasticDescriptors!, value: e.target.value })}
                        className="w-full"
                        placeholder="Añade descriptores onomásticos"
                    />
                </div>

                <div className="field col-12 sm:col-6">
                    <label htmlFor="geographicDescriptors" className="font-semibold mb-2">Descriptores Geográficos</label>
                    <InputText
                        id="geographicDescriptors"
                        value={geographicDescriptors?.value ?? ''}
                        onChange={(e) => onChange('geographicDescriptors', { ...geographicDescriptors!, value: e.target.value })}
                        className="w-full"
                        placeholder="Añade descriptores geográficos"
                    />
                </div>

                <div className="field col-12 sm:col-6">
                    <label htmlFor="institutionalDescriptors" className="font-semibold mb-2">Descriptores Institucionales</label>
                    <InputText
                        id="institutionalDescriptors"
                        value={institutionalDescriptors?.value ?? ''}
                        onChange={(e) => onChange('institutionalDescriptors', { ...institutionalDescriptors!, value: e.target.value })}
                        className="w-full"
                        placeholder="Añade descriptores institucionales"
                    />
                </div>

                <div className="field col-12">
                    <label htmlFor="subjectDescriptors" className="font-semibold mb-2">Descriptores Temáticos</label>
                    <InputText
                        id="subjectDescriptors"
                        value={subjectDescriptors?.value ?? ''}
                        onChange={(e) => onChange('subjectDescriptors', { ...subjectDescriptors!, value: e.target.value })}
                        className="w-full"
                        placeholder="Añade descriptores temáticos"
                    />
                </div>

                {/* Estado de Conservación */}
                <div className="field col-12">
                    <label htmlFor="conservationState" className="font-semibold mb-2">Estado de Conservación</label>
                    <Chips
                        id="conservationState"
                        value={conservationState?.value ?? []}
                        onChange={(e) => onChange('conservationState', { ...conservationState, value: e.value ?? []})}
                        className="w-full"
                        placeholder="Añade estado(s) de conservación"
                    />
                </div>

                {/* Instrumentos de Descripción y Soportes */}
                <div className="field col-12 sm:col-6">
                    <label htmlFor="descriptionInstrument" className="font-semibold mb-2">Instrumentos de Descripción</label>
                    <Chips
                        id="descriptionInstrument"
                        value={descriptionInstrument?.value ?? []}
                        onChange={(e) => onChange('descriptionInstrument', { ...descriptionInstrument, value: e.value ?? [] })}
                        className="w-full"
                        placeholder="Introduce los instrumentos disponibles"
                    />
                </div>

                <div className="field col-12 sm:col-6">
                    <label htmlFor="supports" className="font-semibold mb-2">Soportes</label>
                    <Chips
                        id="supports"
                        value={supports?.value ?? []}
                        onChange={(e) => onChange('supports', { ...supports, value: e.value ?? [] })}
                        className="w-full"
                        placeholder="Introduce los soportes disponibles"
                    />
                </div>

                {/* Valoración y Grado de Valor */}
                <div className="field col-12 sm:col-6">
                    <label htmlFor="valuation" className="font-semibold mb-2">Valoración</label>
                    <InputNumber
                        id="valuation"
                        value={valuation?.value ?? 0}
                        onValueChange={(e) => onChange('valuation', { ...valuation!, value: e.value ?? 0})}
                        className="w-full"
                        placeholder="Ejemplo: 5"
                    />
                </div>

                <div className="field col-12 sm:col-6">
                    <label htmlFor="valueGrade" className="font-semibold mb-2">Grado de Valor</label>
                    <InputText
                        id="valueGrade"
                        value={valueGrade.value ?? ''}
                        onChange={(e) => onChange('valueGrade', { ...valueGrade, value: e.target.value })}
                        className="w-full"
                        placeholder="Introduce el grado de valor (Ej. Baja, Media, Alta)"
                    />
                </div>

                {/* Letras */}
                <div className="field col-12">
                    <label htmlFor="letters" className="font-semibold mb-2">Letras</label>
                    <Chips
                        id="letters"
                        value={letters?.value ?? []}
                        onChange={(e) => onChange('letters', { ...letters, value: e.value ?? [] })}
                        className="w-full"
                        placeholder="Introduce las letras relevantes"
                    />
                </div>
            </div>
        </div>
    );
};

export default CulturalRecordStep;
