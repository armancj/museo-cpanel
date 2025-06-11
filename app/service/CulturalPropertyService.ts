import { get, post, put, patch, del } from '@/adapter/httpAdapter';

import { WebEnvConst } from '@/app/webEnvConst';
import { CulturalHeritageProperty } from '@/app/(main)/pages/cultural-property-heritage/types';

export interface CulturalPropertySimpleModel {
    createdAt: Date;
    deleted: boolean;
    updatedAt: Date;
    uuid: string;
}

export const CulturalPropertyService = {
    getCulturalProperties: async () => {
        return await get<CulturalHeritageProperty[]>(WebEnvConst.culturalProperty.getAll);
    },

    createCulturalProperty: async (data: CulturalHeritageProperty) => {
        const urlCulturalProperty = WebEnvConst.culturalProperty.post;

        const culturalPropertySimple = await post<CulturalPropertySimpleModel>(urlCulturalProperty, {});

        const endpoints = WebEnvConst.culturalPropertyDataEndpoints(culturalPropertySimple.uuid)

        console.log( {services:data})

        const endpointPromises = [
            { key: 'accessAndUseConditions', url: endpoints.accessAndUseConditionsUrl, data: data.accessAndUseConditions },
            { key: 'associatedDocumentation', url: endpoints.associatedDocumentationUrl, data: data.associatedDocumentation },
            { key: 'culturalRecord', url: endpoints.culturalRecordUrl, data: data.culturalRecord },
            { key: 'descriptionControl', url: endpoints.descriptionControlUrl, data: data.descriptionControl },
            { key: 'entryAndLocation', url: endpoints.entryAndLocationRecordUrl, data: data.entryAndLocation },
            { key: 'producerAuthor', url: endpoints.producerAuthorRecordUrl, data: data.producerAuthor },
            { key: 'notes', url: endpoints.culturalNotesUrl, data: data.notes },
        ]
            .filter(({ data }) => data !== undefined)
            .map(({ url, data }) => put<any>(url, data));

        const [
            accessAndUseConditions,
            associatedDocumentation,
            culturalRecord,
            descriptionControl,
            entryAndLocation,
            producerAuthor,
            notes,
        ] = await Promise.all(endpointPromises);


        const culturalProperty: CulturalHeritageProperty = {
            ...culturalPropertySimple,
            accessAndUseConditions,
            associatedDocumentation,
            culturalRecord,
            descriptionControl,
            entryAndLocation,
            producerAuthor,
            notes
        }

        return culturalProperty;
    },

    updateCulturalProperty: async (uuid: string, updatedData: Partial<CulturalHeritageProperty>) => {
        const endpoints = WebEnvConst.culturalPropertyDataEndpoints(uuid);

        const updatePromises = [
            { key: "accessAndUseConditions", url: endpoints.accessAndUseConditionsUrl, data: updatedData.accessAndUseConditions },
            { key: "associatedDocumentation", url: endpoints.associatedDocumentationUrl, data: updatedData.associatedDocumentation },
            { key: "culturalRecord", url: endpoints.culturalRecordUrl, data: updatedData.culturalRecord },
            { key: "descriptionControl", url: endpoints.descriptionControlUrl, data: updatedData.descriptionControl },
            { key: "entryAndLocation", url: endpoints.entryAndLocationRecordUrl, data: updatedData.entryAndLocation },
            { key: "producerAuthor", url: endpoints.producerAuthorRecordUrl, data: updatedData.producerAuthor },
            { key: "notes", url: endpoints.culturalNotesUrl, data: updatedData.notes }
        ]
            .filter(({ data }) => data !== undefined)
            .map(({ url, data }) => patch(url, data));

        await Promise.all(updatePromises);

        return true;
    },

    deleteCulturalProperty: async (uuid: string,)=> {
        const url = WebEnvConst.culturalProperty.getOne(uuid);
        console.log({url})
        return await del<void>(url);
    }
};
