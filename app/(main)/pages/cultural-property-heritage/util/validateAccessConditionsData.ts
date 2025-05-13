import { CulturalPropertyModel } from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';

export function ValidateAccessConditionsData(formData: CulturalPropertyModel, setFormErrors: (value: (((prevState: Record<string, any>) => Record<string, any>) | Record<string, any>)) => void) {
    return () => {
        const { accessAndUseConditions } = formData;
        const { accessConditions, reproductionConditions, technicalRequirements } = accessAndUseConditions;
        const errors: Record<string, string> = {};

        if (!accessConditions || (Array.isArray(accessConditions.value) && accessConditions.value.length === 1 && accessConditions.value[0] === '')) {
            errors.producerAuthorNames = 'La Condiciones de Acceso es obligatorio';
        }

        if (!reproductionConditions || (Array.isArray(reproductionConditions.value) && reproductionConditions.value.length === 1 && reproductionConditions.value[0] === '')) {
            errors.institutionalHistory = 'Condiciones de Reproducción es obligatoria';
        }

        if (!technicalRequirements || technicalRequirements?.value?.trim() === '') {
            errors.objectEntryHistory = 'Requisitos Técnicos es obligatoria';
        }

        setFormErrors(prev => ({ ...prev, producerAuthor: errors }));
        return Object.keys(errors).length === 0;
    };
}
