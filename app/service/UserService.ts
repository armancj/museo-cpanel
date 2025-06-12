import { post, patch, del, get } from '@/adapter/httpAdapter';
import { WebEnvConst } from '@/app/webEnvConst';

export interface UsersResponse {
    usersData:    UsersDatum[];
    totalPage:    number;
    totalElement: number;
}

export interface UploadedFile {
    id: string;
    nameFile: string;
    file?: string;
}

type FileMessage = {
    avatar: UploadedFile;
    message: string;
};

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
    id?:       string;
    nameFile?: string;
}


export interface UserActive {
    uuid:      string;
    active:      boolean;
}

export interface AddressResponse {
    name?:      string;
}


class UserCache {
    private cache = new Map<string, UsersDatum>();
    private cacheExpiry = new Map<string, number>();
    private readonly CACHE_DURATION = 5 * 60 * 1000;

    set(uuid: string, user: UsersDatum): void {
        this.cache.set(uuid, user);
        this.cacheExpiry.set(uuid, Date.now() + this.CACHE_DURATION);
    }

    get(uuid: string): UsersDatum | null {
        const expiry = this.cacheExpiry.get(uuid);
        if (!expiry || Date.now() > expiry) {
            this.cache.delete(uuid);
            this.cacheExpiry.delete(uuid);
            return null;
        }
        return this.cache.get(uuid) || null;
    }

    clear(): void {
        this.cache.clear();
        this.cacheExpiry.clear();
    }
}

const userCache = new UserCache();

export const UserService  =   {
    getUsers: async () => {
        return await post<UsersResponse>(WebEnvConst.user.getAll, {});
    },

    createUser: async (user: UsersDatum) => {
        const {uuid: string, active, deleted, avatar, province:provinceData, municipal:municipalData, nationality: nationalityData, ...rest} = user;

        const province = (provinceData as unknown as AddressResponse)?.name ?? 'Las Tunas'
        const nationality = (nationalityData as unknown as AddressResponse)?.name ?? 'Cuba'
        const municipal = (municipalData as unknown as AddressResponse)?.name ?? ''

        return await post<UsersDatum>(WebEnvConst.user.post, { nationality, municipal, province, ...rest });
    },

    updateUser: async (uuid: string, user: Partial<UsersDatum>) => {

        const url = WebEnvConst.user.getOne(uuid);

        return await patch<UsersDatum>(url, user);
    },

    deleteUser: async (uuid: string) =>  {
        const url = WebEnvConst.user.getOne(uuid);
        return await del<UsersDatum>(url);

    },
    uploadAvatar :async (uuid: string, file: File) => {
        const url = WebEnvConst.user.getOne(uuid)
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await post<FileMessage>(`${url}/avatar`,formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                } as any,

            );
            console.log("Avatar uploaded:", response);
            return response;
        } catch (error) {
            console.error("Error uploaded avatar:", error);
        }
    },


    getUserByUuid: async (uuid: string): Promise<UsersDatum | null> => {
        const cachedUser = userCache.get(uuid);
        if (cachedUser) {
            return cachedUser;
        }

        try {
            const url = WebEnvConst.user.getOne(uuid);
            const user = await get<UsersDatum>(url);

            userCache.set(uuid, user);

            return user;
        } catch (error) {
            console.error(`Error fetching user ${uuid}:`, error);
            return null;
        }
    },


    getUsersByUuids: async (uuids: string[]): Promise<Map<string, UsersDatum>> => {
        const result = new Map<string, UsersDatum>();
        const uncachedUuids: string[] = [];

        uuids.forEach(uuid => {
            const cachedUser = userCache.get(uuid);
            if (cachedUser) {
                result.set(uuid, cachedUser);
            } else {
                uncachedUuids.push(uuid);
            }
        });

        if (uncachedUuids.length > 0) {
            try {
                // Cargar de uno en uno (o en paralelo)
                const userPromises = uncachedUuids.map(uuid =>
                    UserService.getUserByUuid(uuid)
                );

                const users = await Promise.allSettled(userPromises);

                users.forEach((userResult, index) => {
                    if (userResult.status === 'fulfilled' && userResult.value) {
                        const uuid = uncachedUuids[index];
                        result.set(uuid, userResult.value);
                    }
                });
            } catch (error) {
                console.error('Error fetching multiple users:', error);
            }
        }

        return result;
    },

    getUserDisplayName: async (uuid: string): Promise<string> => {
        try {
            const user = await UserService.getUserByUuid(uuid);
            if (user) {
                return `${user.name} ${user.lastName}`;
            }
            return 'Usuario desconocido';
        } catch (error) {
            console.error(`Error getting display name for user ${uuid}:`, error);
            return 'Usuario desconocido';
        }
    },


    clearUserCache: (): void => {
        userCache.clear();
    },

    changeActivateUser: async (userActive: UserActive) => {
        const {uuid, active} = userActive;
        const url = WebEnvConst.user.changeActivate(uuid);
        const result = await patch<boolean>(url, { active });

        userCache.get(uuid) && userCache.clear();

        return result;
    },



};

