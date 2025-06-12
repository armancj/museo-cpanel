'use client';
import { useEffect, useState, useRef } from 'react';
import { FieldWithHistory } from './FieldWithHistory';
import { CulturalHeritageProperty, Status } from '../types';
import { Panel } from 'primereact/panel';

interface ProducerAuthorFormProps {
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

export const ProducerAuthorForm = ({
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
}: ProducerAuthorFormProps) => {
    const [isFormValid, setIsFormValid] = useState(false);
    // Ref to track if we've already updated the form validity
    const formValidityUpdatedRef = useRef(false);

    // Initialize producerAuthor if it doesn't exist
    useEffect(() => {
        // Only initialize if data exists but producerAuthor doesn't
        if (data && !data.producerAuthor) {
            setData({
                ...data,
                producerAuthor: {
                    betweenStreet1: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                    betweenStreet2: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                    district: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                    institutionalHistory: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                    locality: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                    municipality: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                    number: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                    objectEntryHistory: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                    producerAuthorNames: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                    province: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                    street: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] }
                }
            });
        }
    // Only run this effect when the component mounts or when data.uuid changes
    }, [data?.uuid, setData]);

    // Check if the form is valid
    useEffect(() => {
        if (!data.producerAuthor) {
            setIsFormValid(false);
            markStepCompleted(currentStep, false);
            return;
        }

        const { producerAuthor } = data;
        const requiredFields = [
            producerAuthor.producerAuthorNames.value
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
    }, [data.producerAuthor, data.producerAuthor?.producerAuthorNames?.value, currentStep, isFormValid, markStepCompleted]);

    // Update a field in the producer author
    const updateField = (field: string, value: any) => {
        if (!data.producerAuthor) return;

        setData({
            ...data,
            producerAuthor: {
                ...data.producerAuthor,
                [field]: {
                    ...data.producerAuthor[field as keyof typeof data.producerAuthor],
                    value
                }
            }
        });
    };

    // Update a field's status in the producer author
    const updateFieldStatus = (field: string, status: Status) => {
        if (!data.producerAuthor) return;

        setData({
            ...data,
            producerAuthor: {
                ...data.producerAuthor,
                [field]: {
                    ...data.producerAuthor[field as keyof typeof data.producerAuthor],
                    status
                }
            }
        });
    };

    // Update a field's comment in the producer author
    const updateFieldComment = (field: string, comment: string) => {
        if (!data.producerAuthor) return;

        setData({
            ...data,
            producerAuthor: {
                ...data.producerAuthor,
                [field]: {
                    ...data.producerAuthor[field as keyof typeof data.producerAuthor],
                    comment
                }
            }
        });
    };

    // If producerAuthor is not initialized yet, show loading or return null
    if (!data.producerAuthor) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="grid">
            <div className="col-12">
                <Panel header="Información del Productor/Autor" toggleable>
                    <div className="grid">
                        <div className="col-12">
                            <FieldWithHistory
                                label="Nombres del Productor/Autor"
                                field={data.producerAuthor.producerAuthorNames}
                                type="text"
                                onChange={(value) => updateField('producerAuthorNames', value)}
                                onStatusChange={(status) => updateFieldStatus('producerAuthorNames', status)}
                                onCommentChange={(comment) => updateFieldComment('producerAuthorNames', comment)}
                                canEdit={canEditField(data.producerAuthor.producerAuthorNames.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                required={true}
                                placeholder="Ingrese los nombres del productor o autor"
                            />
                        </div>
                        <div className="col-12">
                            <FieldWithHistory
                                label="Historia Institucional"
                                field={data.producerAuthor.institutionalHistory}
                                type="textarea"
                                onChange={(value) => updateField('institutionalHistory', value)}
                                onStatusChange={(status) => updateFieldStatus('institutionalHistory', status)}
                                onCommentChange={(comment) => updateFieldComment('institutionalHistory', comment)}
                                canEdit={canEditField(data.producerAuthor.institutionalHistory.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Ingrese la historia institucional"
                            />
                        </div>
                        <div className="col-12">
                            <FieldWithHistory
                                label="Historia de Entrada del Objeto"
                                field={data.producerAuthor.objectEntryHistory}
                                type="textarea"
                                onChange={(value) => updateField('objectEntryHistory', value)}
                                onStatusChange={(status) => updateFieldStatus('objectEntryHistory', status)}
                                onCommentChange={(comment) => updateFieldComment('objectEntryHistory', comment)}
                                canEdit={canEditField(data.producerAuthor.objectEntryHistory.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Ingrese la historia de entrada del objeto"
                            />
                        </div>
                    </div>
                </Panel>
            </div>

            <div className="col-12">
                <Panel header="Dirección" toggleable>
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Provincia"
                                field={data.producerAuthor.province}
                                type="text"
                                onChange={(value) => updateField('province', value)}
                                onStatusChange={(status) => updateFieldStatus('province', status)}
                                onCommentChange={(comment) => updateFieldComment('province', comment)}
                                canEdit={canEditField(data.producerAuthor.province.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Ingrese la provincia"
                            />
                        </div>
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Municipio"
                                field={data.producerAuthor.municipality}
                                type="text"
                                onChange={(value) => updateField('municipality', value)}
                                onStatusChange={(status) => updateFieldStatus('municipality', status)}
                                onCommentChange={(comment) => updateFieldComment('municipality', comment)}
                                canEdit={canEditField(data.producerAuthor.municipality.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Ingrese el municipio"
                            />
                        </div>
                    </div>

                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Localidad"
                                field={data.producerAuthor.locality}
                                type="text"
                                onChange={(value) => updateField('locality', value)}
                                onStatusChange={(status) => updateFieldStatus('locality', status)}
                                onCommentChange={(comment) => updateFieldComment('locality', comment)}
                                canEdit={canEditField(data.producerAuthor.locality.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Ingrese la localidad"
                            />
                        </div>
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Distrito"
                                field={data.producerAuthor.district}
                                type="text"
                                onChange={(value) => updateField('district', value)}
                                onStatusChange={(status) => updateFieldStatus('district', status)}
                                onCommentChange={(comment) => updateFieldComment('district', comment)}
                                canEdit={canEditField(data.producerAuthor.district.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Ingrese el distrito"
                            />
                        </div>
                    </div>

                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Calle"
                                field={data.producerAuthor.street}
                                type="text"
                                onChange={(value) => updateField('street', value)}
                                onStatusChange={(status) => updateFieldStatus('street', status)}
                                onCommentChange={(comment) => updateFieldComment('street', comment)}
                                canEdit={canEditField(data.producerAuthor.street.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Ingrese la calle"
                            />
                        </div>
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Número"
                                field={data.producerAuthor.number}
                                type="text"
                                onChange={(value) => updateField('number', value)}
                                onStatusChange={(status) => updateFieldStatus('number', status)}
                                onCommentChange={(comment) => updateFieldComment('number', comment)}
                                canEdit={canEditField(data.producerAuthor.number.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Ingrese el número"
                            />
                        </div>
                    </div>

                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Entre Calle 1"
                                field={data.producerAuthor.betweenStreet1}
                                type="text"
                                onChange={(value) => updateField('betweenStreet1', value)}
                                onStatusChange={(status) => updateFieldStatus('betweenStreet1', status)}
                                onCommentChange={(comment) => updateFieldComment('betweenStreet1', comment)}
                                canEdit={canEditField(data.producerAuthor.betweenStreet1.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Ingrese la primera calle de referencia"
                            />
                        </div>
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Entre Calle 2"
                                field={data.producerAuthor.betweenStreet2}
                                type="text"
                                onChange={(value) => updateField('betweenStreet2', value)}
                                onStatusChange={(status) => updateFieldStatus('betweenStreet2', status)}
                                onCommentChange={(comment) => updateFieldComment('betweenStreet2', comment)}
                                canEdit={canEditField(data.producerAuthor.betweenStreet2.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Ingrese la segunda calle de referencia"
                            />
                        </div>
                    </div>
                </Panel>
            </div>
        </div>
    );
};
