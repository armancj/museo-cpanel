import { SectionResponse, SectionService, emptySection } from '@/app/service/SectionService';
import { capitalize } from '@/app/(main)/pages/util/export.functions';
import { useGenericHook } from '@/app/common/hooks/useGenericHook';


export const useHookSection = () => {
    return useGenericHook<SectionResponse>({
        service: {
            fetchAll: SectionService.getSections,
            create: SectionService.createSection,
            update: SectionService.updateSection,
            delete: SectionService.deleteSection,
            emptyItem: emptySection,
        },
        capitalizeFunc: capitalize,
        messages: {
            createSuccess: 'Sección creada satisfactoriamente',
            updateSuccess: 'Sección actualizada satisfactoriamente',
            deleteSuccess: 'Sección eliminada',
            errorDefault: 'No se pudo completar la operación',
        },
    });
};
