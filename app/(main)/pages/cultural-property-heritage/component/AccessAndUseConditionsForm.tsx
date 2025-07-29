'use client';
import { useEffect, useState, useRef } from 'react';
import { FieldWithHistory } from './FieldWithHistory';
import { CulturalHeritageProperty, Status } from '../types';
import { Panel } from 'primereact/panel';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { getUpdatedStatus } from '../utils/statusUtils';

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
    accessConditionsOptions: { label: string; value: string }[];
    reproductionConditionsOptions: { label: string; value: string }[];
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
    submitted,
    accessConditionsOptions,
    reproductionConditionsOptions
}: AccessAndUseConditionsFormProps) => {
    const [isFormValid, setIsFormValid] = useState(false);
    // Ref to track if we've already updated the form validity
    const formValidityUpdatedRef = useRef(false);

    // State for selected status for the panel
    const [accessAndUseStatus, setAccessAndUseStatus] = useState<Status | null>(null);

    // Status options for dropdown
    const statusOptions = [
        { label: 'Pendiente', value: Status.Pending },
        { label: 'Para Revisar', value: Status.ToReview },
        { label: 'Revisado', value: Status.Reviewed },
        { label: 'Con Problemas', value: Status.HasIssue }
    ];

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

        // Get the current field data
        const currentField = data.accessAndUseConditions[field as keyof typeof data.accessAndUseConditions];

        // Automatically update status based on whether the field is filled
        const newStatus = getUpdatedStatus(value, currentField.status);

        setData({
            ...data,
            accessAndUseConditions: {
                ...data.accessAndUseConditions,
                [field]: {
                    ...currentField,
                    value,
                    status: newStatus
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

    // Update all fields in the access and use conditions panel
    const updateAllAccessAndUseFields = (status: Status) => {
        if (!status || !data.accessAndUseConditions) return;

        setData({
            ...data,
            accessAndUseConditions: {
                ...data.accessAndUseConditions,
                accessConditions: {
                    ...data.accessAndUseConditions.accessConditions,
                    status
                },
                reproductionConditions: {
                    ...data.accessAndUseConditions.reproductionConditions,
                    status
                },
                technicalRequirements: {
                    ...data.accessAndUseConditions.technicalRequirements,
                    status
                }
            }
        });
    };



    // If accessAndUseConditions is not initialized yet, show loading
    if (!data.accessAndUseConditions) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="grid">
            <div className="col-12">
                <Panel
                    header="Condiciones de Acceso y Uso"
                    toggleable
                    headerTemplate={(options) => {
                        return (
                            <div className="flex align-items-center justify-content-between w-full">
                                <div className="flex align-items-center">
                                    <button
                                        className={options.togglerClassName}
                                        onClick={options.onTogglerClick}
                                    >
                                        <span className={options.togglerIconClassName}></span>
                                    </button>
                                    <span className="font-bold">Condiciones de Acceso y Uso</span>
                                </div>
                                {canChangeStatus() && (
                                    <div className="flex align-items-center gap-2">
                                        <Dropdown
                                            value={accessAndUseStatus}
                                            options={statusOptions}
                                            onChange={(e) => setAccessAndUseStatus(e.value)}
                                            placeholder="Seleccionar estado"
                                            className="p-inputtext-sm"
                                        />
                                        <Button
                                            label="Aplicar a todos"
                                            icon="pi pi-check"
                                            className="p-button-sm"
                                            onClick={() => {
                                                if (accessAndUseStatus) {
                                                    updateAllAccessAndUseFields(accessAndUseStatus);
                                                    setAccessAndUseStatus(null);
                                                }
                                            }}
                                            disabled={!accessAndUseStatus}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    }}
                >
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
