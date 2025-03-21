import { get, post, patch, del } from '@/adapter/httpAdapter';
import { WebEnvConst } from '@/app/webEnvConst';

export interface TypologyResponse {
    [key: string]: any;
    name: string;
    createdAt: Date;
    active: boolean;
    description: string;
    updatedAt: Date;
    uuid: string;
}

export const emptyTypology: TypologyResponse = {
    name: '',
    createdAt: new Date(Date.now()),
    active: true,
    description: '',
    updatedAt: new Date(Date.now()),
    uuid: ''
};

export const TypologyService = {
    getTypologies: async (active?: boolean) => {
        let url = WebEnvConst.typology.getAll;

        if (active) {
            url = `${url}?active=${active}`;
        }

        return await get<TypologyResponse[]>(url);
    },

    async updateTypology(uuid: string, updated: Omit<TypologyResponse, 'uuid'>) {
        const url = WebEnvConst.typology.getOne(uuid);
        const { name, description, active } = updated;
        await patch<TypologyResponse[]>(url, { name, description, active });
        return true
    },

    async create(data: TypologyResponse) {
        const { name, description, active } = data;
        return await post<TypologyResponse>(WebEnvConst.typology.post, { name, description, active });
    },

    async deleteTypology(uuid: string) {
        const url = WebEnvConst.typology.getOne(uuid);
        return await del<void>(url);
    },

    async getTypologyById(uuid: string) {
        const url = WebEnvConst.typology.getOne(uuid);
        return await get<TypologyResponse>(url);
    }
};
