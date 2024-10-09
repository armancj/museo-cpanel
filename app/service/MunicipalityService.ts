import { get, post, patch, del } from '@/adapter/httpAdapter';
import { WebEnvConst } from '@/app/webEnvConst';
import { AddressResponse } from '@/app/service/UserService';


interface Response {
    name:      string;
    province:  string;
    createdAt: Date;
    deleted:   boolean;
    updatedAt: Date;
    uuid:      string;
}



export const MunicipalityService  =   {
    getMunicipalities: async ({name}: AddressResponse) => {
        const url = WebEnvConst.municipality.getAll;
        return await get<Response[]>(`${url}?province=${name}`);
    },
};
