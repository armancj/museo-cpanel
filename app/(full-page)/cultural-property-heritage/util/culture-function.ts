import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

// Color principal del tema
export const primaryColor = '#926941';
export const lightBg = '#f5e9d9';
export const creamBg = '#f8f6f0';

// Utilidades para formateo
export const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return 'No especificado';
    const date = new Date(dateString);
    return isValid(date) ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: es }) : 'Fecha inválida';
};
