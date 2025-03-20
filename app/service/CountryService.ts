import { get, post, patch, del } from '@/adapter/httpAdapter';
import { WebEnvConst } from '@/app/webEnvConst';
import { AddressResponse } from '@/app/service/UserService';


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
    getCountries: async ({name}: AddressResponse = {}) => {
        let url = WebEnvConst.country.getAll;
        if(name) url = `${url}?name=${name}`;
        return await get<CountryResponse[]>(url);
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
        return await del<void>(url);
    }
};
