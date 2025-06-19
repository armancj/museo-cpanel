// utils/objectUtils.ts
interface FilterOptions {
    removeEmptyStrings?: boolean;
    removeEmptyArrays?: boolean;
    removeNullUndefined?: boolean;
    removeZero?: boolean;
    excludeFields?: string[];
    includeOnlyFields?: string[];
}

export const removeEmptyFields = <T extends Record<string, any>>(
    obj: T,
    options: FilterOptions = {}
): Partial<T> => {
    const {
        removeEmptyStrings = true,
        removeEmptyArrays = true,
        removeNullUndefined = true,
        removeZero = false,
        excludeFields = [],
        includeOnlyFields = []
    } = options;

    return Object.fromEntries(
        Object.entries(obj).filter(([key, value]) => {
            if (includeOnlyFields.length > 0 && !includeOnlyFields.includes(key)) {
                return false;
            }
            if (excludeFields.includes(key)) {
                return false;
            }

            if (removeNullUndefined && (value === null || value === undefined)) return false;
            if (removeEmptyStrings && typeof value === 'string' && value.trim() === '') return false;
            if (removeEmptyArrays && Array.isArray(value) && value.length === 0) return false;
            return !(removeZero && value === 0);
        })
    ) as Partial<T>;
};
