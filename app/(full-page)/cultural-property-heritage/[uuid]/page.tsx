'use client';
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { CulturalHeritageProperty } from '@/app/(main)/pages/cultural-property-heritage/types';
import { CulturalPropertyService } from '@/app/service/CulturalPropertyService';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Skeleton } from 'primereact/skeleton';
import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

export default function PublicCulturalHeritagePropertyPage() {
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

    // Color principal del tema
    const primaryColor = '#926941';
    const lightBg = '#f5e9d9';
    const creamBg = '#f8f6f0';

    // Utilidades para formateo
    const formatDate = (dateString: string | Date | undefined) => {
        if (!dateString) return 'No especificado';
        const date = new Date(dateString);
        return isValid(date) ? format(date, 'dd \'de\' MMMM \'de\' yyyy', { locale: es }) : 'Fecha inválida';
    };

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

    // Función para renderizar el encabezado
    const HeritagePropertyHeader = (lightBg: string, creamBg: string, primaryColor: string, property: CulturalHeritageProperty | null) => {
        return (
            <div style={{
                padding: '1rem',
                background: `linear-gradient(135deg, ${lightBg} 0%, ${creamBg} 100%)`,
                color: '#2d3748',
                borderBottom: `3px solid ${primaryColor}30`
            }}>
                {/* Línea superior con badges */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.75rem',
                    fontSize: '0.75rem'
                }}>
                    <span style={{
                        background: primaryColor,
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '8px',
                        fontWeight: 600
                    }}>
                        FICHA PATRIMONIAL
                    </span>
                    <span style={{
                        color: '#666',
                        fontSize: '0.7rem'
                    }}>
                        ID: {property?.uuid?.slice(0, 8)}
                    </span>
                </div>

                {/* Título principal */}
                <h1 style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    lineHeight: 1.3,
                    margin: '0 0 0.5rem 0',
                    color: primaryColor
                }}>
                    {extractValue(property?.culturalRecord?.objectTitle) || 'Título no especificado'}
                </h1>

                {/* Tipo de patrimonio */}
                {extractValue(property?.entryAndLocation?.heritageType) && (
                    <div style={{
                        fontSize: '0.8rem',
                        color: '#666',
                        marginBottom: '0.75rem'
                    }}>
                        📋 {extractValue(property?.entryAndLocation?.heritageType)}
                    </div>
                )}

                {/* Botones de acción */}
                <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    fontSize: '0.8rem'
                }}>
                    <button
                        onClick={() => window.print()}
                        style={{
                            background: 'white',
                            border: `1px solid ${primaryColor}40`,
                            color: primaryColor,
                            padding: '0.4rem 0.8rem',
                            borderRadius: '15px',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            fontWeight: 500,
                            boxShadow: `0 2px 4px ${primaryColor}15`
                        }}
                    >
                        🖨️ Imprimir
                    </button>
                    <button
                        ref={shareButtonRef}
                        onClick={handleShare}
                        style={{
                            background: shareButtonState.style.background,
                            border: `1px solid ${primaryColor}40`,
                            color: shareButtonState.style.color,
                            padding: '0.4rem 0.8rem',
                            borderRadius: '15px',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            fontWeight: 500,
                            boxShadow: `0 2px 4px ${primaryColor}15`,
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {shareButtonState.text}
                    </button>
                </div>
            </div>
        );
    };

    // Componente para renderizar campos elegantes
    const FieldDisplay = ({
                              label,
                              value,
                              type = 'text',
                              isArray = false,
                              className = '',
                              icon
                          }: {
        label: string;
        value: any;
        type?: 'text' | 'number' | 'date' | 'boolean';
        isArray?: boolean;
        className?: string;
        icon?: string;
    }) => {
        const displayValue = () => {
            if (value === undefined || value === null || value === '') return 'No especificado';

            if (isArray && Array.isArray(value)) {
                return value.length > 0 ? value.join(', ') : 'No especificado';
            }

            switch (type) {
                case 'date':
                    return formatDate(value);
                case 'boolean':
                    return value ? 'Sí' : 'No';
                case 'number':
                    return value === 0 ? '0' : (value || 'No especificado');
                default:
                    return value || 'No especificado';
            }
        };

        const isEmpty = !value || (isArray && Array.isArray(value) && value.length === 0) || value === '';

        return (
            <div
                className={`${className}`}
                style={{
                    marginBottom: '1.5rem',
                    padding: '1rem',
                    borderRadius: '8px',
                    background: isEmpty ? '#f8f9fa' : creamBg,
                    border: `1px solid ${primaryColor}30`,
                    transition: 'all 0.3s ease',
                    opacity: isEmpty ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 4px 12px ${primaryColor}25`;
                    e.currentTarget.style.borderColor = primaryColor;
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = `${primaryColor}30`;
                }}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                    fontWeight: 600,
                    color: primaryColor,
                    fontSize: '0.9rem'
                }}>
                    {icon && <i className={`${icon}`} style={{ color: primaryColor, fontSize: '0.9rem', marginRight: '0.5rem' }}></i>}
                    <span>{label}</span>
                </div>
                <div style={{
                    color: '#4a5568',
                    lineHeight: 1.5,
                    fontSize: '0.95rem'
                }}>
                    {displayValue()}
                </div>
            </div>
        );
    };

    // Skeleton de carga
    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: `linear-gradient(135deg, ${lightBg} 0%, #F5F5DC 50%, ${creamBg} 100%)`,
                padding: '2rem 1rem',
                fontFamily: 'Inter, Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    background: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: `0 10px 40px ${primaryColor}20`,
                    overflow: 'hidden',
                    border: `1px solid ${primaryColor}15`
                }}>
                    <div style={{
                        padding: '3rem',
                        background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
                        color: 'white'
                    }}>
                        <Skeleton width="300px" height="2rem" className="mb-2" />
                        <Skeleton width="100%" height="3rem" className="mb-3" />
                        <Skeleton width="70%" height="1.5rem" className="mb-4" />
                    </div>
                    <div style={{ padding: '2rem' }}>
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} width="100%" height="8rem" className="mb-3" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div style={{
                minHeight: '100vh',
                background: `linear-gradient(135deg, ${lightBg} 0%, ${creamBg} 100%)`,
                padding: '2rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    textAlign: 'center',
                    background: 'white',
                    padding: '3rem',
                    borderRadius: '16px',
                    boxShadow: `0 10px 40px ${primaryColor}20`,
                    maxWidth: '400px'
                }}>
                    <div style={{
                        fontSize: '3rem',
                        color: primaryColor,
                        marginBottom: '1rem'
                    }}>
                        <i className="pi pi-exclamation-triangle"></i>
                    </div>
                    <h2 style={{ color: primaryColor, marginBottom: '1rem' }}>Documento no encontrado</h2>
                    <p style={{ color: '#666', marginBottom: '2rem' }}>
                        {error || 'El bien patrimonial solicitado no existe o no está disponible'}
                    </p>
                    <Button
                        label="Volver al inicio"
                        icon="pi pi-home"
                        onClick={() => window.location.href = '/landing'}
                        style={{
                            backgroundColor: primaryColor,
                            border: 'none',
                            color: 'white',
                            fontWeight: 600,
                            padding: '0.75rem 1.5rem',
                            borderRadius: '25px'
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            padding: '2rem 1rem',
            fontFamily: 'Inter, Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                background: '#ffffff',
                borderRadius: '16px',
                boxShadow: `0 10px 40px ${primaryColor}20`,
                overflow: 'hidden',
                border: `1px solid ${primaryColor}15`
            }}>
                {HeritagePropertyHeader(lightBg, creamBg, primaryColor, property)}

                <Divider style={{ margin: 0, borderColor: `${primaryColor}20` }} />

                {/* Contenido del documento */}
                <div style={{ padding: '2rem 3rem' }}>
                    <Accordion
                        multiple
                        activeIndex={activeIndex}
                        onTabChange={(e) => setActiveIndex(e.index as number[])}
                        style={{ border: 'none' }}
                    >

                        {/* 1. Registro Cultural */}
                        <AccordionTab
                            header={
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
                                    <div style={{
                                        width: '3rem',
                                        height: '3rem',
                                        background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}bb 100%)`,
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '1.2rem'
                                    }}>
                                        <i className="pi pi-book"></i>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <span style={{
                                            display: 'block',
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            color: primaryColor,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>01</span>
                                        <span style={{
                                            display: 'block',
                                            fontSize: '1.1rem',
                                            fontWeight: 600,
                                            color: '#2d3748',
                                            margin: '0.2rem 0'
                                        }}>Registro Cultural</span>
                                        <span style={{
                                            fontSize: '0.9rem',
                                            color: '#718096'
                                        }}>Información básica y descriptores</span>
                                    </div>
                                </div>
                            }
                            style={{
                                border: 'none',
                                marginBottom: '1rem',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                boxShadow: `0 4px 12px ${primaryColor}15`
                            }}
                        >
                            <div style={{ padding: '2rem', background: lightBg }}>
                                <div className="grid">
                                    <div className="col-12 lg:col-6">
                                        <Panel
                                            header={
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <i className="pi pi-bookmark" style={{ color: primaryColor }}></i>
                                                    <span>Información Básica</span>
                                                </div>
                                            }
                                            style={{
                                                background: 'white',
                                                border: 'none',
                                                borderRadius: '12px',
                                                boxShadow: `0 2px 8px ${primaryColor}10`,
                                                marginBottom: '1.5rem'
                                            }}
                                        >
                                            <FieldDisplay
                                                label="Título del Objeto"
                                                value={extractValue(property.culturalRecord?.objectTitle)}
                                                icon="pi pi-bookmark"
                                            />
                                            <FieldDisplay
                                                label="Descripción"
                                                value={extractValue(property.culturalRecord?.objectDescription)}
                                                icon="pi pi-align-left"
                                            />
                                            <FieldDisplay
                                                label="Título de Fondo"
                                                value={extractValue(property.culturalRecord?.backgroundTitle)}
                                                icon="pi pi-folder"
                                            />
                                            <FieldDisplay
                                                label="Título de Sección"
                                                value={extractValue(property.culturalRecord?.sectionTitle)}
                                                icon="pi pi-folder-open"
                                            />
                                        </Panel>
                                    </div>

                                    <div className="col-12 lg:col-6">
                                        <Panel
                                            header={
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <i className="pi pi-tags" style={{ color: primaryColor }}></i>
                                                    <span>Descriptores</span>
                                                </div>
                                            }
                                            style={{
                                                background: 'white',
                                                border: 'none',
                                                borderRadius: '12px',
                                                boxShadow: `0 2px 8px ${primaryColor}10`,
                                                marginBottom: '1.5rem'
                                            }}
                                        >
                                            <FieldDisplay
                                                label="Descriptores Onomásticos"
                                                value={extractValue(property.culturalRecord?.onomasticDescriptors)}
                                                icon="pi pi-user"
                                            />
                                            <FieldDisplay
                                                label="Descriptores Geográficos"
                                                value={extractValue(property.culturalRecord?.geographicDescriptors)}
                                                icon="pi pi-map-marker"
                                            />
                                            <FieldDisplay
                                                label="Descriptores Institucionales"
                                                value={extractValue(property.culturalRecord?.institutionalDescriptors)}
                                                icon="pi pi-building"
                                            />
                                            <FieldDisplay
                                                label="Descriptores de Materia"
                                                value={extractValue(property.culturalRecord?.subjectDescriptors)}
                                                icon="pi pi-tags"
                                            />
                                        </Panel>
                                    </div>

                                    <div className="col-12">
                                        <Panel
                                            header={
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <i className="pi pi-chart-bar" style={{ color: primaryColor }}></i>
                                                    <span>Información Técnica</span>
                                                </div>
                                            }
                                            style={{
                                                background: 'white',
                                                border: 'none',
                                                borderRadius: '12px',
                                                boxShadow: `0 2px 8px ${primaryColor}10`,
                                                marginBottom: '1.5rem'
                                            }}
                                        >
                                            <div className="grid">
                                                <div className="col-12 md:col-6 lg:col-3">
                                                    <FieldDisplay
                                                        label="Fechas Extremas"
                                                        value={formatExtremeDatesValue(property.culturalRecord?.extremeDates)}
                                                        icon="pi pi-calendar-times"
                                                    />
                                                </div>
                                                <div className="col-12 md:col-6 lg:col-3">
                                                    <FieldDisplay
                                                        label="Grado de Valor"
                                                        value={extractValue(property.culturalRecord?.valueGrade)}
                                                        icon="pi pi-star"
                                                    />
                                                </div>
                                                <div className="col-12 md:col-6 lg:col-3">
                                                    <FieldDisplay
                                                        label="Nivel de Descripción"
                                                        value={extractValue(property.culturalRecord?.descriptionLevel)}
                                                        type="number"
                                                        icon="pi pi-chart-bar"
                                                    />
                                                </div>
                                                <div className="col-12 md:col-6 lg:col-3">
                                                    <FieldDisplay
                                                        label="Valoración"
                                                        value={extractValue(property.culturalRecord?.valuation)}
                                                        type="number"
                                                        icon="pi pi-dollar"
                                                    />
                                                </div>
                                            </div>
                                        </Panel>
                                    </div>

                                    {/* Características Físicas */}
                                    {property.culturalRecord?.dimensions && (
                                        <div className="col-12 lg:col-6">
                                            <Panel
                                                header={
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem'
                                                    }}>
                                                        <i className="pi pi-arrows-v"
                                                           style={{ color: primaryColor }}></i>
                                                        <span>Características Físicas</span>
                                                    </div>
                                                }
                                                style={{
                                                    background: 'white',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    boxShadow: `0 2px 8px ${primaryColor}10`,
                                                    marginBottom: '1.5rem'
                                                }}
                                            >
                                                <div className="grid">
                                                    <div className="col-6">
                                                        <FieldDisplay
                                                            label="Altura"
                                                            value={formatDimensionValue(property.culturalRecord?.dimensions, 'heightCms', 'cm')}
                                                            icon="pi pi-arrows-v"
                                                        />
                                                    </div>
                                                    <div className="col-6">
                                                        <FieldDisplay
                                                            label="Ancho"
                                                            value={formatDimensionValue(property.culturalRecord?.dimensions, 'widthCms', 'cm')}
                                                            icon="pi pi-arrows-h"
                                                        />
                                                    </div>
                                                    <div className="col-6">
                                                        <FieldDisplay
                                                            label="Largo"
                                                            value={formatDimensionValue(property.culturalRecord?.dimensions, 'lengthCms', 'cm')}
                                                            icon="pi pi-arrows-h"
                                                        />
                                                    </div>
                                                    <div className="col-6">
                                                        <FieldDisplay
                                                            label="Peso"
                                                            value={formatDimensionValue(property.culturalRecord?.dimensions, 'weightKg', 'kg')}
                                                            icon="pi pi-circle"
                                                        />
                                                    </div>
                                                    <div className="col-6">
                                                        <FieldDisplay
                                                            label="Volumen Cúbico"
                                                            value={formatDimensionValue(property.culturalRecord?.dimensions, 'cubicMeters', 'm³')}
                                                            icon="pi pi-box"
                                                        />
                                                    </div>
                                                    <div className="col-6">
                                                        <FieldDisplay
                                                            label="Área"
                                                            value={formatDimensionValue(property.culturalRecord?.dimensions, 'squareMeters', 'm²')}
                                                            icon="pi pi-expand"
                                                        />
                                                    </div>
                                                </div>
                                            </Panel>
                                        </div>
                                    )}

                                    {/* Cantidades y Volúmenes */}
                                    {property.culturalRecord?.volumesQuantities && (
                                        <div className="col-12 lg:col-6">
                                            <Panel
                                                header={
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem'
                                                    }}>
                                                        <i className="pi pi-file" style={{ color: primaryColor }}></i>
                                                        <span>Cantidades y Volúmenes</span>
                                                    </div>
                                                }
                                                style={{
                                                    background: 'white',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    boxShadow: `0 2px 8px ${primaryColor}10`,
                                                    marginBottom: '1.5rem'
                                                }}
                                            >
                                                <div className="grid">
                                                    <div className="col-6">
                                                        <FieldDisplay
                                                            label="Expedientes"
                                                            value={formatQuantityValue(property.culturalRecord?.volumesQuantities, 'file')}
                                                            icon="pi pi-file"
                                                        />
                                                    </div>
                                                    <div className="col-6">
                                                        <FieldDisplay
                                                            label="Páginas"
                                                            value={formatQuantityValue(property.culturalRecord?.volumesQuantities, 'pages')}
                                                            icon="pi pi-file-o"
                                                        />
                                                    </div>
                                                    <div className="col-6">
                                                        <FieldDisplay
                                                            label="Libros"
                                                            value={formatQuantityValue(property.culturalRecord?.volumesQuantities, 'books')}
                                                            icon="pi pi-book"
                                                        />
                                                    </div>
                                                    <div className="col-6">
                                                        <FieldDisplay
                                                            label="Objetos"
                                                            value={formatQuantityValue(property.culturalRecord?.volumesQuantities, 'objects')}
                                                            icon="pi pi-box"
                                                        />
                                                    </div>
                                                    <div className="col-6">
                                                        <FieldDisplay
                                                            label="Fotografías"
                                                            value={formatQuantityValue(property.culturalRecord?.volumesQuantities, 'photos')}
                                                            icon="pi pi-camera"
                                                        />
                                                    </div>
                                                    <div className="col-6">
                                                        <FieldDisplay
                                                            label="Grabados"
                                                            value={formatQuantityValue(property.culturalRecord?.volumesQuantities, 'engravings')}
                                                            icon="pi pi-image"
                                                        />
                                                    </div>
                                                    <div className="col-6">
                                                        <FieldDisplay
                                                            label="Diapositivas"
                                                            value={formatQuantityValue(property.culturalRecord?.volumesQuantities, 'slides')}
                                                            icon="pi pi-images"
                                                        />
                                                    </div>
                                                    <div className="col-6">
                                                        <FieldDisplay
                                                            label="Negativos"
                                                            value={formatQuantityValue(property.culturalRecord?.volumesQuantities, 'negatives')}
                                                            icon="pi pi-eye-slash"
                                                        />
                                                    </div>
                                                    <div className="col-12">
                                                        <FieldDisplay
                                                            label="Mapas, Planos y Croquis"
                                                            value={formatQuantityValue(property.culturalRecord?.volumesQuantities, 'mapsPlansSketches')}
                                                            icon="pi pi-map"
                                                        />
                                                    </div>
                                                </div>
                                            </Panel>
                                        </div>
                                    )}

                                    {/* Información de Idiomas y Soportes */}
                                    <div className="col-12">
                                        <Panel
                                            header={
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <i className="pi pi-language" style={{ color: primaryColor }}></i>
                                                    <span>Características del Material</span>
                                                </div>
                                            }
                                            style={{
                                                background: 'white',
                                                border: 'none',
                                                borderRadius: '12px',
                                                boxShadow: `0 2px 8px ${primaryColor}10`,
                                                marginBottom: '1.5rem'
                                            }}
                                        >
                                            <div className="grid">
                                                <div className="col-12 md:col-6 lg:col-3">
                                                    <FieldDisplay
                                                        label="Idiomas"
                                                        value={formatArrayValue(property.culturalRecord?.languages)}
                                                        icon="pi pi-globe"
                                                    />
                                                </div>
                                                <div className="col-12 md:col-6 lg:col-3">
                                                    <FieldDisplay
                                                        label="Soportes"
                                                        value={formatArrayValue(property.culturalRecord?.supports)}
                                                        icon="pi pi-file"
                                                    />
                                                </div>
                                                <div className="col-12 md:col-6 lg:col-3">
                                                    <FieldDisplay
                                                        label="Letras"
                                                        value={formatArrayValue(property.culturalRecord?.letters)}
                                                        icon="pi pi-font"
                                                    />
                                                </div>
                                                <div className="col-12 md:col-6 lg:col-3">
                                                    <FieldDisplay
                                                        label="Estado de Conservación"
                                                        value={formatArrayValue(property.culturalRecord?.conservationState)}
                                                        icon="pi pi-shield"
                                                    />
                                                </div>
                                                <div className="col-12">
                                                    <FieldDisplay
                                                        label="Instrumentos de Descripción"
                                                        value={formatArrayValue(property.culturalRecord?.descriptionInstrument)}
                                                        icon="pi pi-search"
                                                    />
                                                </div>
                                            </div>
                                        </Panel>
                                    </div>
                                </div>
                            </div>
                        </AccordionTab>

                        {/* 2. Entrada y Localización */}
                        <AccordionTab
                            header={
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
                                    <div style={{
                                        width: '3rem',
                                        height: '3rem',
                                        background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}bb 100%)`,
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '1.2rem'
                                    }}>
                                        <i className="pi pi-map-marker"></i>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <span style={{
                                            display: 'block',
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            color: primaryColor,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>02</span>
                                        <span style={{
                                            display: 'block',
                                            fontSize: '1.1rem',
                                            fontWeight: 600,
                                            color: '#2d3748',
                                            margin: '0.2rem 0'
                                        }}>Entrada y Localización</span>
                                        <span style={{
                                            fontSize: '0.9rem',
                                            color: '#718096'
                                        }}>Ubicación y forma de ingreso</span>
                                    </div>
                                </div>
                            }
                            style={{
                                border: 'none',
                                marginBottom: '1rem',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                boxShadow: `0 4px 12px ${primaryColor}15`
                            }}
                        >
                            <div style={{ padding: '2rem', background: lightBg }}>
                                <div className="grid">
                                    <div className="col-12 lg:col-6">
                                        <Panel
                                            header={
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <i className="pi pi-home" style={{ color: primaryColor }}></i>
                                                    <span>Información de Entrada</span>
                                                </div>
                                            }
                                            style={{
                                                background: 'white',
                                                border: 'none',
                                                borderRadius: '12px',
                                                boxShadow: `0 2px 8px ${primaryColor}10`,
                                                marginBottom: '1.5rem'
                                            }}
                                        >
                                            <FieldDisplay
                                                label="Fecha de Ingreso"
                                                value={extractValue(property.entryAndLocation?.entryDate)}
                                                type="date"
                                                icon="pi pi-calendar"
                                            />
                                            <FieldDisplay
                                                label="Tipo de Patrimonio"
                                                value={extractValue(property.entryAndLocation?.heritageType)}
                                                icon="pi pi-star"
                                            />
                                            <FieldDisplay
                                                label="Método de Entrada"
                                                value={extractValue(property.entryAndLocation?.entryMethod)}
                                                icon="pi pi-sign-in"
                                            />
                                            <FieldDisplay
                                                label="Tipo de Declaración"
                                                value={extractValue(property.entryAndLocation?.declarationType)}
                                                icon="pi pi-list"
                                            />
                                        </Panel>
                                    </div>

                                    <div className="col-12 lg:col-6">
                                        <Panel
                                            header={
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <i className="pi pi-map" style={{ color: primaryColor }}></i>
                                                    <span>Identificación y Ubicación</span>
                                                </div>
                                            }
                                            style={{
                                                background: 'white',
                                                border: 'none',
                                                borderRadius: '12px',
                                                boxShadow: `0 2px 8px ${primaryColor}10`,
                                                marginBottom: '1.5rem'
                                            }}
                                        >
                                            <FieldDisplay
                                                label="Nombre del Objeto"
                                                value={extractValue(property.entryAndLocation?.objectName)}
                                                icon="pi pi-tag"
                                            />
                                            <FieldDisplay
                                                label="Número de Inventario"
                                                value={extractValue(property.entryAndLocation?.inventoryNumber)}
                                                icon="pi pi-hashtag"
                                            />
                                            <FieldDisplay
                                                label="Clasificación Genérica"
                                                value={extractValue(property.entryAndLocation?.genericClassification)}
                                                icon="pi pi-code"
                                            />
                                            <FieldDisplay
                                                label="Tipo de Institución"
                                                value={extractValue(property.entryAndLocation?.institutionType)}
                                                icon="pi pi-building"
                                            />
                                        </Panel>
                                    </div>

                                    <div className="col-12">
                                        <Panel
                                            header={
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <i className="pi pi-map-marker" style={{ color: primaryColor }}></i>
                                                    <span>Ubicación Física</span>
                                                </div>
                                            }
                                            style={{
                                                background: 'white',
                                                border: 'none',
                                                borderRadius: '12px',
                                                boxShadow: `0 2px 8px ${primaryColor}10`,
                                                marginBottom: '1.5rem'
                                            }}
                                        >
                                            <div className="grid">
                                                <div className="col-12 lg:col-6">
                                                    <FieldDisplay
                                                        label="Localización"
                                                        value={formatObjectLocation(property.entryAndLocation?.objectLocation)}
                                                        icon="pi pi-map-marker"
                                                    />
                                                </div>
                                                <div className="col-12 lg:col-3">
                                                    <FieldDisplay
                                                        label="Inventario Auxiliar"
                                                        value={formatBooleanValue(property.entryAndLocation?.auxiliaryInventory)}
                                                        icon="pi pi-check-square"
                                                    />
                                                </div>
                                                <div className="col-12 lg:col-3">
                                                    <FieldDisplay
                                                        label="Inventario de Piezas"
                                                        value={formatBooleanValue(property.entryAndLocation?.pieceInventory)}
                                                        icon="pi pi-check-square"
                                                    />
                                                </div>
                                                <div className="col-12">
                                                    <FieldDisplay
                                                        label="Descripción Inicial"
                                                        value={extractValue(property.entryAndLocation?.initialDescription)}
                                                        icon="pi pi-align-left"
                                                    />
                                                </div>
                                            </div>
                                        </Panel>
                                    </div>
                                </div>
                            </div>
                        </AccordionTab>

                        {/* 3. Productor/Autor */}
                        <AccordionTab
                            header={
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
                                    <div style={{
                                        width: '3rem',
                                        height: '3rem',
                                        background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}bb 100%)`,
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '1.2rem'
                                    }}>
                                        <i className="pi pi-user"></i>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <span style={{
                                            display: 'block',
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            color: primaryColor,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>03</span>
                                        <span style={{
                                            display: 'block',
                                            fontSize: '1.1rem',
                                            fontWeight: 600,
                                            color: '#2d3748',
                                            margin: '0.2rem 0'
                                        }}>Productor/Autor</span>
                                        <span style={{
                                            fontSize: '0.9rem',
                                            color: '#718096'
                                        }}>Información sobre el creador y procedencia</span>
                                    </div>
                                </div>
                            }
                            style={{
                                border: 'none',
                                marginBottom: '1rem',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                boxShadow: `0 4px 12px ${primaryColor}15`
                            }}
                        >
                            <div style={{ padding: '2rem', background: lightBg }}>
                                <div className="grid">
                                    <div className="col-12 lg:col-6">
                                        <Panel
                                            header={
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <i className="pi pi-user" style={{ color: primaryColor }}></i>
                                                    <span>Creador/Productor</span>
                                                </div>
                                            }
                                            style={{
                                                background: 'white',
                                                border: 'none',
                                                borderRadius: '12px',
                                                boxShadow: `0 2px 8px ${primaryColor}10`,
                                                marginBottom: '1.5rem'
                                            }}
                                        >
                                            <FieldDisplay
                                                label="Nombre del Productor/Autor"
                                                value={extractValue(property.producerAuthor?.producerAuthorNames)}
                                                icon="pi pi-user"
                                            />
                                            <FieldDisplay
                                                label="Historia del Objeto"
                                                value={extractValue(property.producerAuthor?.objectEntryHistory)}
                                                icon="pi pi-history"
                                            />
                                            <FieldDisplay
                                                label="Historia Institucional"
                                                value={extractValue(property.producerAuthor?.institutionalHistory)}
                                                icon="pi pi-building"
                                            />
                                        </Panel>
                                    </div>

                                    <div className="col-12 lg:col-6">
                                        <Panel
                                            header={
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <i className="pi pi-map-marker" style={{ color: primaryColor }}></i>
                                                    <span>Dirección del Productor</span>
                                                </div>
                                            }
                                            style={{
                                                background: 'white',
                                                border: 'none',
                                                borderRadius: '12px',
                                                boxShadow: `0 2px 8px ${primaryColor}10`,
                                                marginBottom: '1.5rem'
                                            }}
                                        >
                                            <FieldDisplay
                                                label="Calle"
                                                value={extractValue(property.producerAuthor?.street)}
                                                icon="pi pi-map-marker"
                                            />
                                            <FieldDisplay
                                                label="Número"
                                                value={extractValue(property.producerAuthor?.number)}
                                                icon="pi pi-hashtag"
                                            />
                                            <FieldDisplay
                                                label="Entre Calle 1"
                                                value={extractValue(property.producerAuthor?.betweenStreet1)}
                                                icon="pi pi-directions"
                                            />
                                            <FieldDisplay
                                                label="Entre Calle 2"
                                                value={extractValue(property.producerAuthor?.betweenStreet2)}
                                                icon="pi pi-directions"
                                            />
                                        </Panel>
                                    </div>

                                    <div className="col-12">
                                        <Panel
                                            header={
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <i className="pi pi-globe" style={{ color: primaryColor }}></i>
                                                    <span>Ubicación Geográfica</span>
                                                </div>
                                            }
                                            style={{
                                                background: 'white',
                                                border: 'none',
                                                borderRadius: '12px',
                                                boxShadow: `0 2px 8px ${primaryColor}10`,
                                                marginBottom: '1.5rem'
                                            }}
                                        >
                                            <div className="grid">
                                                <div className="col-12 md:col-6 lg:col-3">
                                                    <FieldDisplay
                                                        label="Localidad"
                                                        value={extractValue(property.producerAuthor?.locality)}
                                                        icon="pi pi-map"
                                                    />
                                                </div>
                                                <div className="col-12 md:col-6 lg:col-3">
                                                    <FieldDisplay
                                                        label="Municipio"
                                                        value={extractValue(property.producerAuthor?.municipality)}
                                                        icon="pi pi-building"
                                                    />
                                                </div>
                                                <div className="col-12 md:col-6 lg:col-3">
                                                    <FieldDisplay
                                                        label="Provincia"
                                                        value={extractValue(property.producerAuthor?.province)}
                                                        icon="pi pi-globe"
                                                    />
                                                </div>
                                                <div className="col-12 md:col-6 lg:col-3">
                                                    <FieldDisplay
                                                        label="Distrito"
                                                        value={extractValue(property.producerAuthor?.district)}
                                                        icon="pi pi-map"
                                                    />
                                                </div>
                                            </div>
                                        </Panel>
                                    </div>
                                </div>
                            </div>
                        </AccordionTab>

                        {/* 4. Condiciones de Acceso y Uso */}
                        <AccordionTab
                            header={
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
                                    <div style={{
                                        width: '3rem',
                                        height: '3rem',
                                        background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}bb 100%)`,
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '1.2rem'
                                    }}>
                                        <i className="pi pi-key"></i>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <span style={{
                                            display: 'block',
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            color: primaryColor,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>04</span>
                                        <span style={{
                                            display: 'block',
                                            fontSize: '1.1rem',
                                            fontWeight: 600,
                                            color: '#2d3748',
                                            margin: '0.2rem 0'
                                        }}>Condiciones de Acceso y Uso</span>
                                        <span style={{
                                            fontSize: '0.9rem',
                                            color: '#718096'
                                        }}>Permisos y restricciones de acceso</span>
                                    </div>
                                </div>
                            }
                            style={{
                                border: 'none',
                                marginBottom: '1rem',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                boxShadow: `0 4px 12px ${primaryColor}15`
                            }}
                        >
                            <div style={{ padding: '2rem', background: lightBg }}>
                                <div className="grid">
                                    <div className="col-12 lg:col-6">
                                        <Panel
                                            header={
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <i className="pi pi-lock" style={{ color: primaryColor }}></i>
                                                    <span>Condiciones de Acceso</span>
                                                </div>
                                            }
                                            style={{
                                                background: 'white',
                                                border: 'none',
                                                borderRadius: '12px',
                                                boxShadow: `0 2px 8px ${primaryColor}10`,
                                                marginBottom: '1.5rem'
                                            }}
                                        >
                                            <FieldDisplay
                                                label="Condiciones de Acceso"
                                                value={formatArrayValue(property.accessAndUseConditions?.accessConditions)}
                                                icon="pi pi-unlock"
                                            />
                                            <FieldDisplay
                                                label="Condiciones de Reproducción"
                                                value={formatArrayValue(property.accessAndUseConditions?.reproductionConditions)}
                                                icon="pi pi-copy"
                                            />
                                        </Panel>
                                    </div>

                                    <div className="col-12 lg:col-6">
                                        <Panel
                                            header={
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <i className="pi pi-cog" style={{ color: primaryColor }}></i>
                                                    <span>Requerimientos Técnicos</span>
                                                </div>
                                            }
                                            style={{
                                                background: 'white',
                                                border: 'none',
                                                borderRadius: '12px',
                                                boxShadow: `0 2px 8px ${primaryColor}10`,
                                                marginBottom: '1.5rem'
                                            }}
                                        >
                                            <FieldDisplay
                                                label="Requerimientos Técnicos"
                                                value={extractValue(property.accessAndUseConditions?.technicalRequirements)}
                                                icon="pi pi-cog"
                                            />
                                        </Panel>
                                    </div>
                                </div>
                            </div>
                        </AccordionTab>

                        {/* 5. Documentación Asociada */}
                        <AccordionTab
                            header={
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
                                    <div style={{
                                        width: '3rem',
                                        height: '3rem',
                                        background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}bb 100%)`,
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '1.2rem'
                                    }}>
                                        <i className="pi pi-file"></i>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <span style={{
                                            display: 'block',
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            color: primaryColor,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>05</span>
                                        <span style={{
                                            display: 'block',
                                            fontSize: '1.1rem',
                                            fontWeight: 600,
                                            color: '#2d3748',
                                            margin: '0.2rem 0'
                                        }}>Documentación Asociada</span>
                                        <span style={{
                                            fontSize: '0.9rem',
                                            color: '#718096'
                                        }}>Referencias y documentación relacionada</span>
                                    </div>
                                </div>
                            }
                            style={{
                                border: 'none',
                                marginBottom: '1rem',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                boxShadow: `0 4px 12px ${primaryColor}15`
                            }}
                        >
                            <div style={{ padding: '2rem', background: lightBg }}>
                                <div className="grid">
                                    <div className="col-12">
                                        <Panel
                                            header={
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <i className="pi pi-link" style={{ color: primaryColor }}></i>
                                                    <span>Documentación Relacionada</span>
                                                </div>
                                            }
                                            style={{
                                                background: 'white',
                                                border: 'none',
                                                borderRadius: '12px',
                                                boxShadow: `0 2px 8px ${primaryColor}10`,
                                                marginBottom: '1.5rem'
                                            }}
                                        >
                                            <div className="grid">
                                                <div className="col-12 lg:col-6">
                                                    <FieldDisplay
                                                        label="Existencia y Localización de Copias"
                                                        value={extractValue(property.associatedDocumentation?.copiesExistenceAndLocation)}
                                                        icon="pi pi-copy"
                                                    />
                                                </div>
                                                <div className="col-12 lg:col-6">
                                                    <FieldDisplay
                                                        label="Existencia y Localización de Originales"
                                                        value={extractValue(property.associatedDocumentation?.originalsExistenceAndLocation)}
                                                        icon="pi pi-file"
                                                    />
                                                </div>
                                                <div className="col-12 lg:col-6">
                                                    <FieldDisplay
                                                        label="Unidades de Descripción Relacionadas"
                                                        value={extractValue(property.associatedDocumentation?.relatedDescriptionUnits)}
                                                        icon="pi pi-sitemap"
                                                    />
                                                </div>
                                                <div className="col-12 lg:col-6">
                                                    <FieldDisplay
                                                        label="Información de Publicaciones Relacionadas"
                                                        value={extractValue(property.associatedDocumentation?.relatedPublicationsInformation)}
                                                        icon="pi pi-book"
                                                    />
                                                </div>
                                            </div>
                                        </Panel>
                                    </div>
                                </div>
                            </div>
                        </AccordionTab>

                        {/* 6. Control de Descripción */}
                        <AccordionTab
                            header={
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
                                    <div style={{
                                        width: '3rem',
                                        height: '3rem',
                                        background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}bb 100%)`,
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '1.2rem'
                                    }}>
                                        <i className="pi pi-check"></i>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <span style={{
                                            display: 'block',
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            color: primaryColor,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>06</span>
                                        <span style={{
                                            display: 'block',
                                            fontSize: '1.1rem',
                                            fontWeight: 600,
                                            color: '#2d3748',
                                            margin: '0.2rem 0'
                                        }}>Control de Descripción</span>
                                        <span style={{
                                            fontSize: '0.9rem',
                                            color: '#718096'
                                        }}>Información sobre elaboración y revisión</span>
                                    </div>
                                </div>
                            }
                            style={{
                                border: 'none',
                                marginBottom: '1rem',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                boxShadow: `0 4px 12px ${primaryColor}15`
                            }}
                        >
                            <div style={{ padding: '2rem', background: lightBg }}>
                                <div className="grid">
                                    <div className="col-12 lg:col-6">
                                        <Panel
                                            header={
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <i className="pi pi-user-edit" style={{ color: primaryColor }}></i>
                                                    <span>Elaboración</span>
                                                </div>
                                            }
                                            style={{
                                                background: 'white',
                                                border: 'none',
                                                borderRadius: '12px',
                                                boxShadow: `0 2px 8px ${primaryColor}10`,
                                                marginBottom: '1.5rem'
                                            }}
                                        >
                                            <FieldDisplay
                                                label="Descripción Elaborada Por"
                                                value={extractValue(property.descriptionControl?.descriptionMadeBy)}
                                                icon="pi pi-user"
                                            />
                                            <FieldDisplay
                                                label="Fecha y Hora de Descripción"
                                                value={extractValue(property.descriptionControl?.descriptionDateTime)}
                                                type="date"
                                                icon="pi pi-calendar"
                                            />
                                        </Panel>
                                    </div>

                                    <div className="col-12 lg:col-6">
                                        <Panel
                                            header={
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <i className="pi pi-verified" style={{ color: primaryColor }}></i>
                                                    <span>Revisión</span>
                                                </div>
                                            }
                                            style={{
                                                background: 'white',
                                                border: 'none',
                                                borderRadius: '12px',
                                                boxShadow: `0 2px 8px ${primaryColor}10`,
                                                marginBottom: '1.5rem'
                                            }}
                                        >
                                            <FieldDisplay
                                                label="Revisado Por"
                                                value={extractValue(property.descriptionControl?.reviewedBy)}
                                                icon="pi pi-user-check"
                                            />
                                            <FieldDisplay
                                                label="Fecha y Hora de Revisión"
                                                value={extractValue(property.descriptionControl?.reviewDateTime)}
                                                type="date"
                                                icon="pi pi-calendar-check"
                                            />
                                        </Panel>
                                    </div>
                                </div>
                            </div>
                        </AccordionTab>

                        {/* 7. Notas */}
                        {property.notes && (
                            <AccordionTab
                                header={
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
                                        <div style={{
                                            width: '3rem',
                                            height: '3rem',
                                            background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}bb 100%)`,
                                            borderRadius: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '1.2rem'
                                        }}>
                                            <i className="pi pi-comment"></i>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <span style={{
                                                display: 'block',
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                color: primaryColor,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em'
                                            }}>07</span>
                                            <span style={{
                                                display: 'block',
                                                fontSize: '1.1rem',
                                                fontWeight: 600,
                                                color: '#2d3748',
                                                margin: '0.2rem 0'
                                            }}>Notas</span>
                                            <span style={{
                                                fontSize: '0.9rem',
                                                color: '#718096'
                                            }}>Observaciones adicionales</span>
                                        </div>
                                    </div>
                                }
                                style={{
                                    border: 'none',
                                    marginBottom: '1rem',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    boxShadow: `0 4px 12px ${primaryColor}15`
                                }}
                            >
                                <div style={{ padding: '2rem', background: lightBg }}>
                                    <div className="grid">
                                        <div className="col-12">
                                            <Panel
                                                header={
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <i className="pi pi-comment" style={{ color: primaryColor }}></i>
                                                        <span>Notas Generales</span>
                                                    </div>
                                                }
                                                style={{
                                                    background: 'white',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    boxShadow: `0 2px 8px ${primaryColor}10`,
                                                    marginBottom: '1.5rem'
                                                }}
                                            >
                                                <FieldDisplay
                                                    label="Notas"
                                                    value={extractValue(property.notes?.notes)}
                                                    icon="pi pi-comment"
                                                />
                                            </Panel>
                                        </div>
                                    </div>
                                </div>
                            </AccordionTab>
                        )}

                    </Accordion>
                </div>

                {/* Pie del documento */}
                <Divider style={{ margin: 0, borderColor: `${primaryColor}20` }} />
                <div style={{
                    padding: '2rem 3rem',
                    background: `linear-gradient(135deg, ${lightBg} 0%, ${creamBg} 100%)`,
                    borderTop: `1px solid ${primaryColor}30`
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                        <div>
                            <img
                                src="/demo/images/login/logoPatrimonio.jpg"
                                alt="Logo Patrimonio"
                                style={{
                                    height: '60px',
                                    width: 'auto',
                                    borderRadius: '8px',
                                    boxShadow: `0 4px 12px ${primaryColor}30`
                                }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{
                                margin: '0 0 0.5rem 0',
                                fontSize: '1.1rem',
                                color: primaryColor,
                                fontWeight: 700
                            }}>
                                Sistema de Gestión del Patrimonio Cultural
                            </h3>
                            <p style={{
                                margin: '0 0 0.5rem 0',
                                color: '#666',
                                fontSize: '0.9rem'
                            }}>
                                Documento generado el {formatDate(new Date())}
                            </p>
                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                fontSize: '0.8rem',
                                color: '#666',
                                flexWrap: 'wrap'
                            }}>
                                <span>UUID: {property.uuid}</span>
                                <span>•</span>
                                <span>Versión del sistema: 1.0.0</span>
                                <span>•</span>
                                <span>Formato: Ficha Patrimonial Digital</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
