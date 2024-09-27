import { get, post } from '@/adapter/httpAdapter';
import { WebEnvConst } from '@/app/webEnvConst';

export interface UsersResponse {
    usersData:    UsersDatum[];
    totalPage:    number;
    totalElement: number;
}

export interface UsersDatum {
    [key: string]: any;
    uuid:        string;
    mobile:      string;
    municipal:   string;
    email:       string;
    address:     string;
    lastName:    string;
    name:        string;
    nationality: string;
    province:    string;
    avatar?:     Avatar;
    roles:       string;
    active:      boolean;
    deleted:     boolean;
}

export interface Avatar {
    id:       string;
    nameFile: string;
}

export interface addressResponse {
    name:      string;
}

export const UserService  =   {
    getUsers: async () => {
        return await post<UsersResponse>(WebEnvConst.user.getAll, {});
    }
};

export const ProvinceService  =   {
    getProvinces: async ({name}: addressResponse) => {
        return await get<addressResponse[]>(`${WebEnvConst.province}?country=${name}`);
    },
}
export const MunicipalityService  =   {
    getMunicipalities: async ({name}: addressResponse) => {
        return await get<addressResponse[]>(`${WebEnvConst.municipality}?province=${name}`);
    },
}
export const CountryService  =   {
    getCountries: async () => {
        const response = await get<addressResponse[]>(WebEnvConst.country);
        console.log({ country: response })
        return response;
    },
}
