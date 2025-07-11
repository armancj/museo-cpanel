// Función utilitaria para limpiar campos con modifiedBy e history
import { CulturalHeritageProperty } from '@/app/(main)/pages/cultural-property-heritage/types';

// Función para limpiar propiedades específicas de un objeto
const removeUnwantedProperties = (obj: any): any => {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => removeUnwantedProperties(item));
    }

    const cleaned: any = {};

    for (const [key, value] of Object.entries(obj)) {
        // Eliminar propiedades específicas no deseadas
        if (key === '_id' || key === 'squareMeters' || key === 'cubicMeters' || key === 'history' || key === 'modifiedBy') {
            continue; // Saltar estas propiedades
        }

        if (value && typeof value === 'object') {
            cleaned[key] = removeUnwantedProperties(value);
        } else {
            cleaned[key] = value;
        }
    }

    return cleaned;
};

// Función para asegurar que siempre se retorne una fecha válida
const ensureValidDate = (dateValue: any): Date => {
    if (!dateValue) {
        return new Date(); // Fecha actual por defecto
    }

    // Si ya es una instancia de Date válida
    if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
        return dateValue;
    }

    // Si es un string o número, intentar convertir
    if (typeof dateValue === 'string' || typeof dateValue === 'number') {
        const date = new Date(dateValue);
        if (!isNaN(date.getTime())) {
            return date;
        }
    }

    // Si no se puede convertir, retornar fecha actual
    return new Date();
};

const ensureValidStatus = (status: any): string => {
    const validStatuses = ['To Review', 'Reviewed', 'Has Issue'];

    if (typeof status === 'string' && validStatuses.includes(status)) {
        return status;
    }

    // Status por defecto
    return 'To Review';
};

// Función para validar y limpiar comentarios
const ensureValidComment = (comment: any, fieldKey?: string): string => {
    if (typeof comment === 'string' && comment.trim().length > 0) {
        return comment.trim();
    }

    // Comentarios por defecto específicos por campo
    switch (fieldKey) {
        case 'extremeDates':
            return 'Fechas extremas que delimitan el periodo temporal del objeto cultural';
        case 'objectLocation':
            return 'Ubicación física del objeto en el archivo o museo';
        case 'volumesQuantities':
            return 'Información sobre volúmenes y cantidades del objeto';
        case 'dimensions':
            return 'Dimensiones físicas del objeto cultural';
        default:
            return 'Sin comentarios adicionales';
    }
};

export const cleanFieldData = (obj: CulturalHeritageProperty): any => {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => cleanFieldData(item));
    }

    const cleaned: any = {};

    for (const [key, value] of Object.entries(obj)) {
        if (value && typeof value === 'object' && 'value' in value) {
            // Si el objeto tiene estructura de campo - detectar por cualquiera de estas propiedades
            if ('modifiedBy' in value || 'history' in value || 'status' in value || 'comment' in value) {
                let cleanedValue = value.value;
                let cleanedComment = value.comment;
                let cleanedStatus = value.status;

                // Limpiar propiedades no deseadas del value
                cleanedValue = removeUnwantedProperties(cleanedValue);

                // Manejar casos especiales según el campo
                if (key === 'entryDate' || key === 'descriptionDateTime' || key === 'reviewDateTime') {
                    // Asegurar que las fechas sean instancias Date válidas y no vacías
                    cleanedValue = ensureValidDate(cleanedValue);
                } else if (key === 'extremeDates') {
                    // Manejar fechas dentro de extremeDates
                    if (!cleanedValue || typeof cleanedValue !== 'object') {
                        cleanedValue = {};
                    }

                    // Asegurar que start y end sean fechas válidas y no vacías
                    cleanedValue = {
                        ...cleanedValue,
                        start: ensureValidDate(cleanedValue.start),
                        end: ensureValidDate(cleanedValue.end)
                    };
                }

                // Validar comentarios requeridos para campos específicos
                if (key === 'objectLocation' || key === 'extremeDates' ||
                    key === 'volumesQuantities' || key === 'dimensions') {
                    cleanedComment = ensureValidComment(cleanedComment, key);
                }

                cleanedStatus = ensureValidStatus(cleanedStatus);

                cleaned[key] = {
                    value: cleanedValue,
                    comment: cleanedComment,
                    status: cleanedStatus
                };

            } else {
                // Limpiar recursivamente objetos que no tienen la estructura campo
                cleaned[key] = cleanFieldData(value);
            }
        } else {
            // Para valores primitivos
            cleaned[key] = cleanFieldData(value);
        }
    }

    return cleaned;
};

