import { InstitutionResponse } from '@/app/service/InstitutionService';
import React, { useEffect } from 'react';
import { TypologyService } from '@/app/service/TypologyService';
import { CategoryMuseumService } from '@/app/service/CategoryMuseumService';
import { DropdownChangeEvent } from 'primereact/dropdown';

export function useInstitutionClassificationDataHandlers(setLoadingTypologies: (value: (((prevState: boolean) => boolean) | boolean)) => void, setTypologies: (value: (((prevState: {
    name: string;
    code: string
}[]) => { name: string; code: string }[]) | {
    name: string;
    code: string
}[])) => void, data: InstitutionResponse, institutionTypes: ({
    name: string;
    code: string
})[], setSelectedInstitutionType: (value: any) => void, typologies: {
    name: string;
    code: string
}[], selectedTypology: any, setSelectedTypology: (value: any) => void, classifications: ({
    name: string;
    code: string
})[], selectedClassification: any, setSelectedClassification: (value: any) => void, selectedInstitutionType: any, setLoadingCategories: (value: (((prevState: boolean) => boolean) | boolean)) => void, setCategories: (value: (((prevState: {
    name: string;
    code: string
}[]) => { name: string; code: string }[]) | {
    name: string;
    code: string
}[])) => void, setSelectedCategory: (value: (((prevState: ({ name: string; code: string }[] | null | undefined)) => ({
    name: string;
    code: string
}[] | null | undefined)) | {
    name: string;
    code: string
}[] | null | undefined)) => void, onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void, loadingCategories: boolean) {
    useEffect(() => {
        const fetchTypologies = async () => {
            setLoadingTypologies(true);
            try {
                const response = await TypologyService.getTypologies();
                const formattedTypologies = response.map(typology => ({
                    name: typology.name,
                    code: typology.uuid,
                    description: typology.description,
                }));
                setTypologies(formattedTypologies);
            } catch (error) {
                setTypologies([]);
            } finally {
                setLoadingTypologies(false);
            }
        };

        fetchTypologies().then( ()=> console.log('fetchTypologies'));
    }, [setLoadingTypologies, setTypologies]);

    useEffect(() => {
        if (data.institutionType) {
            const foundType = institutionTypes.find(type => {
                return type.code === data.institutionType;
            });
            setSelectedInstitutionType(foundType);
        }


        if (data.typology && typologies?.length > 0) {
            const found = typologies.find(t => t.name === data.typology);
            if (found && found !== selectedTypology) {
                setSelectedTypology(found);
            }
        }

        if (data.classification) {
            const found = classifications.find(c => c.name === data.classification);
            if (found && found !== selectedClassification) {
                setSelectedClassification(found);
            }
        }
    }, [
        data,
        institutionTypes,
        typologies,
        classifications,
        selectedInstitutionType,
        selectedTypology,
        selectedClassification,
        setSelectedInstitutionType,
        setSelectedTypology,
        setSelectedClassification]);

    useEffect(() => {
        const loadCategories = async () => {
            if (selectedInstitutionType) {
                setLoadingCategories(true);
                try {
                    const response = await CategoryMuseumService.get(selectedInstitutionType.code);
                    const formattedCategories = response.map(category => ({
                        name: category.name,
                        code: category.uuid || category.id || '',
                    }));
                    setCategories(formattedCategories);

                    if (data.category) {
                        const foundCategory = formattedCategories.find(c => c.name === data.category);
                        if (foundCategory) {
                            setSelectedCategory(foundCategory as any);
                        }
                    }
                } catch (error) {
                    console.error('Error al cargar categorías:', error);
                    setCategories([]);
                } finally {
                    setLoadingCategories(false);
                }
            }
        };

        loadCategories().then( ()=> console.log('loadCategories'));
    }, [selectedInstitutionType, data.category, setLoadingCategories, setCategories, setSelectedCategory]);

    const handleInstitutionTypeChange = async (e: DropdownChangeEvent) => {
        const selectedType = e.value;

        setSelectedInstitutionType(selectedType);

        onInputChange(
            {
                target: {
                    name: 'institutionType',
                    value: selectedType.code,
                    type: 'change',
                    checked: false,
                },
            } as React.ChangeEvent<HTMLInputElement>,
            'institutionType',
        );

        setSelectedCategory(null);

        setLoadingCategories(true);
        try {
            const response = await CategoryMuseumService.get(selectedType.code);
            setCategories(response.map(category => ({
                name: category.name,
                code: category.uuid || category.id || '',
            })));
        } catch (error) {
            console.error('Error al cargar categorías:', error);
            setCategories([]);
        } finally {
            setLoadingCategories(false);
        }
    };


    const handleCategoryChange = (e: DropdownChangeEvent) => {
        const category = e.value;
        setSelectedCategory(category);

        onInputChange(
            { target: { name: 'category', value: category.name } } as React.ChangeEvent<HTMLInputElement>,
            'category',
        );
    };

    const handleTypologyChange = (e: DropdownChangeEvent) => {
        const selected = e.value;
        setSelectedTypology(selected);

        onInputChange(
            { target: { name: 'typology', value: selected.name } } as React.ChangeEvent<HTMLInputElement>,
            'typology',
        );
    };


    const handleClassificationChange = (e: DropdownChangeEvent) => {
        const selected = e.value;
        console.log({ selected });
        setSelectedClassification(selected);

        onInputChange(
            { target: { name: 'classification', value: selected.code } } as React.ChangeEvent<HTMLInputElement>,
            'classification',
        );
    };

    const isCategoryDisabled = !selectedInstitutionType || loadingCategories;
    return {
        handleInstitutionTypeChange,
        handleCategoryChange,
        handleTypologyChange,
        handleClassificationChange,
        isCategoryDisabled,
    };
}
