import { get, post, patch, del } from '@/adapter/httpAdapter';
import { WebEnvConst } from '@/app/webEnvConst';
import { AddressResponse } from '@/app/service/UserService';

export interface InstitutionResponse {
    [key: string]: any;
    createdAt: Date;
    deleted:   boolean;
    updatedAt: Date;
    uuid:      string;
    name:      string;
    street:          string;
    number:          string;
    referenceCode:   string;
    betweenStreet1:  string;
    betweenStreet2:  string;
    district:        string;
    locality:        string;
    province:        string;
    municipality:    string;
    country:         string;
    phone1:          string;
    phone2:          string;
    email:           string;
    website:         string;
    institutionType: string;
    classification:  string;
    typology:        string;
    category:        string;
}

export const emptyInstitution: InstitutionResponse = {
    name: '',
    street: '',
    number: '',
    referenceCode: '',
    betweenStreet1: '',
    betweenStreet2: '',
    district: '',
    locality: '',
    province: '',
    municipality: '',
    country: '',
    phone1: '',
    phone2: '',
    email: '',
    website: '',
    institutionType: '',
    classification: '',
    typology: '',
    category: '',
    createdAt: new Date(Date.now()),
    deleted: false,
    updatedAt: new Date(Date.now()),
    uuid: ''
};

export const InstitutionService = {
    getInstitutions: async ({name}: AddressResponse = {}) => {
        let url = WebEnvConst.institution.getAll;
        if(name) url = `${url}?country=${name}`;
        return await get<InstitutionResponse[]>(url);
    },
    async updateInstitution(uuid: string, updated: Omit<InstitutionResponse, 'uuid' | 'deleted'>) {
        const url = WebEnvConst.institution.getOne(uuid);
        const {name, country, street, number, referenceCode, betweenStreet1, betweenStreet2, district, locality, province, municipality, phone1, phone2, email, website, institutionType, classification, typology, category} = updated;
        return await patch<InstitutionResponse[]>(url, {name, country, street, number, referenceCode, betweenStreet1, betweenStreet2, district, locality, province, municipality, phone1, phone2, email, website, institutionType, classification, typology, category});
    },
    async create(data: InstitutionResponse) {

        const {name, country, street, number, referenceCode, betweenStreet1, betweenStreet2, district, locality, province, municipality, phone1, phone2, email, website, institutionType, classification, typology, category} = data;
        console.log({name, country, street, number, referenceCode, betweenStreet1, betweenStreet2, district, locality, province, municipality, phone1, phone2, email, website, institutionType, classification, typology, category});
        return await post<InstitutionResponse>(WebEnvConst.institution.post, {name, country, street, number, referenceCode, betweenStreet1, betweenStreet2, district, locality, province, municipality, phone1, phone2, email, website, institutionType, classification, typology, category});
    },
    async deleteInstitution(uuid: string) {
        const url = WebEnvConst.institution.getOne(uuid);
        return await del<InstitutionResponse[]>(url);
    }
};
