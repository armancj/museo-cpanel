

export const findOptionByValue = <T extends { [key: string]: any }>(
    options: T[],
    value: string,
    field: string = 'name'
): T | null => {
    if (!value || !options?.length) return null;
    return options.find(option => option[field] === value) || null;
};
