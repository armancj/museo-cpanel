import { get, post, patch, del } from '@/adapter/httpAdapter';
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


export interface UserActive {
    uuid:      string;
    active:      boolean;
}

export interface AddressResponse {
    name?:      string;
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
        const {uuid: string, active, deleted, avatar, province:provinceData, municipal:municipalData, nationality: nationalityData, ...rest} = user;

        const province = (provinceData as unknown as AddressResponse)?.name || 'Las Tunas'
        const nationality = (nationalityData as unknown as AddressResponse)?.name || 'Cuba'
        const municipal = (municipalData as unknown as AddressResponse)?.name || ''

        return await post<UsersDatum>(WebEnvConst.user.post, { nationality, municipal, province, ...rest });
    },

    updateUser: async (uuid: string, user: Partial<UsersDatum>) => {

        const url = WebEnvConst.user.getOne(uuid);

        return await patch<UsersDatum>(url, user);
    },
    deleteUser: async (uuid: string) =>  {
        const url = WebEnvConst.user.getOne(uuid);
        return await del<UsersDatum>(url);

    }
};

