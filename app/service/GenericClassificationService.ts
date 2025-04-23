import { get, post, patch, del } from '@/adapter/httpAdapter';
import { WebEnvConst } from '@/app/webEnvConst';

export interface GenericClassificationResponse {
    [key: string]: any;
    createdAt: Date;
    deleted: boolean;
    updatedAt: Date;
    uuid: string;
    name: string;
    description: string;
}

export const emptyGenericClassification: GenericClassificationResponse = {
    createdAt: new Date(Date.now()),
    deleted: false,
    name: '',
    description: '',
    updatedAt: new Date(Date.now()),
    uuid: ''
};

export const GenericClassificationService = {
    getGenericClassifications: async () => {
        const url = WebEnvConst.genericClassification.getAll;
        return await get<GenericClassificationResponse[]>(url);
    },

    async updateGenericClassification(uuid: string, genericClassificationUpdated: Omit<GenericClassificationResponse, 'uuid' | 'deleted'>) {
        const url = WebEnvConst.genericClassification.getOne(uuid);
        const { name, description } = genericClassificationUpdated;

        return await patch<boolean>(url, { name, description });
    },

    async createGenericClassification(data: GenericClassificationResponse) {
        const { name, description } = data;
        return await post<GenericClassificationResponse>(WebEnvConst.genericClassification.post, { name, description });
    },

    async deleteGenericClassification(uuid: string) {
        const url = WebEnvConst.genericClassification.getOne(uuid);
        return await del<void>(url);
    }
};
