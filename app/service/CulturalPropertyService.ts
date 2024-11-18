import { get, post, patch, del } from '@/adapter/httpAdapter';
import { CulturalPropertyModel } from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';
import { WebEnvConst } from '@/app/webEnvConst';

export const CulturalPropertyService = {
    getCulturalProperties: async () => {
        return await get<CulturalPropertyModel[]>(WebEnvConst.culturalProperty.getAll);
    }
};