// Función adicional para validar el objeto completo antes del envío
export const validateCleanedData = (cleanedData: any): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const validStatuses = ['To Review', 'Reviewed', 'Has Issue'];

    // Función recursiva para validar
    const validateObject = (obj: CulturalHeritageProperty, path: string = ''): void => {
        if (!obj || typeof obj !== 'object') return;

        for (const [key, value] of Object.entries(obj)) {
            const currentPath = path ? `${path}.${key}` : key;

            if (value && typeof value === 'object' && 'value' in value) {

                if ('history' in value) {
                    errors.push(`${currentPath}.property history should not exist`);
                }

                if ('modifiedBy' in value) {
                    errors.push(`${currentPath}.property modifiedBy should not exist`);
                }

                if (!value.status || !validStatuses.includes(value.status)) {
                    errors.push(`${currentPath}.status must be one of: ${validStatuses.join(', ')}`);
                }

                if (key === 'entryDate' || key === 'descriptionDateTime' || key === 'reviewDateTime') {
                    if (!value.value) {
                        errors.push(`${currentPath}.value should not be empty`);
                    } else if (!(value.value instanceof Date) || isNaN(value.value.getTime())) {
                        errors.push(`${currentPath}.value should be a valid Date instance`);
                    }
                }

                // Validar extremeDates
                if (key === 'extremeDates' && value.value) {
                    if (!value.value.start) {
                        errors.push(`${currentPath}.value.start should not be empty`);
                    } else if (!(value.value.start instanceof Date) || isNaN(value.value.start.getTime())) {
                        errors.push(`${currentPath}.value.start should be a valid Date instance`);
                    }

                    if (!value.value.end) {
                        errors.push(`${currentPath}.value.end should not be empty`);
                    } else if (!(value.value.end instanceof Date) || isNaN(value.value.end.getTime())) {
                        errors.push(`${currentPath}.value.end should be a valid Date instance`);
                    }
                }

                if ((key === 'objectLocation' || key === 'extremeDates' ||
                        key === 'volumesQuantities' || key === 'dimensions') &&
                    (!value.comment || value.comment.trim() === '')) {
                    errors.push(`${currentPath}.comment should not be empty`);
                }

                if (value.value && typeof value.value === 'object') {
                    const checkForbiddenProps = (obj: any, objPath: string): void => {
                        if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
                            if ('_id' in obj) errors.push(`${objPath}: _id should not exist`);
                            if ('squareMeters' in obj) errors.push(`${objPath}: squareMeters should not exist`);
                            if ('cubicMeters' in obj) errors.push(`${objPath}: cubicMeters should not exist`);
                            if ('history' in obj) errors.push(`${objPath}: history should not exist`);
                            if ('modifiedBy' in obj) errors.push(`${objPath}: modifiedBy should not exist`);
                        }
                    };

                    checkForbiddenProps(value.value, `${currentPath}.value`);
                }
            } else {
                validateObject(value, currentPath);
            }
        }
    };

    validateObject(cleanedData);

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Función para debuggear y mostrar las fechas que se están enviando
export const debugDateFields = (cleanedData: any): void => {
    const dateFields = ['entryDate', 'descriptionDateTime', 'reviewDateTime'];

    dateFields.forEach(field => {
        if (cleanedData[field]) {
            console.log(`${field}:`, {
                value: cleanedData[field].value,
                isDate: cleanedData[field].value instanceof Date,
                isValid: cleanedData[field].value instanceof Date && !isNaN(cleanedData[field].value.getTime()),
                stringValue: cleanedData[field].value?.toString()
            });
        }
    });

    if (cleanedData.extremeDates?.value) {
        console.log('extremeDates.start:', {
            value: cleanedData.extremeDates.value.start,
            isDate: cleanedData.extremeDates.value.start instanceof Date,
            isValid: cleanedData.extremeDates.value.start instanceof Date && !isNaN(cleanedData.extremeDates.value.start.getTime()),
            stringValue: cleanedData.extremeDates.value.start?.toString()
        });

        console.log('extremeDates.end:', {
            value: cleanedData.extremeDates.value.end,
            isDate: cleanedData.extremeDates.value.end instanceof Date,
            isValid: cleanedData.extremeDates.value.end instanceof Date && !isNaN(cleanedData.extremeDates.value.end.getTime()),
            stringValue: cleanedData.extremeDates.value.end?.toString()
        });
    }

    console.log('=== FIN DEBUG ===');
};
