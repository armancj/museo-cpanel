import { ValueGradeResponse, ValueGradeService, emptyValueGrade } from '@/app/service/ValueGradeService';
import { capitalize } from '@/app/(main)/pages/util/export.functions';
import { useGenericHook } from '@/app/common/hooks/useGenericHook';


export const useHookValueGrade = () => {
    return useGenericHook<ValueGradeResponse>({
        service: {
            fetchAll: ValueGradeService.getValueGrades,
            create: ValueGradeService.createValueGrade,
            update: ValueGradeService.updateValueGrade,
            delete: ValueGradeService.deleteValueGrade,
            emptyItem: emptyValueGrade,
        },
        capitalizeFunc: capitalize,
        messages: {
            createSuccess: 'Grado de valor creado satisfactoriamente',
            updateSuccess: 'Grado de valor actualizado satisfactoriamente',
            deleteSuccess: 'Grado de valor eliminado',
            errorDefault: 'No se pudo completar la operación',
        },
    });
};
