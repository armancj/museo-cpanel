'use client';
import { useEffect, useState, useRef } from 'react';
import { FieldWithHistory } from './FieldWithHistory';
import { CulturalHeritageProperty, Status } from '../types';
import { Panel } from 'primereact/panel';

interface DescriptionControlFormProps {
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

export const DescriptionControlForm = ({
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
}: DescriptionControlFormProps) => {
    const [isFormValid, setIsFormValid] = useState(false);
    // Ref to track if we've already updated the form validity
    const formValidityUpdatedRef = useRef(false);

    // Initialize descriptionControl if it doesn't exist
    useEffect(() => {
        if (!data.descriptionControl) {
            setData({
                ...data,
                descriptionControl: {
                    descriptionMadeBy: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                    descriptionDateTime: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                    reviewedBy: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                    reviewDateTime: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] }
                }
            });
        }
    }, [data, setData]);

    // Check if the form is valid
    useEffect(() => {
        if (!data.descriptionControl) {
            setIsFormValid(false);
            markStepCompleted(currentStep, false);
            return;
        }

        // For this step, we'll consider it valid if at least the description made by field has a value
        const { descriptionControl } = data;
        const hasDescriptionMadeBy = !!descriptionControl.descriptionMadeBy.value;

        // Only update state and call markStepCompleted if the validity has changed
        // and we haven't already updated it for this set of values
        if (hasDescriptionMadeBy !== isFormValid && !formValidityUpdatedRef.current) {
            formValidityUpdatedRef.current = true;
            setIsFormValid(hasDescriptionMadeBy);
            markStepCompleted(currentStep, hasDescriptionMadeBy);
        } else {
            // Reset the ref if the validity hasn't changed
            formValidityUpdatedRef.current = false;
        }
    }, [
        data.descriptionControl,
        currentStep,
        isFormValid,
        markStepCompleted
    ]);

    // Update a field in the description control
    const updateField = (field: string, value: any) => {
        if (!data.descriptionControl) return;

        setData({
            ...data,
            descriptionControl: {
                ...data.descriptionControl,
                [field]: {
                    ...data.descriptionControl[field as keyof typeof data.descriptionControl],
                    value
                }
            }
        });
    };

    // Update a field's status in the description control
    const updateFieldStatus = (field: string, status: Status) => {
        if (!data.descriptionControl) return;

        setData({
            ...data,
            descriptionControl: {
                ...data.descriptionControl,
                [field]: {
                    ...data.descriptionControl[field as keyof typeof data.descriptionControl],
                    status
                }
            }
        });
    };

    // Update a field's comment in the description control
    const updateFieldComment = (field: string, comment: string) => {
        if (!data.descriptionControl) return;

        setData({
            ...data,
            descriptionControl: {
                ...data.descriptionControl,
                [field]: {
                    ...data.descriptionControl[field as keyof typeof data.descriptionControl],
                    comment
                }
            }
        });
    };

    // If descriptionControl is not initialized yet, show loading or return null
    if (!data.descriptionControl) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="grid">
            <div className="col-12">
                <Panel header="Control de Descripción" toggleable>
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Descripción Realizada Por"
                                field={data.descriptionControl.descriptionMadeBy}
                                type="text"
                                onChange={(value) => updateField('descriptionMadeBy', value)}
                                onStatusChange={(status) => updateFieldStatus('descriptionMadeBy', status)}
                                onCommentChange={(comment) => updateFieldComment('descriptionMadeBy', comment)}
                                canEdit={canEditField(data.descriptionControl.descriptionMadeBy.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                required={true}
                                placeholder="Ingrese el nombre de la persona que realizó la descripción"
                            />
                        </div>
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Fecha y Hora de la Descripción"
                                field={data.descriptionControl.descriptionDateTime}
                                type="date"
                                onChange={(value) => updateField('descriptionDateTime', value)}
                                onStatusChange={(status) => updateFieldStatus('descriptionDateTime', status)}
                                onCommentChange={(comment) => updateFieldComment('descriptionDateTime', comment)}
                                canEdit={canEditField(data.descriptionControl.descriptionDateTime.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Seleccione la fecha y hora de la descripción"
                            />
                        </div>
                    </div>

                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Revisado Por"
                                field={data.descriptionControl.reviewedBy}
                                type="text"
                                onChange={(value) => updateField('reviewedBy', value)}
                                onStatusChange={(status) => updateFieldStatus('reviewedBy', status)}
                                onCommentChange={(comment) => updateFieldComment('reviewedBy', comment)}
                                canEdit={canEditField(data.descriptionControl.reviewedBy.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Ingrese el nombre de la persona que revisó la descripción"
                            />
                        </div>
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Fecha y Hora de la Revisión"
                                field={data.descriptionControl.reviewDateTime}
                                type="date"
                                onChange={(value) => updateField('reviewDateTime', value)}
                                onStatusChange={(status) => updateFieldStatus('reviewDateTime', status)}
                                onCommentChange={(comment) => updateFieldComment('reviewDateTime', comment)}
                                canEdit={canEditField(data.descriptionControl.reviewDateTime.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Seleccione la fecha y hora de la revisión"
                            />
                        </div>
                    </div>
                </Panel>
            </div>
        </div>
    );
};
