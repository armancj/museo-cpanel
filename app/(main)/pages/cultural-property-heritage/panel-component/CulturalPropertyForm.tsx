import React, { useRef, useState } from 'react';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from "primereact/button";
import {
    CulturalPropertyModel,
} from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';
import { emptyCulturalProperty } from '@/app/service/utilities/culturalproperty.data';
import ProducerAuthorStep from '@/app/(main)/pages/cultural-property-heritage/form-componenet/ProducerAuthorStep';
import AccessConditionsStep from '@/app/(main)/pages/cultural-property-heritage/form-componenet/AccessConditionsStep';
import DocumentationStep from '@/app/(main)/pages/cultural-property-heritage/form-componenet/DocumentationStep';
import CulturalRecordStep from '@/app/(main)/pages/cultural-property-heritage/form-componenet/CulturalRecordStep';
import EntryStep from '@/app/(main)/pages/cultural-property-heritage/form-componenet/EntryStep';
import DescriptionControlStep
    from '@/app/(main)/pages/cultural-property-heritage/form-componenet/DescriptionControlStep';
import NotesStep from '@/app/(main)/pages/cultural-property-heritage/form-componenet/NotesStep';



const CulturalPropertyForm: React.FC = () => {
    const stepperRef = useRef<any>(null);

    const [formData, setFormData] = useState<CulturalPropertyModel>(emptyCulturalProperty);

    const nextStep = () => stepperRef.current.nextCallback();
    const prevStep = () => stepperRef.current.prevCallback();

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
    };



    return (
        <>
            <h2 className="text-center">Formulario de Propiedad Cultural</h2>
        <div className="card flex justify-content-center" >
                <Stepper ref={stepperRef} activeStep={1}>
                <StepperPanel header="Productor / Autor" >
                    <div className="flex flex-column h-12rem">
                    <ProducerAuthorStep data={formData.producerAuthor} onChange={(field, value) =>
                        handleChange('producerAuthor', field, value)
                    }
                    />
                    </div>
                    <div className="flex pt-4 justify-content-end align-items-end col-2 ">
                        <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" onClick={nextStep} />
                    </div>
                </StepperPanel>
                <StepperPanel header="Condiciones de Acceso y Uso">
                    <AccessConditionsStep data={formData.accessAndUseConditions} onChange={(field, value) =>
                        handleChange('accessAndUseConditions', field, value)
                    }
                    />
                    <div className="flex justify-content-between">
                        <Button label="Atrás" icon="pi pi-arrow-left" onClick={prevStep} />
                        <Button label="Siguiente" icon="pi pi-arrow-right" onClick={nextStep} />
                    </div>
                </StepperPanel>
                <StepperPanel header="Documentación Asociada">
                    <DocumentationStep
                        data={formData.associatedDocumentation}
                        onChange={(field, value) =>
                            handleChange('associatedDocumentation', field, value)
                        }
                    />
                    <div className="flex justify-content-between">
                        <Button label="Atrás" icon="pi pi-arrow-left" onClick={prevStep} />
                        <Button label="Siguiente" icon="pi pi-arrow-right" onClick={nextStep} />
                    </div>
                </StepperPanel>
                <StepperPanel header="Registro Cultural">
                    <CulturalRecordStep
                        data={formData.culturalRecord}
                        onChange={(field, value) =>
                            handleChange('culturalRecord', field, value)
                        }
                    />
                    <div className="flex justify-content-between">
                        <Button label="Atrás" icon="pi pi-arrow-left" onClick={prevStep} />
                        <Button label="Siguiente" icon="pi pi-arrow-right" onClick={nextStep} />
                    </div>
                </StepperPanel>
                <StepperPanel header="Ubicación y Entrada">
                    <EntryStep
                        data={formData.entryAndLocation}
                        onChange={(field, value) => handleChange('entryAndLocation', field, value)}
                    />
                    <div className="flex justify-content-between">
                        <Button label="Atrás" icon="pi pi-arrow-left" onClick={prevStep} />
                        <Button label="Siguiente" icon="pi pi-arrow-right" onClick={nextStep} />
                    </div>
                </StepperPanel>
                <StepperPanel header="Control de Descripción">
                    <DescriptionControlStep
                        data={formData.descriptionControl}
                        onChange={(field, value) =>
                            handleChange('descriptionControl', field, value)
                        }
                    />
                    <div className="flex justify-content-between">
                        <Button label="Atrás" icon="pi pi-arrow-left" onClick={prevStep} />
                        <Button label="Siguiente" />
                    </div>
                </StepperPanel>
                <StepperPanel header="Notas">
                    <NotesStep
                        data={formData.notes}
                        onChange={(field, value) =>
                            handleChange('notes', field, value)
                        }
                    />
                    <div className="flex justify-content-between">
                        <Button label="Atrás" icon="pi pi-arrow-left" onClick={prevStep} />
                        <Button label="Finalizar" />
                    </div>
                </StepperPanel>
            </Stepper>
        </div>
        </>
    );
};

export default CulturalPropertyForm;
