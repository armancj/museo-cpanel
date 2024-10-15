import { get, post, patch, del } from '@/adapter/httpAdapter';
import { WebEnvConst } from '@/app/webEnvConst';
import { AddressResponse } from '@/app/service/UserService';


export interface ProvinceResponse {
    [key: string]: any;
    createdAt: Date;
    deleted:   boolean;
    updatedAt: Date;
    uuid:      string;
    country:   string;
    name:      string;
}
export const emptyProvince: ProvinceResponse = {
    country: '',
    createdAt: new Date(Date.now()),
    deleted: false,
    name: '',
    updatedAt: new Date(Date.now()),
    uuid: ''
}
export const ProvinceService  =   {
    getProvinces: async ({name}: AddressResponse = {}) => {
        let url = WebEnvConst.province.getAll;
        if(name) url = `${url}?country=${name}`;
        return await get<ProvinceResponse[]>(url);
    },
    async updateProvince(uuid: string, updated: Omit<ProvinceResponse, 'uuid' | 'deleted'>) {
        const url = WebEnvConst.province.getOne(uuid);
        return await patch<ProvinceResponse[]>(url, updated);
    },
    async create(data: ProvinceResponse) {
        const {name, country} = data;
        return await post<ProvinceResponse>(WebEnvConst.province.post, {name, country})
    },
    async deleteCountry(uuid: string) {
        const url = WebEnvConst.province.getOne(uuid);
        return await del<ProvinceResponse[]>(url);
    }
}
