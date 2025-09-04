import { get, post, patch, del } from '@/adapter/httpAdapter';
import { WebEnvConst } from '@/app/webEnvConst';

export interface EntryFormResponse {
    [key: string]: any;
    createdAt: Date;
    deleted: boolean;
    updatedAt: Date;
    uuid: string;
    name: string;
    description: string;
}

export const emptyEntryForm: EntryFormResponse = {
    createdAt: new Date(Date.now()),
    deleted: false,
    name: '',
    description: '',
    updatedAt: new Date(Date.now()),
    uuid: ''
};

export const EntryFormService = {
    getEntryForms: async () => {
        let url = WebEnvConst.entryForm.getAll;
        return await get<EntryFormResponse[]>(url);
    },

    async updateEntryForm(uuid: string, entryFormUpdated: Omit<EntryFormResponse, 'uuid' | 'deleted'>) {
        const url = WebEnvConst.entryForm.getOne(uuid);
        const { name, description } = entryFormUpdated;

        return await patch<boolean>(url, { name, description });
    },

    async createEntryForm(data: EntryFormResponse) {
        const { name, description } = data;
        return await post<EntryFormResponse>(WebEnvConst.entryForm.post, { name, description });
    },

    async deleteEntryForm(uuid: string) {
        const url = WebEnvConst.entryForm.getOne(uuid);
        return await del<void>(url);
    }
};
