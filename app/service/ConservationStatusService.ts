import { get, post, patch, del } from '@/adapter/httpAdapter';
import { WebEnvConst } from '@/app/webEnvConst';

export interface ConservationStatusResponse {
    [key: string]: any;
    createdAt: Date;
    deleted: boolean;
    updatedAt: Date;
    uuid: string;
    name: string;
    description: string;
}

export const emptyConservationStatus: ConservationStatusResponse = {
    createdAt: new Date(Date.now()),
    deleted: false,
    name: '',
    description: '',
    updatedAt: new Date(Date.now()),
    uuid: ''
};

export const ConservationStatusService = {
    getConservationStatuses: async () => {
        const url = WebEnvConst.conservationStatus.getAll;
        return await get<ConservationStatusResponse[]>(url);
    },

    async updateConservationStatus(uuid: string, conservationStatusUpdated: Omit<ConservationStatusResponse, 'uuid' | 'deleted'>) {
        const url = WebEnvConst.conservationStatus.getOne(uuid);
        const { name, description } = conservationStatusUpdated;

        return await patch<boolean>(url, { name, description });
    },

    async createConservationStatus(data: ConservationStatusResponse) {
        const { name, description } = data;
        return await post<ConservationStatusResponse>(WebEnvConst.conservationStatus.post, { name, description });
    },

    async deleteConservationStatus(uuid: string) {
        const url = WebEnvConst.conservationStatus.getOne(uuid);
        return await del<void>(url);
    }
};
