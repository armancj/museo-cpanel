'use client';
import { useEffect, useState, useRef } from 'react';
import { FieldWithHistory } from './FieldWithHistory';
import { CulturalHeritageProperty, Status } from '../types';
import { Panel } from 'primereact/panel';

interface CulturalRecordFormProps {
    data: CulturalHeritageProperty;
    setData: (data: CulturalHeritageProperty) => void;
    canEditField: (status: Status) => boolean;
    canViewHistory: () => boolean;
    canChangeStatus: () => boolean;
    openHistoryDialog: (field: any, title: string) => void;
    isEditMode: boolean;
    markStepCompleted: (index: number, completed: boolean) => void;
    currentStep: number;
    submitted: boolean;
}

export const CulturalRecordForm = ({
    data,
    setData,
    canEditField,
    canViewHistory,
    canChangeStatus,
    openHistoryDialog,
    isEditMode,
    markStepCompleted,
    currentStep,
    submitted
}: CulturalRecordFormProps) => {
    const [isFormValid, setIsFormValid] = useState(false);
    // Ref to track if we've already updated the form validity
    const formValidityUpdatedRef = useRef(false);

    // Check if the form is valid
    useEffect(() => {
        const { culturalRecord } = data;
        const requiredFields = [
            culturalRecord.objectTitle.value,
            culturalRecord.objectDescription.value,
            culturalRecord.extremeDates.value.start,
            culturalRecord.extremeDates.value.end
        ];

        const isValid = requiredFields.every(field => field !== null && field !== undefined && field !== '');

        // Only update state and call markStepCompleted if the validity has changed
        // and we haven't already updated it for this set of values
        if (isValid !== isFormValid && !formValidityUpdatedRef.current) {
            formValidityUpdatedRef.current = true;
            setIsFormValid(isValid);
            markStepCompleted(currentStep, isValid);
        } else {
            // Reset the ref if the validity hasn't changed
            formValidityUpdatedRef.current = false;
        }
    }, [
        data.culturalRecord?.objectTitle?.value,
        data.culturalRecord?.objectDescription?.value,
        data.culturalRecord?.extremeDates?.value?.start,
        data.culturalRecord?.extremeDates?.value?.end,
        currentStep,
        isFormValid,
        markStepCompleted
    ]);

    // Update a field in the cultural record
    const updateField = (field: string, value: any) => {
        setData({
            ...data,
            culturalRecord: {
                ...data.culturalRecord,
                [field]: {
                    ...data.culturalRecord[field as keyof typeof data.culturalRecord],
                    value
                }
            }
        });
    };

    // Update a field's status in the cultural record
    const updateFieldStatus = (field: string, status: Status) => {
        setData({
            ...data,
            culturalRecord: {
                ...data.culturalRecord,
                [field]: {
                    ...data.culturalRecord[field as keyof typeof data.culturalRecord],
                    status
                }
            }
        });
    };

    // Update a field's comment in the cultural record
    const updateFieldComment = (field: string, comment: string) => {
        setData({
            ...data,
            culturalRecord: {
                ...data.culturalRecord,
                [field]: {
                    ...data.culturalRecord[field as keyof typeof data.culturalRecord],
                    comment
                }
            }
        });
    };

    // Sample options for dropdowns
    const languageOptions = [
        { label: 'Español', value: 'es' },
        { label: 'Inglés', value: 'en' },
        { label: 'Francés', value: 'fr' },
        { label: 'Alemán', value: 'de' },
        { label: 'Italiano', value: 'it' }
    ];

    const supportOptions = [
        { label: 'Papel', value: 'paper' },
        { label: 'Digital', value: 'digital' },
        { label: 'Fotografía', value: 'photo' },
        { label: 'Audio', value: 'audio' },
        { label: 'Video', value: 'video' }
    ];

    const letterOptions = [
        { label: 'Manuscrito', value: 'manuscript' },
        { label: 'Impreso', value: 'printed' },
        { label: 'Mecanografiado', value: 'typed' }
    ];

    const descriptionInstrumentOptions = [
        { label: 'Ficha', value: 'card' },
        { label: 'Catálogo', value: 'catalog' },
        { label: 'Inventario', value: 'inventory' },
        { label: 'Base de datos', value: 'database' }
    ];

    const conservationStateOptions = [
        { label: 'Excelente', value: 'excellent' },
        { label: 'Bueno', value: 'good' },
        { label: 'Regular', value: 'regular' },
        { label: 'Malo', value: 'bad' },
        { label: 'Pésimo', value: 'terrible' }
    ];

    const valueGradeOptions = [
        { label: 'I', value: 'I' },
        { label: 'II', value: 'II' },
        { label: 'III', value: 'III' }
    ];

    const descriptionLevelOptions = [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 }
    ];

    return (
        <div className="grid">
            <div className="col-12">
                <Panel header="Información Básica" toggleable>
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Título del Objeto"
                                field={data?.culturalRecord?.objectTitle}
                                type="text"
                                onChange={(value) => updateField('objectTitle', value)}
                                onStatusChange={(status) => updateFieldStatus('objectTitle', status)}
                                onCommentChange={(comment) => updateFieldComment('objectTitle', comment)}
                                canEdit={canEditField(data.culturalRecord.objectTitle.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                required={true}
                                placeholder="Ingrese el título del objeto"
                            />
                        </div>
                        <div className="col-12">
                            <FieldWithHistory
                                label="Descripción del Objeto"
                                field={data.culturalRecord.objectDescription}
                                type="textarea"
                                onChange={(value) => updateField('objectDescription', value)}
                                onStatusChange={(status) => updateFieldStatus('objectDescription', status)}
                                onCommentChange={(comment) => updateFieldComment('objectDescription', comment)}
                                canEdit={canEditField(data.culturalRecord.objectDescription.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                required={true}
                                placeholder="Ingrese una descripción detallada del objeto"
                            />
                        </div>
                    </div>
                </Panel>
            </div>

            <div className="col-12">
                <Panel header="Fechas y Dimensiones" toggleable>
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Fechas Extremas"
                                field={data.culturalRecord.extremeDates}
                                type="daterange"
                                onChange={(value) => updateField('extremeDates', value)}
                                onStatusChange={(status) => updateFieldStatus('extremeDates', status)}
                                onCommentChange={(comment) => updateFieldComment('extremeDates', comment)}
                                canEdit={canEditField(data.culturalRecord.extremeDates.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                required={true}
                            />
                        </div>
                        <div className="col-12 md:col-6">
                            <label style={{ visibility: 'hidden' }}>Grado</label>
                            <FieldWithHistory
                                label="Grado de Valor"
                                field={data.culturalRecord.valueGrade}
                                type="dropdown"
                                options={valueGradeOptions}
                                onChange={(value) => updateField('valueGrade', value)}
                                onStatusChange={(status) => updateFieldStatus('valueGrade', status)}
                                onCommentChange={(comment) => updateFieldComment('valueGrade', comment)}
                                canEdit={canEditField(data.culturalRecord.valueGrade.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                            />
                        </div>
                    </div>

                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Nivel de Descripción"
                                field={data.culturalRecord.descriptionLevel}
                                type="dropdown"
                                options={descriptionLevelOptions}
                                onChange={(value) => updateField('descriptionLevel', value)}
                                onStatusChange={(status) => updateFieldStatus('descriptionLevel', status)}
                                onCommentChange={(comment) => updateFieldComment('descriptionLevel', comment)}
                                canEdit={canEditField(data.culturalRecord.descriptionLevel.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                            />
                        </div>
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Valoración"
                                field={data.culturalRecord.valuation}
                                type="number"
                                onChange={(value) => updateField('valuation', value)}
                                onStatusChange={(status) => updateFieldStatus('valuation', status)}
                                onCommentChange={(comment) => updateFieldComment('valuation', comment)}
                                canEdit={canEditField(data.culturalRecord.valuation.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                            />
                        </div>
                    </div>
                </Panel>
            </div>

            <div className="col-12">
                <Panel header="Descriptores" toggleable>
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Descriptores Onomásticos"
                                field={data.culturalRecord.onomasticDescriptors}
                                type="text"
                                onChange={(value) => updateField('onomasticDescriptors', value)}
                                onStatusChange={(status) => updateFieldStatus('onomasticDescriptors', status)}
                                onCommentChange={(comment) => updateFieldComment('onomasticDescriptors', comment)}
                                canEdit={canEditField(data.culturalRecord.onomasticDescriptors.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Nombres de personas, familias o entidades"
                            />
                        </div>
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Descriptores Geográficos"
                                field={data.culturalRecord.geographicDescriptors}
                                type="text"
                                onChange={(value) => updateField('geographicDescriptors', value)}
                                onStatusChange={(status) => updateFieldStatus('geographicDescriptors', status)}
                                onCommentChange={(comment) => updateFieldComment('geographicDescriptors', comment)}
                                canEdit={canEditField(data.culturalRecord.geographicDescriptors.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Lugares, regiones, accidentes geográficos"
                            />
                        </div>
                    </div>

                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Descriptores Institucionales"
                                field={data.culturalRecord.institutionalDescriptors}
                                type="text"
                                onChange={(value) => updateField('institutionalDescriptors', value)}
                                onStatusChange={(status) => updateFieldStatus('institutionalDescriptors', status)}
                                onCommentChange={(comment) => updateFieldComment('institutionalDescriptors', comment)}
                                canEdit={canEditField(data.culturalRecord.institutionalDescriptors.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Instituciones relacionadas"
                            />
                        </div>
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Descriptores de Materia"
                                field={data.culturalRecord.subjectDescriptors}
                                type="text"
                                onChange={(value) => updateField('subjectDescriptors', value)}
                                onStatusChange={(status) => updateFieldStatus('subjectDescriptors', status)}
                                onCommentChange={(comment) => updateFieldComment('subjectDescriptors', comment)}
                                canEdit={canEditField(data.culturalRecord.subjectDescriptors.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Temas, materias, conceptos"
                            />
                        </div>
                    </div>
                </Panel>
            </div>

            <div className="col-12">
                <Panel header="Características Físicas" toggleable>
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Idiomas"
                                field={data.culturalRecord.languages}
                                type="multiselect"
                                options={languageOptions}
                                onChange={(value) => updateField('languages', value)}
                                onStatusChange={(status) => updateFieldStatus('languages', status)}
                                onCommentChange={(comment) => updateFieldComment('languages', comment)}
                                canEdit={canEditField(data.culturalRecord.languages.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                            />
                        </div>
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Soportes"
                                field={data.culturalRecord.supports}
                                type="multiselect"
                                options={supportOptions}
                                onChange={(value) => updateField('supports', value)}
                                onStatusChange={(status) => updateFieldStatus('supports', status)}
                                onCommentChange={(comment) => updateFieldComment('supports', comment)}
                                canEdit={canEditField(data.culturalRecord.supports.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                            />
                        </div>
                    </div>

                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Tipos de Letra"
                                field={data.culturalRecord.letters}
                                type="multiselect"
                                options={letterOptions}
                                onChange={(value) => updateField('letters', value)}
                                onStatusChange={(status) => updateFieldStatus('letters', status)}
                                onCommentChange={(comment) => updateFieldComment('letters', comment)}
                                canEdit={canEditField(data.culturalRecord.letters.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                            />
                        </div>
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Instrumentos de Descripción"
                                field={data.culturalRecord.descriptionInstrument}
                                type="multiselect"
                                options={descriptionInstrumentOptions}
                                onChange={(value) => updateField('descriptionInstrument', value)}
                                onStatusChange={(status) => updateFieldStatus('descriptionInstrument', status)}
                                onCommentChange={(comment) => updateFieldComment('descriptionInstrument', comment)}
                                canEdit={canEditField(data.culturalRecord.descriptionInstrument.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                            />
                        </div>
                    </div>

                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Estado de Conservación"
                                field={data.culturalRecord.conservationState}
                                type="multiselect"
                                options={conservationStateOptions}
                                onChange={(value) => updateField('conservationState', value)}
                                onStatusChange={(status) => updateFieldStatus('conservationState', status)}
                                onCommentChange={(comment) => updateFieldComment('conservationState', comment)}
                                canEdit={canEditField(data.culturalRecord.conservationState.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                            />
                        </div>
                    </div>
                </Panel>
            </div>

            <div className="col-12">
                <Panel header="Títulos Adicionales" toggleable>
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Título de Fondo"
                                field={data.culturalRecord.backgroundTitle}
                                type="text"
                                onChange={(value) => updateField('backgroundTitle', value)}
                                onStatusChange={(status) => updateFieldStatus('backgroundTitle', status)}
                                onCommentChange={(comment) => updateFieldComment('backgroundTitle', comment)}
                                canEdit={canEditField(data.culturalRecord.backgroundTitle.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Título del fondo documental"
                            />
                        </div>
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Título de Sección"
                                field={data.culturalRecord.sectionTitle}
                                type="text"
                                onChange={(value) => updateField('sectionTitle', value)}
                                onStatusChange={(status) => updateFieldStatus('sectionTitle', status)}
                                onCommentChange={(comment) => updateFieldComment('sectionTitle', comment)}
                                canEdit={canEditField(data.culturalRecord.sectionTitle.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Título de la sección"
                            />
                        </div>
                    </div>
                </Panel>
            </div>
        </div>
    );
};
