import { get, post, patch, del } from '@/adapter/httpAdapter';
import { WebEnvConst } from '@/app/webEnvConst';
import { AddressResponse } from '@/app/service/UserService';


export interface MunicipalityResponse {
    [key: string]: any;
    name: string;
    province: string;
    createdAt: Date;
    deleted: boolean;
    updatedAt: Date;
    uuid: string;
}


export const emptyMunicipality: MunicipalityResponse = {
    deleted: false, name: '', province: '', uuid: '',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())

};
export const MunicipalityService = {
    getMunicipalities: async ({ name }: AddressResponse = {}) => {
        let url = WebEnvConst.municipality.getAll;
        if(name) url = `${url}?province=${name}`;
        return await get<MunicipalityResponse[]>(url);
    },
    async update(uuid: string, updated: Omit<MunicipalityResponse, 'uuid' | 'deleted'>) {
        const { province, name } =updated;
        const url = WebEnvConst.municipality.getOne(uuid)
        return await patch<boolean>(url, { province, name})
    },
    async create(data: MunicipalityResponse) {
        const { province, name } =data;
        const url = WebEnvConst.municipality.post
        return await post<MunicipalityResponse>(url, { province, name})
    },
    delete: async function(uuid: string) {
        const url = WebEnvConst.municipality.getOne(uuid);
        return await del<boolean>(url);
    }
};
