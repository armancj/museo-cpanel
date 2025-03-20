import { CulturalPropertyModel } from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';

export function validateProducerAuthorData(formData: CulturalPropertyModel, setFormErrors: (value: (((prevState: Record<string, any>) => Record<string, any>) | Record<string, any>)) => void) {
    return () => {
        const { producerAuthor } = formData;
        const errors: Record<string, string> = {};

        if (!producerAuthor.producerAuthorNames || producerAuthor.producerAuthorNames.trim() === '') {
            errors.producerAuthorNames = 'El nombre del productor/autor es obligatorio';
        }

        if (!producerAuthor.institutionalHistory || producerAuthor.institutionalHistory.trim() === '') {
            errors.institutionalHistory = 'La historia institucional es obligatoria';
        }

        if (!producerAuthor.objectEntryHistory || producerAuthor.objectEntryHistory.trim() === '') {
            errors.objectEntryHistory = 'La historia de entrada del objeto es obligatoria';
        }

        if (!producerAuthor.street || producerAuthor.street.trim() === '') {
            errors.street = 'La calle es obligatoria';
        }

        if (!producerAuthor.number || producerAuthor.number.trim() === '') {
            errors.number = 'El número es obligatorio';
        }

        if (!producerAuthor.betweenStreet1 || producerAuthor.betweenStreet1.trim() === '') {
            errors.betweenStreet1 = 'La primera calle entre es obligatoria';
        }

        if (!producerAuthor.betweenStreet2 || producerAuthor.betweenStreet2.trim() === '') {
            errors.betweenStreet2 = 'La segunda calle entre es obligatoria';
        }

        if (!producerAuthor.province || producerAuthor.province.trim() === '') {
            errors.province = 'La provincia es obligatoria';
        }

        if (!producerAuthor.municipality || producerAuthor.municipality.trim() === '') {
            errors.municipality = 'El municipio es obligatorio';
        }

        if (!producerAuthor.district || producerAuthor.district.trim() === '') {
            errors.district = 'El distrito es obligatorio';
        }

        if (!producerAuthor.locality || producerAuthor.locality.trim() === '') {
            errors.locality = 'La localidad es obligatoria';
        }

        setFormErrors(prev => ({ ...prev, producerAuthor: errors }));
        return Object.keys(errors).length === 0;
    };
}
