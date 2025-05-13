import { CulturalPropertyModel } from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';
import ProducerAuthorStep from '@/app/(main)/pages/cultural-property-heritage/form-componenet/ProducerAuthorStep';
import { NavigationButtons } from '@/app/(main)/pages/cultural-property-heritage/form-componenet/NavigationButtons';
import AccessConditionsStep from '@/app/(main)/pages/cultural-property-heritage/form-componenet/AccessConditionsStep';
import DocumentationStep from '@/app/(main)/pages/cultural-property-heritage/form-componenet/DocumentationStep';
import CulturalRecordStep from '@/app/(main)/pages/cultural-property-heritage/form-componenet/CulturalRecordStep';
import EntryStep from '@/app/(main)/pages/cultural-property-heritage/form-componenet/EntryStep';
import DescriptionControlStep
    from '@/app/(main)/pages/cultural-property-heritage/form-componenet/DescriptionControlStep';
import NotesStep from '@/app/(main)/pages/cultural-property-heritage/form-componenet/NotesStep';
import React from 'react';

type props = {
    activeIndex: number,
    formData: CulturalPropertyModel,
    handleChange: (section: keyof CulturalPropertyModel, field: string, value: any) => void,
    formErrors: Record<string, any>,
    validateProducerAuthor: () => boolean,
    submitted: boolean,
    goToNextStep: () => void,
    goToPreviousStep: () => void,
    finalizeForm: () => void,
    hideDialog: () => void,
}

export function renderFormStep({
                                   formData,
                                   goToNextStep,
                                   goToPreviousStep,
                                   finalizeForm,
                                   formErrors,
                                   validateProducerAuthor,
                                   submitted,
                                   hideDialog,
                                   handleChange,
                                   activeIndex,
                               }: props) {
    const FormStepComponent = () => {
        switch (activeIndex) {
            case 0:
                return (
                    <>
                        <ProducerAuthorStep
                            data={formData.producerAuthor}
                            onChange={(field, value) =>
                                handleChange('producerAuthor', field, value)
                            }
                            errors={formErrors.producerAuthor}
                            onValidate={validateProducerAuthor}
                            submitted={submitted}
                        />
                        <NavigationButtons
                            goToNextStep={() => goToNextStep()}
                            showFinalize={false}
                            showPrevious={false}
                        />
                    </>
                );

            case 1:
                return (
                    <>
                        <AccessConditionsStep
                            data={formData.accessAndUseConditions}
                            onChange={(field, value) =>
                                handleChange('accessAndUseConditions', field, value)
                            }
                        />
                        <NavigationButtons
                            goToPreviousStep={() => goToPreviousStep()}
                            goToNextStep={() => goToNextStep()}
                            showFinalize={false}
                        />
                    </>
                );

            case 2:
                return (
                    <>
                        <DocumentationStep
                            data={formData.associatedDocumentation}
                            onChange={(field, value) =>
                                handleChange('associatedDocumentation', field, value)
                            }
                        />
                        <NavigationButtons
                            goToPreviousStep={() => goToPreviousStep()}
                            goToNextStep={() => goToNextStep()}
                            showFinalize={false}
                        />
                    </>
                );

            case 3:
                return (
                    <>
                        <CulturalRecordStep
                            data={formData.culturalRecord}
                            onChange={(field, value) =>
                                handleChange('culturalRecord', field, value)
                            }
                        />
                        <NavigationButtons
                            goToPreviousStep={() => goToPreviousStep()}
                            goToNextStep={() => goToNextStep()}
                            showFinalize={false}
                        />
                    </>
                );

            case 4:
                return (
                    <>
                        <EntryStep
                            data={formData.entryAndLocation}
                            onChange={(field, value) =>
                                handleChange('entryAndLocation', field, value)
                            }
                        />
                        <NavigationButtons
                            goToPreviousStep={() => goToPreviousStep()}
                            goToNextStep={() => goToNextStep()}
                            showFinalize={false}
                        />
                    </>
                );

            case 5:
                return (
                    <>
                        <DescriptionControlStep
                            data={formData.descriptionControl}
                            onChange={(field, value) =>
                                handleChange('descriptionControl', field, value)
                            }
                        />
                        <NavigationButtons
                            goToPreviousStep={() => goToPreviousStep()}
                            goToNextStep={() => goToNextStep()}
                            showFinalize={false}
                        />
                    </>
                );

            case 6:
                return (
                    <>
                        <NotesStep
                            data={formData.notes}
                            onChange={(field, value) => handleChange('notes', field, value)}
                        />
                        <NavigationButtons
                            goToPreviousStep={() => goToPreviousStep()}
                            finalizeForm={() => finalizeForm()}
                            showNext={false}
                            onHide={hideDialog}
                        />
                    </>
                );

            default:
                return null;
        }
    };

    FormStepComponent.displayName = `FormStep_${activeIndex}`;
    return FormStepComponent;
}
