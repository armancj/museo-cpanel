import { get, post, patch, del } from '@/adapter/httpAdapter';
import { WebEnvConst } from '@/app/webEnvConst';


export interface CountryResponse {
    [key: string]: any;
    createdAt: Date;
    deleted: boolean;
    updatedAt: Date;
    uuid: string;
    name: string;
}

export const emptyCountry: CountryResponse = {
    createdAt: new Date(Date.now()),
    deleted: false,
    name: '',
    updatedAt: new Date(Date.now()),
    uuid: ''
};
export const CountryService = {
    getCountries: async () => {
        return await get<CountryResponse[]>(WebEnvConst.country.getAll);
    },
    async updateCountry(uuid: string, countryUpdated: Omit<CountryResponse, 'uuid' | 'deleted'>) {
        const url = WebEnvConst.country.getOne(uuid);
        const { name } = countryUpdated;

        return await patch<boolean>(url, { name });
    },

    async createCountry(data: CountryResponse) {
        const { name } = data;
        return await post<CountryResponse>(WebEnvConst.country.post, { name });
    },

    async deleteCountry(uuid: string) {
        const url = WebEnvConst.country.getOne(uuid);
        return await del<CountryResponse>(url);
    }
};
