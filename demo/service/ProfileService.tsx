import { get } from '@/adapter/httpAdapter';
import { WebEnvConst } from '@/app/webEnvConst';

export interface UserProfile {
    uuid: string;
    mobile: string;
    municipal: string;
    email: string;
    address: string;
    lastName: string;
    name: string;
    nationality: string;
    province: string;
    avatar: any;
    roles: string;
    passwordHashed: string;
    active: boolean;
    deleted: boolean;
    institutionId: string;
    institution?: {
        betweenStreet1: string;
        betweenStreet2: string;
        category: string;
        classification: string;
        country: string;
        createdAt: string;
        deleted: boolean;
        district: string;
        email: string;
        institutionType: string;
        locality: string;
        municipality: string;
        name: string;
        number: string;
        phone1: string;
        phone2: string;
        province: string;
        referenceCode: string;
        street: string;
        typology: string;
        updatedAt: string;
        uuid: string;
        website: string;
    };
}

export const ProfileService = {
    /**
     * Get the current user's profile
     * @returns A promise that resolves to the user profile
     */
    getProfile: async (): Promise<UserProfile> => {
        return await get<UserProfile>(WebEnvConst.auth.profile);
    }
};
