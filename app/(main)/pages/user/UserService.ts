import { post } from '@/adapter/httpAdapter';
import { WebEnvConst } from '@/app/webEnvConst';

export interface UsersResponse {
    usersData:    UsersDatum[];
    totalPage:    number;
    totalElement: number;
}

export interface UsersDatum {
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

export const UserService  =   {
    getUsers: async () => {
        return await post<UsersResponse>(WebEnvConst.user.getAll, {});
    }
};
