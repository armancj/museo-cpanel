type TagSeverity = 'info' | 'success' | 'warning' | 'danger' | null | undefined;

export const toTagSeverity = (s: string | null | undefined): TagSeverity => {
    switch (s) {
        case 'info':
        case 'success':
        case 'warning':
        case 'danger':
            return s;
        case 'secondary':
        default:
            return undefined;
    }
};
