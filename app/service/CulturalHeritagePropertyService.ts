import { get, post, patch, del } from '@/adapter/httpAdapter';
import { WebEnvConst } from '@/app/webEnvConst';
import { CulturalHeritageProperty, emptyCulturalHeritageProperty } from '@/app/(main)/pages/cultural-property-heritage/types';

export const CulturalHeritagePropertyService = {
    getCulturalHeritageProperties: async () => {
        let url = WebEnvConst.culturalProperty.getAll;
        return await get<CulturalHeritageProperty[]>(url);
    },

    getCulturalHeritageProperty: async (uuid: string) => {
        let url = WebEnvConst.culturalProperty.getOne(uuid);
        return await get<CulturalHeritageProperty>(url);
    },

    async updateCulturalHeritageProperty(uuid: string, data: Partial<CulturalHeritageProperty>) {
        const url = WebEnvConst.culturalProperty.getOne(uuid);
        return await patch<boolean>(url, data);
    },

    async createCulturalHeritageProperty(data: CulturalHeritageProperty) {
        return await post<CulturalHeritageProperty>(WebEnvConst.culturalProperty.post, data);
    },

    async deleteCulturalHeritageProperty(uuid: string) {
        const url = WebEnvConst.culturalProperty.getOne(uuid);
        return await del<void>(url);
    },

    // Methods for updating specific sections of the cultural heritage property
    async updateEntryAndLocationRecord(uuid: string, data: any) {
        const url = WebEnvConst.culturalPropertyDataEndpoints(uuid).entryAndLocationRecordUrl;
        return await patch<boolean>(url, data);
    },

    async updateProducerAuthorRecord(uuid: string, data: any) {
        const url = WebEnvConst.culturalPropertyDataEndpoints(uuid).producerAuthorRecordUrl;
        return await patch<boolean>(url, data);
    },

    async updateCulturalRecord(uuid: string, data: any) {
        const url = WebEnvConst.culturalPropertyDataEndpoints(uuid).culturalRecordUrl;
        return await patch<boolean>(url, data);
    },

    async updateAccessAndUseConditions(uuid: string, data: any) {
        const url = WebEnvConst.culturalPropertyDataEndpoints(uuid).accessAndUseConditionsUrl;
        return await patch<boolean>(url, data);
    },

    async updateAssociatedDocumentation(uuid: string, data: any) {
        const url = WebEnvConst.culturalPropertyDataEndpoints(uuid).associatedDocumentationUrl;
        return await patch<boolean>(url, data);
    },

    async updateDescriptionControl(uuid: string, data: any) {
        const url = WebEnvConst.culturalPropertyDataEndpoints(uuid).descriptionControlUrl;
        return await patch<boolean>(url, data);
    },

    async updateCulturalNotes(uuid: string, data: any) {
        const url = WebEnvConst.culturalPropertyDataEndpoints(uuid).culturalNotesUrl;
        return await patch<boolean>(url, data);
    }
};

export { emptyCulturalHeritageProperty };
