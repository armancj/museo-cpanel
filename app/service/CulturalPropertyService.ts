import { get, post, put, patch, del } from '@/adapter/httpAdapter';
import {
    AccessAndUseConditions, AssociatedDocumentation,
    CulturalPropertyModel, CulturalRecord, DescriptionControl, EntryAndLocation, Notes, ProducerAuthor
} from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';
import { WebEnvConst } from '@/app/webEnvConst';

export interface CulturalPropertySimpleModel {
    createdAt: Date;
    deleted: boolean;
    updatedAt: Date;
    uuid: string;
}

export const CulturalPropertyService = {
    getCulturalProperties: async () => {
        return await get<CulturalPropertyModel[]>(WebEnvConst.culturalProperty.getAll);
    },

    createCulturalProperty: async (data: CulturalPropertyModel) => {
        const urlCulturalProperty = WebEnvConst.culturalProperty.post;

        const culturalPropertySimple = await post<CulturalPropertySimpleModel>(urlCulturalProperty, data);

        const endpoints = WebEnvConst.culturalPropertyDataEndpoints(culturalPropertySimple.uuid)

        const [
            accessAndUseConditions,
            associatedDocumentation,
            culturalRecord,
            descriptionControl,
            entryAndLocation,
            producerAuthor,
            notes
        ] = await Promise.all([
            put<AccessAndUseConditions>(endpoints.accessAndUseConditionsUrl, data),
            put<AssociatedDocumentation>(endpoints.associatedDocumentationUrl, data),
            put<CulturalRecord>(endpoints.culturalRecordUrl, data),
            put<DescriptionControl>(endpoints.descriptionControlUrl, data),
            put<EntryAndLocation>(endpoints.entryAndLocationRecordUrl, data),
            put<ProducerAuthor>(endpoints.producerAuthorRecordUrl, data),
            put<Notes>(endpoints.culturalNotesUrl, data)
        ]);

        const culturalProperty: CulturalPropertyModel = {
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

    updateCulturalProperty: async (uuid: string, updatedData: Partial<CulturalPropertyModel>) => {
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
        return await del<void>(url);
    }
};
