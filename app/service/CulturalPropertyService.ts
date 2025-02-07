import { get, post, put, del } from '@/adapter/httpAdapter';
import {
    AccessAndUseConditions, AssociatedDocumentation,
    CulturalPropertyModel, CulturalRecord, DescriptionControl, EntryAndLocation, Notes, ProducerAuthor
} from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';
import { WebEnvConst } from '@/app/webEnvConst';
import { CountryResponse } from '@/app/service/CountryService';

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
    async createCulturalProperty(data: CulturalPropertyModel) {
        const urlCulturalProperty = WebEnvConst.culturalProperty.post;


        const culturalPropertySimple = await post<CulturalPropertySimpleModel>(urlCulturalProperty, data);

        const {
            associatedDocumentationUrl,
            culturalNotesUrl,
            culturalRecordUrl,
            entryAndLocationRecordUrl,
            producerAuthorRecordUrl,
            accessAndUseConditionsUrl,
            descriptionControlUrl
        } = WebEnvConst.culturalPropertyDataEndpoints(culturalPropertySimple.uuid)

        const accessAndUseConditions = await put<AccessAndUseConditions>(accessAndUseConditionsUrl, data);
        const associatedDocumentation = await put<AssociatedDocumentation>(associatedDocumentationUrl, data);
        const culturalRecord = await put<CulturalRecord>(culturalRecordUrl, data);
        const descriptionControl = await put<DescriptionControl>(descriptionControlUrl, data);
        const entryAndLocation = await put<EntryAndLocation>(entryAndLocationRecordUrl, data);
        const producerAuthor = await put<ProducerAuthor>(producerAuthorRecordUrl, data);
        const notes = await put<Notes>(culturalNotesUrl, data);

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


    async updateCulturalProperty(uuid: string, countryCulturalPropertyModel: Partial<CulturalPropertyModel>) {
        console.log(countryCulturalPropertyModel);
        return true;

    },
    async deleteCulturalProperty(uuid: string,) {

    }
};
