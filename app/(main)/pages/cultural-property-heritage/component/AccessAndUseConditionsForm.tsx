'use client';
import { useEffect, useState, useRef } from 'react';
import { FieldWithHistory } from './FieldWithHistory';
import { CulturalHeritageProperty, Status } from '../types';
import { Panel } from 'primereact/panel';

interface AccessAndUseConditionsFormProps {
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

export const AccessAndUseConditionsForm = ({
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
}: AccessAndUseConditionsFormProps) => {
    const [isFormValid, setIsFormValid] = useState(false);
    // Ref to track if we've already updated the form validity
    const formValidityUpdatedRef = useRef(false);

    // Initialize accessAndUseConditions if it doesn't exist
    useEffect(() => {
        if (!data.accessAndUseConditions) {
            setData({
                ...data,
                accessAndUseConditions: {
                    accessConditions: { value: [], modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                    reproductionConditions: { value: [], modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                    technicalRequirements: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] }
                }
            });
        }
    }, [data, setData]);

    // Check if the form is valid
    useEffect(() => {
        if (!data.accessAndUseConditions) {
            setIsFormValid(false);
            markStepCompleted(currentStep, false);
            return;
        }

        // For this step, we'll consider it valid if at least one field has a value
        const { accessAndUseConditions } = data;
        const hasAccessConditions = accessAndUseConditions.accessConditions.value.length > 0;
        const hasReproductionConditions = accessAndUseConditions.reproductionConditions.value.length > 0;
        const hasTechnicalRequirements = !!accessAndUseConditions.technicalRequirements.value;

        const isValid = hasAccessConditions || hasReproductionConditions || hasTechnicalRequirements;

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
        data,
        currentStep,
        isFormValid,
        markStepCompleted
    ]);

    // Update a field in the access and use conditions
    const updateField = (field: string, value: any) => {
        if (!data.accessAndUseConditions) return;

        setData({
            ...data,
            accessAndUseConditions: {
                ...data.accessAndUseConditions,
                [field]: {
                    ...data.accessAndUseConditions[field as keyof typeof data.accessAndUseConditions],
                    value
                }
            }
        });
    };

    // Update a field's status in the access and use conditions
    const updateFieldStatus = (field: string, status: Status) => {
        if (!data.accessAndUseConditions) return;

        setData({
            ...data,
            accessAndUseConditions: {
                ...data.accessAndUseConditions,
                [field]: {
                    ...data.accessAndUseConditions[field as keyof typeof data.accessAndUseConditions],
                    status
                }
            }
        });
    };

    // Update a field's comment in the access and use conditions
    const updateFieldComment = (field: string, comment: string) => {
        if (!data.accessAndUseConditions) return;

        setData({
            ...data,
            accessAndUseConditions: {
                ...data.accessAndUseConditions,
                [field]: {
                    ...data.accessAndUseConditions[field as keyof typeof data.accessAndUseConditions],
                    comment
                }
            }
        });
    };

    // Sample options for dropdowns
    const accessConditionsOptions = [
        { label: 'Acceso Libre', value: 'free_access' },
        { label: 'Acceso Restringido', value: 'restricted_access' },
        { label: 'Acceso con Autorización', value: 'authorized_access' },
        { label: 'Acceso Prohibido', value: 'prohibited_access' }
    ];

    const reproductionConditionsOptions = [
        { label: 'Reproducción Permitida', value: 'allowed_reproduction' },
        { label: 'Reproducción con Autorización', value: 'authorized_reproduction' },
        { label: 'Reproducción Prohibida', value: 'prohibited_reproduction' },
        { label: 'Reproducción con Fines Educativos', value: 'educational_reproduction' }
    ];


    // 🔍 DEBUGGING: Log the access conditions field data
    useEffect(() => {
        if (data.accessAndUseConditions?.accessConditions) {
            console.log('🔍 ACCESS FORM - accessConditions field:', data.accessAndUseConditions.accessConditions);
            console.log('🔍 ACCESS FORM - accessConditions history:', data.accessAndUseConditions.accessConditions.history);
            console.log('🔍 ACCESS FORM - history length:', data.accessAndUseConditions.accessConditions.history?.length);
        }
    }, [data.accessAndUseConditions?.accessConditions]);


    // If accessAndUseConditions is not initialized yet, show loading or return null
    if (!data.accessAndUseConditions) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="grid">
            <div className="col-12">
                <Panel header="Condiciones de Acceso y Uso" toggleable>
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Condiciones de Acceso"
                                field={data.accessAndUseConditions.accessConditions}
                                type="multiselect"
                                options={accessConditionsOptions}
                                onChange={(value) => updateField('accessConditions', value)}
                                onStatusChange={(status) => updateFieldStatus('accessConditions', status)}
                                onCommentChange={(comment) => updateFieldComment('accessConditions', comment)}
                                canEdit={canEditField(data.accessAndUseConditions.accessConditions.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Seleccione las condiciones de acceso"
                            />
                        </div>
                        <div className="col-12 md:col-6">
                            <FieldWithHistory
                                label="Condiciones de Reproducción"
                                field={data.accessAndUseConditions.reproductionConditions}
                                type="multiselect"
                                options={reproductionConditionsOptions}
                                onChange={(value) => updateField('reproductionConditions', value)}
                                onStatusChange={(status) => updateFieldStatus('reproductionConditions', status)}
                                onCommentChange={(comment) => updateFieldComment('reproductionConditions', comment)}
                                canEdit={canEditField(data.accessAndUseConditions.reproductionConditions.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Seleccione las condiciones de reproducción"
                            />
                        </div>
                    </div>

                    <div className="grid">
                        <div className="col-12">
                            <FieldWithHistory
                                label="Requisitos Técnicos"
                                field={data.accessAndUseConditions.technicalRequirements}
                                type="textarea"
                                onChange={(value) => updateField('technicalRequirements', value)}
                                onStatusChange={(status) => updateFieldStatus('technicalRequirements', status)}
                                onCommentChange={(comment) => updateFieldComment('technicalRequirements', comment)}
                                canEdit={canEditField(data.accessAndUseConditions.technicalRequirements.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Ingrese los requisitos técnicos para acceder o reproducir el objeto"
                            />
                        </div>
                    </div>
                </Panel>
            </div>
        </div>
    );
};
