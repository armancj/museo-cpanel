import { get, post, patch, del } from '@/adapter/httpAdapter';
import { WebEnvConst } from '@/app/webEnvConst';

export interface ValueGradeResponse {
    [key: string]: any;
    createdAt: Date;
    deleted: boolean;
    updatedAt: Date;
    uuid: string;
    name: string;
    description: string;
}

export const emptyValueGrade: ValueGradeResponse = {
    createdAt: new Date(Date.now()),
    deleted: false,
    name: '',
    description: '',
    updatedAt: new Date(Date.now()),
    uuid: ''
};

export const ValueGradeService = {
    getValueGrades: async () => {
        const url = WebEnvConst.valueGrade.getAll;
        return await get<ValueGradeResponse[]>(url);
    },

    async updateValueGrade(uuid: string, valueGradeUpdated: Omit<ValueGradeResponse, 'uuid' | 'deleted'>) {
        const url = WebEnvConst.valueGrade.getOne(uuid);
        const { name, description } = valueGradeUpdated;

        return await patch<boolean>(url, { name, description });
    },

    async createValueGrade(data: ValueGradeResponse) {
        const { name, description } = data;
        return await post<ValueGradeResponse>(WebEnvConst.valueGrade.post, { name, description });
    },

    async deleteValueGrade(uuid: string) {
        const url = WebEnvConst.valueGrade.getOne(uuid);
        return await del<void>(url);
    }
};
