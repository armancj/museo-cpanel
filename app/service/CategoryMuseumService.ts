import { get, post, patch, del } from '@/adapter/httpAdapter';
import { WebEnvConst } from '@/app/webEnvConst';
import { MuseumCategories } from '@/app/(main)/pages/museum-categories/museum-categories';


export interface MuseumCategoriesResponse  extends  MuseumCategories{
    [key: string]: any;
    createdAt: Date;
    deleted:   boolean;
    updatedAt: Date;
    uuid:      string;
}
export const emptyCategoryMuseum: MuseumCategoriesResponse = {
    country: '',
    createdAt: new Date(Date.now()),
    deleted: false,
    updatedAt: new Date(Date.now()),
    uuid: '', active: false, description: '', name: ''
}

const validateRegisterBookSummaryData = (data: any): MuseumCategories | null => {
        return {
            name: data?.name,
            description: data?.description,
            active: data?.active,
        }
};

export const CategoryMuseumService  =   {

    get: async (institutionType?: string) => {
        let url = WebEnvConst.categoryMuseum.getAll;

        if (institutionType) {
            url = `${url}?institutionType=${institutionType}`;
        }

        return await get<MuseumCategoriesResponse[]>(url);
    },

    update: async (uuid: string, updated: Partial<MuseumCategories>)=> {
        const url = WebEnvConst.categoryMuseum.getOne(uuid);
        await patch<MuseumCategoriesResponse>(url, validateRegisterBookSummaryData(updated));
        return true;
    },

    create: async (data: MuseumCategories) =>{
        return await post<MuseumCategoriesResponse>(WebEnvConst.categoryMuseum.post, validateRegisterBookSummaryData(data))
    },

    delete: async (uuid: string) =>{
        const url = WebEnvConst.categoryMuseum.getOne(uuid);
        return await del<void>(url);
    },

    getOne: async (uuid: string) =>{
        const url = WebEnvConst.categoryMuseum.getOne(uuid);
        return await get<MuseumCategoriesResponse[]>(url);
    }
}
