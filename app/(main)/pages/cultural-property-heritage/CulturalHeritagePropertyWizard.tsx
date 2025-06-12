'use client';
import { useState, useRef, useEffect } from 'react';
import { Steps } from 'primereact/steps';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { MenuItem } from 'primereact/menuitem';
import { Dialog } from 'primereact/dialog';
import { useHookCulturalHeritageProperty } from './useHookCulturalHeritageProperty';
import { CulturalHeritageProperty, Status, UserRoles } from './types';
import { CulturalRecordForm } from './component/CulturalRecordForm';
import { ProducerAuthorForm } from './component/ProducerAuthorForm';
import { EntryAndLocationForm } from './component/EntryAndLocationForm';
import { AccessAndUseConditionsForm } from './component/AccessAndUseConditionsForm';
import { AssociatedDocumentationForm } from './component/AssociatedDocumentationForm';
import { DescriptionControlForm } from './component/DescriptionControlForm';
import { NotesForm } from './component/NotesForm';
import { HistoryDialog } from './component/HistoryDialog';


interface CulturalHeritagePropertyWizardProps {
    onBackToList?: () => void;
    hookData?: ReturnType<typeof useHookCulturalHeritageProperty>;
}

export const CulturalHeritagePropertyWizard = ({
                                                   onBackToList,
                                                   hookData
                                               }: CulturalHeritagePropertyWizardProps) => {
    // Get the current user role - in a real app, this would come from authentication
    // For this example, we'll use a state that can be changed for testing
    const [currentUserRole, setCurrentUserRole] = useState<UserRoles>(UserRoles.employee);

    // State for the wizard
    const [activeIndex, setActiveIndex] = useState(0);
    const [isCompleted, setIsCompleted] = useState<boolean[]>([false, false, false, false, false, false, false]);
    const [allStepsCompleted, setAllStepsCompleted] = useState(false);
    const [historyDialogVisible, setHistoryDialogVisible] = useState(false);
    const [historyField, setHistoryField] = useState<any>(null);
    const [historyTitle, setHistoryTitle] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);

    // Ref to track if we've already set completed steps for this item
    const completedStepsSetRef = useRef<boolean>(false);

    // Get the hook for CRUD operations
    const {
        data,
        setData,
        save,
        submitted,
        toast,
        // eslint-disable-next-line react-hooks/rules-of-hooks
    } = hookData || useHookCulturalHeritageProperty();


    // Define the steps for the wizard
    const wizardItems: MenuItem[] = [
        { label: 'Registro Cultural', command: () => canNavigate(0) && setActiveIndex(0) },
        { label: 'Productor/Autor', command: () => canNavigate(1) && setActiveIndex(1) },
        { label: 'Entrada y Ubicación', command: () => canNavigate(2) && setActiveIndex(2) },
        { label: 'Condiciones de Acceso y Uso', command: () => canNavigate(3) && setActiveIndex(3) },
        { label: 'Documentación Asociada', command: () => canNavigate(4) && setActiveIndex(4) },
        { label: 'Control de Descripción', command: () => canNavigate(5) && setActiveIndex(5) },
        { label: 'Notas', command: () => canNavigate(6) && setActiveIndex(6) },
    ];

    // Check if all steps are completed
    useEffect(() => {
        const allCompleted = isCompleted.every(step => step);
        setAllStepsCompleted(allCompleted);
    }, [isCompleted]);

    // Detect if we're editing an existing item
    useEffect(() => {
        if (data && data.uuid) {
            setIsEditMode(true);
            // If it's an existing item, we can allow navigation between steps
            // Only update isCompleted if needed to avoid infinite loops
            if (!completedStepsSetRef.current) {
                const hasIncompleteSteps = isCompleted.some(step => step === false);
                if (hasIncompleteSteps) {
                    const newCompleted = isCompleted.map(() => true);
                    setIsCompleted(newCompleted);
                    completedStepsSetRef.current = true;
                }
            }
        } else {
            setIsEditMode(false);
            completedStepsSetRef.current = false;
        }
    }, [data.uuid]); // Only depend on data.uuid to avoid infinite loops

    // Function to check if navigation to a step is allowed
    const canNavigate = (index: number) => {
        // If all steps are completed, allow free navigation
        if (allStepsCompleted) return true;

        // If trying to go forward, check if previous steps are completed
        if (index > activeIndex) {
            for (let i = 0; i < index; i++) {
                if (!isCompleted[i]) {
                    toast.current?.show({
                        severity: 'warn',
                        summary: 'Advertencia',
                        detail: 'Debe completar los pasos anteriores antes de avanzar',
                        life: 3000
                    });
                    return false;
                }
            }
        }

        return true;
    };

    // Function to handle next step
    const nextStep = () => {
        if (activeIndex < wizardItems.length - 1) {
            setActiveIndex(activeIndex + 1);
        }
    };

    // Function to handle previous step
    const prevStep = () => {
        if (activeIndex > 0) {
            setActiveIndex(activeIndex - 1);
        }
    };

    // Function to mark current step as completed
    const markStepCompleted = (index: number, completed: boolean) => {
        const newCompleted = [...isCompleted];
        newCompleted[index] = completed;
        setIsCompleted(newCompleted);
    };

    // Function to recursively update the status of all fields to ToReview
    const updateFieldsToReview = (obj: any) => {
        if (!obj) return;

        // If the object has a status property, update it to ToReview
        if (obj.status === Status.Pending) {
            obj.status = Status.ToReview;
        }

        // Recursively process all object properties
        Object.keys(obj).forEach(key => {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                updateFieldsToReview(obj[key]);
            }
        });
    };

    // Function to save the form
    const saveForm = async () => {
        // If the user is a technical user and it's not in edit mode, update all fields to ToReview
        if (currentUserRole === UserRoles.employee && !isEditMode) {
            const updatedData = { ...data };
            updateFieldsToReview(updatedData);
            setData(updatedData);
        }

        // Pass "cultural-property" as the product parameter to bypass validation in useGenericHook
        await save("cultural-property");
        // Navigate back to list after saving if onBackToList is provided
        if (onBackToList) {
            // Short delay to allow the toast to be seen
            setTimeout(() => {
                onBackToList();
            }, 1500);
        }
    };

    // Function to check if a field can be edited based on role and status
    const canEditField = (status: Status) => {
        if (currentUserRole === UserRoles.employee) {
            // Technical users can edit fields that are in Pending, HasIssue, or ToReview status
            return status === Status.HasIssue || status === Status.Pending || status === Status.ToReview;
        }
        return true; // Admin, superAdmin, and manager can edit any field
    };

    // Function to check if user can view history
    const canViewHistory = () => {
        // All users can view history
        return true;
    };

    // Function to check if user can change status
    const canChangeStatus = () => {
        return currentUserRole === UserRoles.administrator ||
               currentUserRole === UserRoles.superAdmin ||
               currentUserRole === UserRoles.manager;
    };

    // Function to open history dialog
    const openHistoryDialog = (field: any, title: string) => {
        console.log('🚨 WIZARD - Opening history dialog');
        console.log('🚨 WIZARD - Field received:', field);
        console.log('🚨 WIZARD - Field keys:', field ? Object.keys(field) : 'null');
        console.log('🚨 WIZARD - History exists?', !!field?.history);
        console.log('🚨 WIZARD - History length:', field?.history?.length);
        console.log('🚨 WIZARD - Full history array:', field?.history);
        console.log('🚨 WIZARD - Title:', title);

        setHistoryField(field);
        setHistoryTitle(title);
        setHistoryDialogVisible(true);
    };

    // Render the current step content
    const renderStepContent = () => {
        const commonProps = {
            data,
            setData,
            canEditField,
            canViewHistory,
            canChangeStatus,
            openHistoryDialog,
            isEditMode,
            markStepCompleted,
            currentStep: activeIndex,
            submitted
        };

        switch (activeIndex) {
            case 0:
                return <CulturalRecordForm {...commonProps} />;
            case 1:
                return <ProducerAuthorForm {...commonProps} />;
            case 2:
                return <EntryAndLocationForm {...commonProps} />;
            case 3:
                return <AccessAndUseConditionsForm {...commonProps} />;
            case 4:
                return <AssociatedDocumentationForm {...commonProps} />;
            case 5:
                return <DescriptionControlForm {...commonProps} />;
            case 6:
                return <NotesForm {...commonProps} />;
            default:
                return <div>Paso no encontrado</div>;
        }
    };

    // Role selector for testing purposes
    const roleSelector = (

        <div className="flex justify-content-end mb-3">
            <label>Rol de Usuario (Para pruebas)</label>
            <span className="p-float-label">
                <select
                    value={currentUserRole}
                    onChange={(e) => setCurrentUserRole(e.target.value as UserRoles)}
                    className="p-inputtext p-component"
                >
                    <option value={UserRoles.employee}>{UserRoles.employee}</option>
                    <option value={UserRoles.administrator}>{UserRoles.administrator}</option>
                    <option value={UserRoles.superAdmin}>{UserRoles.superAdmin}</option>
                    <option value={UserRoles.manager}>{UserRoles.manager}</option>
                </select>
            </span>
        </div>
    );

    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <Card title="Bien Patrimonial Cultural" subTitle={isEditMode ? "Editar registro" : "Nuevo registro"}>
                    {roleSelector}

                    <div className="mb-5">
                        <Steps model={wizardItems} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={!allStepsCompleted} />
                    </div>

                    <div className="p-fluid">
                        {renderStepContent()}
                    </div>

                    <div className="flex justify-content-between mt-4">
                        <Button
                            label="Anterior"
                            icon="pi pi-arrow-left"
                            onClick={prevStep}
                            disabled={activeIndex === 0}
                            className="p-button-secondary"
                        />

                        {activeIndex < wizardItems.length - 1 ? (
                            <Button
                                label="Siguiente"
                                icon="pi pi-arrow-right"
                                iconPos="right"
                                onClick={nextStep}
                                disabled={!isCompleted[activeIndex]}
                            />
                        ) : (
                            <Button
                                label={isEditMode ? "Guardar Cambios" : "Guardar"}
                                icon="pi pi-save"
                                onClick={saveForm}
                                disabled={!allStepsCompleted}
                            />
                        )}
                    </div>
                </Card>
            </div>

            <HistoryDialog
                visible={historyDialogVisible}
                onHide={() => setHistoryDialogVisible(false)}
                field={historyField}
                title={historyTitle}
            />
        </div>
    );
};
