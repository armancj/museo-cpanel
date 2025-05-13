import { get, post, patch, del } from '@/adapter/httpAdapter';
import { WebEnvConst } from '@/app/webEnvConst';

export interface SectionResponse {
    [key: string]: any;
    createdAt: Date;
    deleted: boolean;
    updatedAt: Date;
    uuid: string;
    name: string;
    description: string;
}

export const emptySection: SectionResponse = {
    createdAt: new Date(Date.now()),
    deleted: false,
    name: '',
    description: '',
    updatedAt: new Date(Date.now()),
    uuid: ''
};

export const SectionService = {
    getSections: async () => {
        const url = WebEnvConst.section.getAll;
        return await get<SectionResponse[]>(url);
    },

    async updateSection(uuid: string, sectionUpdated: Omit<SectionResponse, 'uuid' | 'deleted'>) {
        const url = WebEnvConst.section.getOne(uuid);
        const { name, description } = sectionUpdated;

        return await patch<boolean>(url, { name, description });
    },

    async createSection(data: SectionResponse) {
        const { name, description } = data;
        return await post<SectionResponse>(WebEnvConst.section.post, { name, description });
    },

    async deleteSection(uuid: string) {
        const url = WebEnvConst.section.getOne(uuid);
        return await del<void>(url);
    }
};
