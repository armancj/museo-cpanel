import React, { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import {
    CulturalPropertyModel,
} from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';
import { emptyCulturalProperty } from '@/app/service/utilities/culturalproperty.data';
import { TabMenu } from 'primereact/tabmenu';
import { Toast } from 'primereact/toast';
import { generateWizardMenuItems } from '@/app/(main)/pages/cultural-property-heritage/util/generateWizardMenuItems';
import { renderFormStep } from '@/app/(main)/pages/cultural-property-heritage/form-componenet/renderFormStep';
import {
    validateProducerAuthorData
} from '@/app/(main)/pages/cultural-property-heritage/util/validateProducerAuthorData';


interface CulturalPropertyFormProps {
    hideDialog: () => void;
}

const CulturalPropertyForm = ({ hideDialog }: CulturalPropertyFormProps) => {

    const [formData, setFormData] = useState<CulturalPropertyModel>(emptyCulturalProperty);
    const [completedSteps, setCompletedSteps] = useState<boolean[]>([true, false, false, false, false, false, false]);


    const [activeIndex, setActiveIndex] = useState(0);
    const toast = useRef<Toast>(null);

    const [formErrors, setFormErrors] = useState<Record<string, any>>({
        producerAuthor: {},
        accessAndUseConditions: {},
        associatedDocumentation: {},
        culturalRecord: {},
        entryAndLocation: {},
        descriptionControl: {},
        notes: {}
    });

    const [submitted, setSubmitted] = useState<boolean>(false);



    const handleChange = (section: keyof CulturalPropertyModel, field: string, value: any) => {
        setFormData((prevData) => {
            const updatedSection = {
                ...(prevData[section] as Record<string, any>),
                [field]: value,
            };

            return {
                ...prevData,
                [section]: updatedSection,
            };
        });
        if (formErrors[section]?.[field]) {
            setFormErrors(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: undefined
                }
            }));
        }
    };

    const validateProducerAuthor = validateProducerAuthorData(formData, setFormErrors);

    // Validaciones para las demás secciones (implementar según necesidad)
    const validateAccessConditions = () => {
        // Implementar validaciones
        return true;
    };

    const validateAssociatedDocumentation = () => {
        // Implementar validaciones
        return true;
    };

    const validateCulturalRecord = () => {
        // Implementar validaciones
        return true;
    };

    const validateEntryLocation = () => {
        // Implementar validaciones
        return true;
    };

    const validateDescriptionControl = () => {
        // Implementar validaciones
        return true;
    };

    const validateNotes = () => {
        // Implementar validaciones
        return true;
    };

    const validateCurrentStep = () => {
        setSubmitted(true);

        switch (activeIndex) {
            case 0:
                return validateProducerAuthor();
            case 1:
                return validateAccessConditions();
            case 2:
                return validateAssociatedDocumentation();
            case 3:
                return validateCulturalRecord();
            case 4:
                return validateEntryLocation();
            case 5:
                return validateDescriptionControl();
            case 6:
                return validateNotes();
            default:
                return false;
        }
    };

    const goToNextStep = () => {
        if (validateCurrentStep()) {
            const newCompletedSteps = [...completedSteps];
            if (activeIndex + 1 < newCompletedSteps.length) {
                newCompletedSteps[activeIndex + 1] = true;
                setCompletedSteps(newCompletedSteps);
            }

            setActiveIndex(prev => prev + 1);
            setSubmitted(false);
        } else {
            toast.current?.show({
                severity: 'warn',
                summary: 'Campos incompletos',
                detail: 'Por favor, complete todos los campos obligatorios antes de continuar',
                life: 3000
            });
        }
    };

    const goToPreviousStep = () => {
        setActiveIndex(prev => prev - 1);
        setSubmitted(false);
    };

    const finalizeForm = () => {
        if (validateCurrentStep()) {
            toast.current?.show({
                severity: 'success',
                summary: 'Formulario completado',
                detail: 'Los datos se han guardado correctamente',
                life: 3000
            });
            hideDialog();
        } else {
            toast.current?.show({
                severity: 'warn',
                summary: 'Campos incompletos',
                detail: 'Por favor, complete todos los campos obligatorios antes de finalizar',
                life: 3000
            });
        }
    };


    const wizardItems = generateWizardMenuItems(completedSteps);

    const renderContent = renderFormStep(activeIndex, formData, handleChange, formErrors, validateProducerAuthor, submitted, goToNextStep, goToPreviousStep, finalizeForm);

    return (
        <>
            <div className="flex flex-wrap justify-content-end gap-2 mb-3">
                <Button outlined rounded onClick={hideDialog}
                        className="w-2rem h-2rem p-0" icon={'pi pi-times'} severity={'danger'} />
            </div>
            <Toast ref={toast} />
            <h2 className="text-center">Formulario de Propiedad Cultural</h2>
            <div className="card">
                <TabMenu
                    model={wizardItems}
                    activeIndex={activeIndex}
                    onTabChange={(e) => setActiveIndex(e.index)}

                />
                <div className="pt-4">{renderContent()}</div>
            </div>
        </>
    );
};

export default CulturalPropertyForm;
