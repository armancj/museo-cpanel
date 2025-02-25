import React, { useState } from 'react';
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
import { TabMenu } from 'primereact/tabmenu';

const CulturalPropertyForm: React.FC = () => {

    const [formData, setFormData] = useState<CulturalPropertyModel>(emptyCulturalProperty);

    const [activeIndex, setActiveIndex] = useState(0);


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


    const wizardItems = [
        { label: 'Productor / Autor', icon: 'pi pi-user' },
        { label: 'Condiciones de Acceso', icon: 'pi pi-lock' },
        { label: 'Documentación Asociada', icon: 'pi pi-file' },
        { label: 'Registro Cultural', icon: 'pi pi-book' },
        { label: 'Ubicación y Entrada', icon: 'pi pi-map-marker' },
        { label: 'Control de Descripción', icon: 'pi pi-cog' },
        { label: 'Notas', icon: 'pi pi-pencil' }
    ];


    const renderContent = () => {
        switch (activeIndex) {
            case 0:
                return (
                    <>
                        <ProducerAuthorStep
                            data={formData.producerAuthor}
                            onChange={(field, value) =>
                                handleChange('producerAuthor', field, value)
                            }
                        />
                        <div className="flex justify-content-end pt-4">
                            <Button
                                label="Siguiente"
                                icon="pi pi-arrow-right"
                                iconPos="right"
                                onClick={() => setActiveIndex((prev) => prev + 1)}
                            />
                        </div>
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
                        <div className="flex justify-content-between pt-4">
                            <Button
                                label="Atrás"
                                icon="pi pi-arrow-left"
                                onClick={() => setActiveIndex((prev) => prev - 1)}
                            />
                            <Button
                                label="Siguiente"
                                icon="pi pi-arrow-right"
                                iconPos="right"
                                onClick={() => setActiveIndex((prev) => prev + 1)}
                            />
                        </div>
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
                        <div className="flex justify-content-between pt-4">
                            <Button
                                label="Atrás"
                                icon="pi pi-arrow-left"
                                onClick={() => setActiveIndex((prev) => prev - 1)}
                            />
                            <Button
                                label="Siguiente"
                                icon="pi pi-arrow-right"
                                iconPos="right"
                                onClick={() => setActiveIndex((prev) => prev + 1)}
                            />
                        </div>
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
                        <div className="flex justify-content-between pt-4">
                            <Button
                                label="Atrás"
                                icon="pi pi-arrow-left"
                                onClick={() => setActiveIndex((prev) => prev - 1)}
                            />
                            <Button
                                label="Siguiente"
                                icon="pi pi-arrow-right"
                                iconPos="right"
                                onClick={() => setActiveIndex((prev) => prev + 1)}
                            />
                        </div>
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
                        <div className="flex justify-content-between pt-4">
                            <Button
                                label="Atrás"
                                icon="pi pi-arrow-left"
                                onClick={() => setActiveIndex((prev) => prev - 1)}
                            />
                            <Button
                                label="Siguiente"
                                icon="pi pi-arrow-right"
                                iconPos="right"
                                onClick={() => setActiveIndex((prev) => prev + 1)}
                            />
                        </div>
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
                        <div className="flex justify-content-between pt-4">
                            <Button
                                label="Atrás"
                                icon="pi pi-arrow-left"
                                onClick={() => setActiveIndex((prev) => prev - 1)}
                            />
                            <Button
                                label="Siguiente"
                                icon="pi pi-arrow-right"
                                iconPos="right"
                                onClick={() => setActiveIndex((prev) => prev + 1)}
                            />
                        </div>
                    </>
                );

            case 6:
                return (
                    <>
                        <NotesStep
                            data={formData.notes}
                            onChange={(field, value) => handleChange('notes', field, value)}
                        />
                        <div className="flex justify-content-between pt-4">
                            <Button
                                label="Atrás"
                                icon="pi pi-arrow-left"
                                onClick={() => setActiveIndex((prev) => prev - 1)}
                            />
                            <Button label="Finalizar" icon="pi pi-check" />
                        </div>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <>
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
