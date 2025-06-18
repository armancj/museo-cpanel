import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { CulturalHeritageProperty } from '@/app/(main)/pages/cultural-property-heritage/types';
import { CulturalPropertyService } from '@/app/service/CulturalPropertyService';
import { formatDate, primaryColor } from '@/app/(full-page)/cultural-property-heritage/util/culture-function';


export function useCulturalHeritageProperty() {
    const { uuid } = useParams();
    const [property, setProperty] = useState<CulturalHeritageProperty | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
    const [shareButtonState, setShareButtonState] = useState<{
        text: string;
        style: { background: string; color: string };
    }>({
        text: '📱 Compartir',
        style: { background: 'white', color: '#926941' }
    });

    const shareButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                setLoading(true);
                setError(null);

                if (typeof uuid !== 'string') {
                    throw new Error('UUID inválido');
                }

                const data = await CulturalPropertyService.getPublicCulturalProperty(uuid);
                setProperty(data);
            } catch (err) {
                console.error('Error fetching property:', err);
                setError('No se pudo cargar la información del bien patrimonial');
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [uuid]);



    const formatDateRange = (start: Date | undefined, end: Date | undefined) => {
        if (!start && !end) return 'No especificado';
        if (start && end) {
            const startFormatted = formatDate(start);
            const endFormatted = formatDate(end);
            if (startFormatted === endFormatted) return startFormatted;
            return `${startFormatted} - ${endFormatted}`;
        }
        return formatDate(start || end);
    };

    // Función para extraer valores de campos con estructura compleja
    const extractValue = (field: any) => {
        if (!field || typeof field !== 'object') return undefined;
        return field.value;
    };

    // Función para formatear ubicación física del objeto
    const formatObjectLocation = (locationField: any) => {
        const location = extractValue(locationField);
        if (!location || typeof location !== 'object') return 'No especificado';

        const parts = [];
        if (location.floor) parts.push(`Piso: ${location.floor}`);
        if (location.exhibitionRoom) parts.push(`Sala: ${location.exhibitionRoom}`);
        if (location.storage) parts.push(`Depósito: ${location.storage}`);
        if (location.showcaseShelf) parts.push(`Vitrina: ${location.showcaseShelf}`);
        if (location.shelfDrawer) parts.push(`Cajón: ${location.shelfDrawer}`);
        if (location.box) parts.push(`Caja: ${location.box}`);
        if (location.fileFolder) parts.push(`Carpeta: ${location.fileFolder}`);

        return parts.length > 0 ? parts.join(' • ') : 'No especificado';
    };

    // Función para formatear dimensiones
    const formatDimensionValue = (dimensionsField: any, dimension: string, unit: string) => {
        const dimensions = extractValue(dimensionsField);
        if (!dimensions || typeof dimensions !== 'object') return 'No especificado';

        const value = dimensions[dimension];
        if (typeof value === 'number' && value > 0) {
            return `${value} ${unit}`;
        }
        return value === 0 ? '0' : 'No especificado';
    };

    // Función para formatear cantidades
    const formatQuantityValue = (quantitiesField: any, quantity: string) => {
        const quantities = extractValue(quantitiesField);
        if (!quantities || typeof quantities !== 'object') return 'No especificado';

        const value = quantities[quantity];
        if (typeof value === 'number') {
            return value.toString();
        }
        return 'No especificado';
    };

    // Función para formatear arrays
    const formatArrayValue = (field: any) => {
        const arr = extractValue(field);
        if (!arr || !Array.isArray(arr) || arr.length === 0) return 'No especificado';
        return arr.join(', ');
    };

    // Función para formatear fechas extremas
    const formatExtremeDatesValue = (extremeDatesField: any) => {
        const dates = extractValue(extremeDatesField);
        if (!dates || typeof dates !== 'object') return 'No especificado';

        const start = dates.start ? formatDate(dates.start) : null;
        const end = dates.end ? formatDate(dates.end) : null;

        if (start && end) {
            return start === end ? start : `${start} - ${end}`;
        }
        return start || end || 'No especificado';
    };

    // Función para formatear booleanos
    const formatBooleanValue = (field: any) => {
        const value = extractValue(field);
        if (value === undefined || value === null) return 'No especificado';
        return value ? 'Sí' : 'No';
    };

    // Función para manejar el compartir
    const handleShare = async () => {
        const shareData = {
            title: extractValue(property?.culturalRecord?.objectTitle) || 'Ficha Patrimonial',
            text: `📋 ${extractValue(property?.culturalRecord?.objectTitle) || 'Documento Patrimonial'}\n\n${extractValue(property?.culturalRecord?.objectDescription) || 'Ver información completa del bien patrimonial'}`,
            url: window.location.href
        };

        try {
            // Verificar si el dispositivo soporta Web Share API
            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                // Fallback: copiar al portapapeles
                const textToShare = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
                await navigator.clipboard.writeText(textToShare);

                // Mostrar mensaje de confirmación
                setShareButtonState({
                    text: '✅ Copiado',
                    style: { background: '#48bb78', color: 'white' }
                });

                setTimeout(() => {
                    setShareButtonState({
                        text: '📱 Compartir',
                        style: { background: 'white', color: primaryColor }
                    });
                }, 2000);
            }
        } catch (error) {
            console.log('Error sharing:', error);
            // Fallback en caso de error
            try {
                await navigator.clipboard.writeText(window.location.href);
                setShareButtonState({
                    text: '📋 Copiado',
                    style: { background: '#48bb78', color: 'white' }
                });
                setTimeout(() => {
                    setShareButtonState({
                        text: '📱 Compartir',
                        style: { background: 'white', color: primaryColor }
                    });
                }, 2000);
            } catch (clipboardError) {
                console.log('Clipboard also failed:', clipboardError);
            }
        }
    };
    return {
        property,
        loading,
        error,
        activeIndex,
        setActiveIndex,
        shareButtonState,
        shareButtonRef,
        formatDateRange,
        formatDate,
        extractValue,
        formatObjectLocation,
        formatDimensionValue,
        formatQuantityValue,
        formatArrayValue,
        formatExtremeDatesValue,
        formatBooleanValue,
        handleShare
    };
}
