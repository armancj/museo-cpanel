'use client';
import { useEffect, useState, useRef } from 'react';
import { FieldWithHistory } from './FieldWithHistory';
import { CulturalHeritageProperty, Status } from '../types';
import { Panel } from 'primereact/panel';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { getUpdatedStatus } from '../utils/statusUtils';

interface NotesFormProps {
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

export const NotesForm = ({
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
}: NotesFormProps) => {
    const [isFormValid, setIsFormValid] = useState(false);
    // Ref to track if we've already updated the form validity
    const formValidityUpdatedRef = useRef(false);

    // State for selected status for the panel
    const [notesStatus, setNotesStatus] = useState<Status | null>(null);

    // Status options for dropdown
    const statusOptions = [
        { label: 'Pendiente', value: Status.Pending },
        { label: 'Para Revisar', value: Status.ToReview },
        { label: 'Revisado', value: Status.Reviewed },
        { label: 'Con Problemas', value: Status.HasIssue }
    ];

    // Initialize notes if it doesn't exist
    useEffect(() => {
        if (!data.notes) {
            setData({
                ...data,
                notes: {
                    notes: { value: '', modifiedBy: '', comment: '', status: Status.Pending, history: [] }
                }
            });
        }
    }, [data, setData]);

    // Check if the form is valid
    useEffect(() => {
        if (!data.notes) {
            setIsFormValid(false);
            markStepCompleted(currentStep, false);
            return;
        }

        // For this step, we'll consider it valid even if the notes field is empty
        // This allows the user to complete the wizard without adding notes
        const isValid = true;

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
        data.notes,
        currentStep,
        isFormValid,
        markStepCompleted
    ]);

    // Update the notes field
    const updateField = (value: any) => {
        if (!data.notes) return;

        // Get the current status
        const currentStatus = data.notes.notes.status;

        // Automatically update status based on whether the field is filled
        const newStatus = getUpdatedStatus(value, currentStatus);

        setData({
            ...data,
            notes: {
                ...data.notes,
                notes: {
                    ...data.notes.notes,
                    value,
                    status: newStatus
                }
            }
        });
    };

    // Update the notes field's status
    const updateFieldStatus = (status: Status) => {
        if (!data.notes) return;

        setData({
            ...data,
            notes: {
                ...data.notes,
                notes: {
                    ...data.notes.notes,
                    status
                }
            }
        });
    };

    // Update the notes field's comment
    const updateFieldComment = (comment: string) => {
        if (!data.notes) return;

        setData({
            ...data,
            notes: {
                ...data.notes,
                notes: {
                    ...data.notes.notes,
                    comment
                }
            }
        });
    };

    // Update all fields in the notes panel
    const updateAllNotesFields = (status: Status) => {
        if (!status || !data.notes) return;

        setData({
            ...data,
            notes: {
                ...data.notes,
                notes: {
                    ...data.notes.notes,
                    status
                }
            }
        });
    };

    // If notes is not initialized yet, show loading or return null
    if (!data.notes) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="grid">
            <div className="col-12">
                <Panel
                    header="Notas Adicionales"
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
                                    <span className="font-bold">Notas Adicionales</span>
                                </div>
                                {canChangeStatus() && (
                                    <div className="flex align-items-center gap-2">
                                        <Dropdown
                                            value={notesStatus}
                                            options={statusOptions}
                                            onChange={(e) => setNotesStatus(e.value)}
                                            placeholder="Seleccionar estado"
                                            className="p-inputtext-sm"
                                        />
                                        <Button
                                            label="Aplicar a todos"
                                            icon="pi pi-check"
                                            className="p-button-sm"
                                            onClick={() => {
                                                if (notesStatus) {
                                                    updateAllNotesFields(notesStatus);
                                                    setNotesStatus(null);
                                                }
                                            }}
                                            disabled={!notesStatus}
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
                                label="Notas"
                                field={data.notes.notes}
                                type="textarea"
                                onChange={(value) => updateField(value)}
                                onStatusChange={(status) => updateFieldStatus(status)}
                                onCommentChange={(comment) => updateFieldComment(comment)}
                                canEdit={canEditField(data.notes.notes.status)}
                                canViewHistory={canViewHistory()}
                                canChangeStatus={canChangeStatus()}
                                openHistoryDialog={openHistoryDialog}
                                placeholder="Ingrese notas adicionales sobre el bien patrimonial cultural"
                            />
                        </div>
                    </div>
                </Panel>
            </div>

            <div className="col-12 mt-4">
                <Panel header="Resumen" toggleable>
                    <div className="grid">
                        <div className="col-12">
                            <p className="text-lg">
                                Ha completado todos los pasos para registrar el bien patrimonial cultural.
                                Revise la información ingresada en cada sección antes de guardar.
                            </p>
                            <p>
                                Una vez guardado, el registro estará disponible para su revisión por parte de los administradores y especialistas.
                            </p>
                            <p className="text-primary font-bold">
                                Haga clic en el botón &quot;Guardar&quot; para finalizar el proceso.
                            </p>
                        </div>
                    </div>
                </Panel>
            </div>
        </div>
    );
};
