import { get, post, patch, del } from '@/adapter/httpAdapter';
import { WebEnvConst } from '@/app/webEnvConst';

export interface ReproductionConditionsResponse {
    [key: string]: any;
    createdAt: Date;
    deleted: boolean;
    updatedAt: Date;
    uuid: string;
    name: string;
    description: string;
}

export const emptyReproductionConditions: ReproductionConditionsResponse = {
    createdAt: new Date(Date.now()),
    deleted: false,
    name: '',
    description: '',
    updatedAt: new Date(Date.now()),
    uuid: ''
};

export const ReproductionConditionsService = {
    getReproductionConditions: async () => {
        const url = WebEnvConst.reproductionConditions.getAll;
        return await get<ReproductionConditionsResponse[]>(url);
    },

    async updateReproductionConditions(uuid: string, reproductionConditionsUpdated: Omit<ReproductionConditionsResponse, 'uuid' | 'deleted'>) {
        const url = WebEnvConst.reproductionConditions.getOne(uuid);
        const { name, description } = reproductionConditionsUpdated;

        return await patch<boolean>(url, { name, description });
    },

    async createReproductionConditions(data: ReproductionConditionsResponse) {
        const { name, description } = data;
        return await post<ReproductionConditionsResponse>(WebEnvConst.reproductionConditions.post, { name, description });
    },

    async deleteReproductionConditions(uuid: string) {
        const url = WebEnvConst.reproductionConditions.getOne(uuid);
        return await del<void>(url);
    }
};
