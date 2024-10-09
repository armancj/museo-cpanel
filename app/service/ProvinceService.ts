import { get, post, patch, del } from '@/adapter/httpAdapter';
import { WebEnvConst } from '@/app/webEnvConst';
import { AddressResponse } from '@/app/service/UserService';



interface Response {
    createdAt: Date;
    deleted:   boolean;
    updatedAt: Date;
    uuid:      string;
    country:   string;
    name:      string;
}

export const ProvinceService  =   {
    getProvinces: async ({name}: AddressResponse) => {
        const url = WebEnvConst.province.getAll;
        return await get<Response[]>(`${url}?country=${name}`);
    },
}
