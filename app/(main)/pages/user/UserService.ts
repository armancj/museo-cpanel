import { get, post, patch } from '@/adapter/httpAdapter';
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
    password:    string;
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
export interface UserActive {
    uuid:      string;
    active:      boolean;
}

export const UserService  =   {
    getUsers: async () => {
        return await post<UsersResponse>(WebEnvConst.user.getAll, {});
    },

    changeActivateUser: async (userActive: UserActive) => {
        const {uuid, active} = userActive;
        const url = WebEnvConst.user.changeActivate(uuid);
        return await patch<boolean>(url, { active });
    },

    createUser: async (user: UsersDatum) => {
        const {uuid, active, deleted, avatar, province:provinceData, municipal:municipalData, nationality: nationalityData, ...rest} = user;

        const province = (provinceData as unknown as addressResponse)?.name || 'Las Tunas'
        const nationality = (nationalityData as unknown as addressResponse)?.name || 'Cuba'
        const municipal = (municipalData as unknown as addressResponse)?.name || ''

        return await post<UsersDatum>(WebEnvConst.user.post, { nationality, municipal, province, ...rest });
    },
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
        return await get<addressResponse[]>(WebEnvConst.country);
    },
}
