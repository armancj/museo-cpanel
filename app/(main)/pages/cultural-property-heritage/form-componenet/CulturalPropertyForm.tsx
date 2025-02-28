import React, { useRef, useState } from 'react';
import { Button } from 'primereact/button';
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
import { MenuItem } from 'primereact/menuitem';
import { Toast } from 'primereact/toast';


interface CulturalPropertyFormProps {
    hideDialog: () => void;
}

const CulturalPropertyForm = ({ hideDialog }: CulturalPropertyFormProps) => {

    const [formData, setFormData] = useState<CulturalPropertyModel>(emptyCulturalProperty);

    const [activeIndex, setActiveIndex] = useState(0);
    const toast = useRef<Toast>(null);


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


    const wizardItems: MenuItem[] = [
        {
            label: 'Productor / Autor', icon: 'pi pi-user', command: (event) => {
                toast.current?.show({ severity: 'info', summary: 'Primer paso', detail: event.item.label });
            },
        },
        {
            label: 'Condiciones de Acceso', icon: 'pi pi-lock', command: (event) => {
                toast.current?.show({ severity: 'info', summary: 'Segundo paso', detail: event.item.label });
            },
        },
        {
            label: 'Documentación Asociada', icon: 'pi pi-file', command: (event) => {
                toast.current?.show({ severity: 'info', summary: 'Tercer paso', detail: event.item.label });
            },
        },
        {
            label: 'Registro Cultural', icon: 'pi pi-book', command: (event) => {
                toast.current?.show({ severity: 'info', summary: 'Cuarto paso', detail: event.item.label });
            },
        },
        {
            label: 'Ubicación y Entrada', icon: 'pi pi-map-marker', command: (event) => {
                toast.current?.show({ severity: 'info', summary: 'Quinto paso', detail: event.item.label });
            },
        },
        {
            label: 'Control de Descripción', icon: 'pi pi-cog', command: (event) => {
                toast.current?.show({ severity: 'info', summary: 'Sexto paso', detail: event.item.label });
            },
        },
        {
            label: 'Notas', icon: 'pi pi-pencil', command: (event) => {
                toast.current?.show({ severity: 'info', summary: 'Septimo paso', detail: event.item.label });
            },
        },
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
                            <Button label="Finalizar" icon="pi pi-check"
                                    onClick={hideDialog} />
                        </div>
                    </>
                );

            default:
                return null;
        }
    };

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
