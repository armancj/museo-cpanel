import { get, post, patch, del } from '@/adapter/httpAdapter';
import { WebEnvConst } from '@/app/webEnvConst';

export interface FundTitleResponse {
    [key: string]: any;
    createdAt: Date;
    deleted: boolean;
    updatedAt: Date;
    uuid: string;
    name: string;
    description: string;
}

export const emptyFundTitle: FundTitleResponse = {
    createdAt: new Date(Date.now()),
    deleted: false,
    name: '',
    description: '',
    updatedAt: new Date(Date.now()),
    uuid: ''
};

export const FundTitleService = {
    getFundTitles: async () => {
        let url = WebEnvConst.fundTitle.getAll;
        return await get<FundTitleResponse[]>(url);
    },

    async updateFundTitle(uuid: string, fundTitleUpdated: Omit<FundTitleResponse, 'uuid' | 'deleted'>) {
        const url = WebEnvConst.fundTitle.getOne(uuid);
        const { name, description } = fundTitleUpdated;

        return await patch<boolean>(url, { name, description });
    },

    async createFundTitle(data: FundTitleResponse) {
        const { name, description } = data;
        return await post<FundTitleResponse>(WebEnvConst.fundTitle.post, { name, description });
    },

    async deleteFundTitle(uuid: string) {
        const url = WebEnvConst.fundTitle.getOne(uuid);
        return await del<void>(url);
    }
};
