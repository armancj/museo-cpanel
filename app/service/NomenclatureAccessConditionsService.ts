import { get, post, patch, del } from '@/adapter/httpAdapter';
import { WebEnvConst } from '@/app/webEnvConst';
import {
    NomenclatureAccessConditionsModel
} from '@/app/(main)/pages/nomenclator-access-conditions/nomenclature-access-conditions.model';


export interface NomenclatureAccessConditionsResponse extends NomenclatureAccessConditionsModel{
    [key: string]: any;
    createdAt: Date;
    deleted:   boolean;
    updatedAt: Date;
    uuid:      string;
}
export const emptyNomenclatureAccessConditions: NomenclatureAccessConditionsResponse = {
    createdAt: new Date(Date.now()),
    deleted: false,
    updatedAt: new Date(Date.now()),
    uuid: '',
    description: '',
    type: '',
}

const validateRegisterBookSummaryData = (data: any): NomenclatureAccessConditionsModel | null => {
        return {
            type: data?.type,
            description: data?.description,
        }
};

export const NomenclatureAccessConditionsService  =   {

    get: async () => {
        let url = WebEnvConst.accessConditions.getAll;
        return await get<NomenclatureAccessConditionsResponse[]>(url);
    },

    update: async (uuid: string, updated: Partial<NomenclatureAccessConditionsModel>)=> {
        const url = WebEnvConst.accessConditions.getOne(uuid);
        await patch<NomenclatureAccessConditionsResponse>(url, validateRegisterBookSummaryData(updated));
        return true;
    },

    create: async (data: NomenclatureAccessConditionsModel) =>{
        return await post<NomenclatureAccessConditionsResponse>(WebEnvConst.accessConditions.post, validateRegisterBookSummaryData(data))
    },

    delete: async (uuid: string) =>{
        const url = WebEnvConst.accessConditions.getOne(uuid);
        return await del<void>(url);
    },

    getOne: async (uuid: string) =>{
        const url = WebEnvConst.accessConditions.getOne(uuid);
        return await get<NomenclatureAccessConditionsResponse[]>(url);
    }
}
