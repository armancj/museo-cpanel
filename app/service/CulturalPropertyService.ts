import { get, post, put, patch, del } from '@/adapter/httpAdapter';

import { WebEnvConst } from '@/app/webEnvConst';
import { CulturalHeritageProperty } from '@/app/(main)/pages/cultural-property-heritage/types';
import { cleanFieldData, validateCleanedData } from '@/app/service/utilities/cleanFieldData';

export interface CulturalPropertySimpleModel {
    createdAt: Date;
    deleted: boolean;
    updatedAt: Date;
    uuid: string;
}

export const CulturalPropertyService = {
    getCulturalProperties: async () => {
        const result = await get<CulturalHeritageProperty[]>(WebEnvConst.culturalProperty.getAll);
        console.log({ result });
        return result;
    },

    async addCulturalRecordDetails(
        endpoints: {
            entryAndLocationRecordUrl: string;
            producerAuthorRecordUrl: string;
            culturalRecordUrl: string;
            accessAndUseConditionsUrl: string;
            associatedDocumentationUrl: string;
            descriptionControlUrl: string;
            culturalNotesUrl: string;
        },
        cleanedData: any,
        culturalPropertySimple: CulturalPropertySimpleModel
    ) {
        const endpointPromises = [
            {
                key: 'accessAndUseConditions',
                url: endpoints.accessAndUseConditionsUrl,
                data: cleanedData.accessAndUseConditions
            },
            {
                key: 'associatedDocumentation',
                url: endpoints.associatedDocumentationUrl,
                data: cleanedData.associatedDocumentation
            },
            { key: 'culturalRecord', url: endpoints.culturalRecordUrl, data: cleanedData.culturalRecord },
            {
                key: 'descriptionControl',
                url: endpoints.descriptionControlUrl,
                data: cleanedData.descriptionControl
            },
            {
                key: 'entryAndLocation',
                url: endpoints.entryAndLocationRecordUrl,
                data: cleanedData.entryAndLocation
            },
            { key: 'producerAuthor', url: endpoints.producerAuthorRecordUrl, data: cleanedData.producerAuthor },
            { key: 'notes', url: endpoints.culturalNotesUrl, data: cleanedData.notes }
        ]
            .filter(({ data }) => data !== undefined)
            .map(({ url, data }) => put<any>(url, data));

        const [accessAndUseConditions, associatedDocumentation, culturalRecord, descriptionControl, entryAndLocation, producerAuthor, notes] = await Promise.all(endpointPromises);

        const culturalProperty: CulturalHeritageProperty = {
            ...culturalPropertySimple,
            accessAndUseConditions,
            associatedDocumentation,
            culturalRecord,
            descriptionControl,
            entryAndLocation,
            producerAuthor,
            notes
        };

        return culturalProperty;
    },

    createCulturalProperty: async (data: CulturalHeritageProperty) => {
        const urlCulturalProperty = WebEnvConst.culturalProperty.post;

        const culturalPropertySimple = await post<CulturalPropertySimpleModel>(urlCulturalProperty, {});

        try {
            const endpoints = WebEnvConst.culturalPropertyDataEndpoints(culturalPropertySimple.uuid);

            const cleanedData = cleanFieldData(data);

            const validation = validateCleanedData(cleanedData);
            if (!validation.isValid) {
                console.warn('Advertencias de validación:', validation.errors);
                throw new Error(`Errores de validación: ${validation.errors.join(', ')}`);
            }

            console.log('Cleaned data:', cleanedData);

            return await CulturalPropertyService.addCulturalRecordDetails(endpoints, cleanedData, culturalPropertySimple);

        } catch (error) {
            if (culturalPropertySimple.uuid) {
                await CulturalPropertyService.deleteCulturalProperty(culturalPropertySimple.uuid);
            }
            throw new Error(`Error creating cultural property`);
        }
    },

    updateCulturalProperty: async (uuid: string, updatedData: Partial<CulturalHeritageProperty>) => {
        const endpoints = WebEnvConst.culturalPropertyDataEndpoints(uuid);

        const cleanedData = cleanFieldData(updatedData as CulturalHeritageProperty);

         await CulturalPropertyService.addCulturalRecordDetails(endpoints, cleanedData, {uuid} as CulturalPropertySimpleModel);

        return true;
    },

    deleteCulturalProperty: async (uuid: string) => {
        const url = WebEnvConst.culturalProperty.getOne(uuid);
        console.log({ url });
        return await del<void>(url);
    },

    getPublicCulturalProperty: async (uuid: string) => {
        const url = WebEnvConst.culturalProperty.getPublic(uuid);
        return await get<CulturalHeritageProperty>(url);
    }
};
