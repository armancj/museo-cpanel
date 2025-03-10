import { get, post, patch, del } from '@/adapter/httpAdapter';
import { WebEnvConst } from '@/app/webEnvConst';
import { DescriptionInstrumentsModel } from '@/app/(main)/pages/description-instruments/DescriptionInstrumentsModel';


export interface DescriptionInstrumentsResponse  extends  DescriptionInstrumentsModel {
    [key: string]: any;
    createdAt: Date;
    deleted:   boolean;
    updatedAt: Date;
    uuid:      string;
}
export const emptyDescriptionInstruments: DescriptionInstrumentsResponse = {
    country: '',
    createdAt: new Date(Date.now()),
    deleted: false,
    updatedAt: new Date(Date.now()),
    uuid: '', active: false,
    name: ''
}

const validateRegisterBookSummaryData = (data: any): DescriptionInstrumentsModel | null => {
        return {
            name: data?.name,
            active: data?.active,
        }
};

export const DescriptionInstrumentsService  =   {

    get: async () => {
        let url = WebEnvConst.descriptionInstruments.getAll;
        return await get<DescriptionInstrumentsResponse[]>(url);
    },

    update: async (uuid: string, updated: Partial<DescriptionInstrumentsModel>)=> {
        const url = WebEnvConst.descriptionInstruments.getOne(uuid);
        await patch<DescriptionInstrumentsResponse>(url, validateRegisterBookSummaryData(updated));
        return true;
    },

    create: async (data: DescriptionInstrumentsModel) =>{
        return await post<DescriptionInstrumentsResponse>(WebEnvConst.descriptionInstruments.post, validateRegisterBookSummaryData(data))
    },

    delete: async (uuid: string) =>{
        const url = WebEnvConst.descriptionInstruments.getOne(uuid);
        return await del<void>(url);
    },

    getOne: async (uuid: string) =>{
        const url = WebEnvConst.descriptionInstruments.getOne(uuid);
        return await get<DescriptionInstrumentsResponse[]>(url);
    }
}
