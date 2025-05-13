import { get, post, patch, del } from '@/adapter/httpAdapter';
import { WebEnvConst } from '@/app/webEnvConst';

export interface HeritageTypeResponse {
    [key: string]: any;
    createdAt: Date;
    deleted: boolean;
    updatedAt: Date;
    uuid: string;
    name: string;
    description: string;
}

export const emptyHeritageType: HeritageTypeResponse = {
    createdAt: new Date(Date.now()),
    deleted: false,
    name: '',
    description: '',
    updatedAt: new Date(Date.now()),
    uuid: ''
};

export const HeritageTypeService = {
    getHeritageTypes: async () => {
        const url = WebEnvConst.heritageType.getAll;
        return await get<HeritageTypeResponse[]>(url);
    },

    async updateHeritageType(uuid: string, heritageTypeUpdated: Omit<HeritageTypeResponse, 'uuid' | 'deleted'>) {
        const url = WebEnvConst.heritageType.getOne(uuid);
        const { name, description } = heritageTypeUpdated;

        return await patch<boolean>(url, { name, description });
    },

    async createHeritageType(data: HeritageTypeResponse) {
        const { name, description } = data;
        return await post<HeritageTypeResponse>(WebEnvConst.heritageType.post, { name, description });
    },

    async deleteHeritageType(uuid: string) {
        const url = WebEnvConst.heritageType.getOne(uuid);
        return await del<void>(url);
    }
};
