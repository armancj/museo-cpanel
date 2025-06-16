'use client';
import { useEffect, useState, useRef } from 'react';
import { FieldWithHistory } from './FieldWithHistory';
import { CulturalHeritageProperty, Status } from '../types';
import { Panel } from 'primereact/panel';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { getUpdatedStatus } from '../utils/statusUtils';

interface AssociatedDocumentationFormProps {
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

export const AssociatedDocumentationForm = ({
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
}: AssociatedDocumentationFormProps) => {
    const [isFormValid, setIsFormValid] = useState(false);
    // Ref to track if we've already updated the form validity
    const formValidityUpdatedRef = useRef(false);

    // State for selected status for the panel
    const [associatedDocumentationStatus, setAssociatedDocumentationStatus] = useState<Status | null>(null);

    // Status options for dropdown
    const statusOptions = [
        { label: 'Pendiente', value: Status.Pending },
        { label: 'Para Revisar', value: Status.ToReview },
        { label: 'Revisado', value: Status.Reviewed },
        { label: 'Con Problemas', value: Status.HasIssue }
    ];

    // Initialize associatedDocumentation if it doesn't exist
    useEffect(() => {
        if (!data.associatedDocumentation) {
            setData({
                ...data,
                associatedDocumentation: {
                    copiesExistenceAndLocation: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                    originalsExistenceAndLocation: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                    relatedDescriptionUnits: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] },
                    relatedPublicationsInformation: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] }
                }
            });
        }
    }, [data, setData]);

    // Check if the form is valid
    useEffect(() => {
        if (!data.associatedDocumentation) {
            setIsFormValid(false);
            markStepCompleted(currentStep, false);
            return;
        }

        // For this step, we'll consider it valid if at least one field has a value
        const { associatedDocumentation } = data;
        const hasCopiesInfo = !!associatedDocumentation.copiesExistenceAndLocation.value;
        const hasOriginalsInfo = !!associatedDocumentation.originalsExistenceAndLocation.value;
        const hasRelatedUnits = !!associatedDocumentation.relatedDescriptionUnits.value;
        const hasRelatedPublications = !!associatedDocumentation.relatedPublicationsInformation.value;

        const isValid = hasCopiesInfo || hasOriginalsInfo || hasRelatedUnits || hasRelatedPublications;

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
        data.associatedDocumentation,
        currentStep,
        isFormValid,
        markStepCompleted
    ]);

    // Update a field in the associated documentation
    const updateField = (field: string, value: any) => {
        if (!data.associatedDocumentation) return;

        // Get the current field data
        const currentField = data.associatedDocumentation[field as keyof typeof data.associatedDocumentation];

        // Automatically update status based on whether the field is filled
        const newStatus = getUpdatedStatus(value, currentField.status);

        setData({
            ...data,
            associatedDocumentation: {
                ...data.associatedDocumentation,
                [field]: {
                    ...currentField,
                    value,
                    status: newStatus
                }
            }
        });
    };

    // Update a field's status in the associated documentation
    const updateFieldStatus = (field: string, status: Status) => {
        if (!data.associatedDocumentation) return;

        setData({
            ...data,
            associatedDocumentation: {
                ...data.associatedDocumentation,
                [field]: {
                    ...data.associatedDocumentation[field as keyof typeof data.associatedDocumentation],
                    status
                }
            }
        });
    };

    // Update a field's comment in the associated documentation
    const updateFieldComment = (field: string, comment: string) => {
        if (!data.associatedDocumentation) return;

        setData({
            ...data,
            associatedDocumentation: {
                ...data.associatedDocumentation,
                [field]: {
                    ...data.associatedDocumentation[field as keyof typeof data.associatedDocumentation],
                    comment
                }
            }
        });
    };

    // Update all fields in the associated documentation panel
    const updateAllAssociatedDocumentationFields = (status: Status) => {
        if (!status || !data.associatedDocumentation) return;

        setData({
            ...data,
            associatedDocumentation: {
                ...data.associatedDocumentation,
                copiesExistenceAndLocation: {
                    ...data.associatedDocumentation.copiesExistenceAndLocation,
                    status
                },
                originalsExistenceAndLocation: {
                    ...data.associatedDocumentation.originalsExistenceAndLocation,
                    status
                },
                relatedDescriptionUnits: {
                    ...data.associatedDocumentation.relatedDescriptionUnits,
                    status
                },
                relatedPublicationsInformation: {
                    ...data.associatedDocumentation.relatedPublicationsInformation,
                    status
                }
            }
        });
    };

    // If associatedDocumentation is not initialized yet, show loading or return null
    if (!data.associatedDocumentation) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="grid">
            <div className="col-12">
                <Panel
                    header="Documentación Asociada"
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
                                    <span className="font-bold">Documentación Asociada</span>
                                </div>
                                {canChangeStatus() && (
                                    <div className="flex align-items-center gap-2">
                                        <Dropdown
                                            value={associatedDocumentationStatus}
                                            options={statusOptions}
                                            onChange={(e) => setAssociatedDocumentationStatus(e.value)}
                                            placeholder="Seleccionar estado"
                                            className="p-inputtext-sm"
                                        />
                                        <Button
                                            label="Aplicar a todos"
                                            icon="pi pi-check"
                                            className="p-button-sm"
                                            onClick={() => {
                                                if (associatedDocumentationStatus) {
                                                    updateAllAssociatedDocumentationFields(associatedDocumentationStatus);
                                                    setAssociatedDocumentationStatus(null);
                                                }
                                            }}
                                            disabled={!associatedDocumentationStatus}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    }}
                >
                    <div className="grid">
                        <div className="col-12">
                            <FieldWithHistory
                                label="Existencia y Localización de Originales"
                                field={data.associatedDocumentation.originalsExistenceAndLocation}
                                type="textarea"
                                onChange={(value) => updateField('originalsExistenceAndLocation', value)}
                                onStatusChange={(status) => updateFieldStatus('originalsExistenceAndLocation', status)}
                                onCommentChange={(comment) => updateFieldComment('originalsExistenceAndLocation', comment)}
                                canEdit={canEditField(data.associatedDocumentation.originalsExistenceAndLocation.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Ingrese información sobre la existencia y localización de los originales"
                            />
                        </div>
                    </div>

                    <div className="grid">
                        <div className="col-12">
                            <FieldWithHistory
                                label="Existencia y Localización de Copias"
                                field={data.associatedDocumentation.copiesExistenceAndLocation}
                                type="textarea"
                                onChange={(value) => updateField('copiesExistenceAndLocation', value)}
                                onStatusChange={(status) => updateFieldStatus('copiesExistenceAndLocation', status)}
                                onCommentChange={(comment) => updateFieldComment('copiesExistenceAndLocation', comment)}
                                canEdit={canEditField(data.associatedDocumentation.copiesExistenceAndLocation.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Ingrese información sobre la existencia y localización de copias"
                            />
                        </div>
                    </div>

                    <div className="grid">
                        <div className="col-12">
                            <FieldWithHistory
                                label="Unidades de Descripción Relacionadas"
                                field={data.associatedDocumentation.relatedDescriptionUnits}
                                type="textarea"
                                onChange={(value) => updateField('relatedDescriptionUnits', value)}
                                onStatusChange={(status) => updateFieldStatus('relatedDescriptionUnits', status)}
                                onCommentChange={(comment) => updateFieldComment('relatedDescriptionUnits', comment)}
                                canEdit={canEditField(data.associatedDocumentation.relatedDescriptionUnits.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Ingrese información sobre unidades de descripción relacionadas"
                            />
                        </div>
                    </div>

                    <div className="grid">
                        <div className="col-12">
                            <FieldWithHistory
                                label="Información sobre Publicaciones Relacionadas"
                                field={data.associatedDocumentation.relatedPublicationsInformation}
                                type="textarea"
                                onChange={(value) => updateField('relatedPublicationsInformation', value)}
                                onStatusChange={(status) => updateFieldStatus('relatedPublicationsInformation', status)}
                                onCommentChange={(comment) => updateFieldComment('relatedPublicationsInformation', comment)}
                                canEdit={canEditField(data.associatedDocumentation.relatedPublicationsInformation.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Ingrese información sobre publicaciones relacionadas con el objeto"
                            />
                        </div>
                    </div>
                </Panel>
            </div>
        </div>
    );
};
