'use client';
import { Divider } from 'primereact/divider';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Skeleton } from 'primereact/skeleton';
import {
    useCulturalHeritageProperty
} from '@/app/(full-page)/cultural-property-heritage/hook/useCulturalHeritageProperty';
import { HeritageHeader } from '@/app/(full-page)/cultural-property-heritage/component/HeritageHeader';
import {
    creamBg,
    formatDate,
    lightBg,
    primaryColor
} from '@/app/(full-page)/cultural-property-heritage/util/culture-function';
import { CulturalLoading } from '@/app/(full-page)/cultural-property-heritage/component/CulturalLoading';
import { CulturalError } from '@/app/(full-page)/cultural-property-heritage/component/CulturalError';
import {useGenerateCulturalRecordSections} from '@/app/(full-page)/cultural-property-heritage/hook/useGenerateCulturalRecordSections';
import {AccordionHeader} from '@/app/(full-page)/cultural-property-heritage/component/AccordionHeader';
import {InfoPanel} from '@/app/(full-page)/cultural-property-heritage/component/InfoPanel';


export default function PublicCulturalHeritagePropertyPag() {
    const {
        property,
        loading,
        error,
        activeIndex,
        setActiveIndex,
        shareButtonState,
        shareButtonRef,
        extractValue,
        formatObjectLocation,
        formatDimensionValue,
        formatQuantityValue,
        formatArrayValue,
        formatExtremeDatesValue,
        formatBooleanValue,
        handleShare
    } = useCulturalHeritageProperty();

    const sectionsConfig = useGenerateCulturalRecordSections(
        extractValue,
        property,
        formatExtremeDatesValue,
        formatDimensionValue,
        formatQuantityValue,
        formatArrayValue,
        formatObjectLocation,
        formatBooleanValue
    );

    const tabStyle = {
        border: 'none', marginBottom: '1rem', borderRadius: '12px',
        overflow: 'hidden', boxShadow: `0 4px 12px ${primaryColor}15`
    };

    const contentStyle = { padding: '2rem', background: lightBg };

    // Skeleton de carga
    if (loading) {
        return <CulturalLoading callbackfn={(i) => <Skeleton key={i} width="100%" height="8rem" className="mb-3" />} />;
    }

    if (error || !property) {
        return <CulturalError error={error} onClick={() => (window.location.href = '/landing')} />;
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                padding: '2rem 1rem',
                fontFamily: 'Inter, Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
            }}
        >
            <div
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    background: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: `0 10px 40px ${primaryColor}20`,
                    overflow: 'hidden',
                    border: `1px solid ${primaryColor}15`
                }}
            >
                <HeritageHeader
                    lightBg={lightBg}
                    creamBg={creamBg}
                    primaryColor={primaryColor}
                    property={property}
                    extractValue={extractValue(property?.culturalRecord?.objectTitle)}
                    extractValue1={extractValue(property?.entryAndLocation?.heritageType)}
                    onClick={() => window.print()}
                    ref={shareButtonRef as any}
                    onClick1={handleShare}
                    shareButtonState={shareButtonState}
                />

                <Divider style={{ margin: 0, borderColor: `${primaryColor}20` }} />

                {/* Contenido del documento */}
                <div style={{ padding: '2rem 3rem' }}>
                    <Accordion multiple activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index as number[])} style={{ border: 'none' }}>
                        {sectionsConfig.map((section, sectionIdx) => (
                            <AccordionTab
                                key={sectionIdx}
                                header={<AccordionHeader {...section} primaryColor={primaryColor} />}
                                style={tabStyle}
                            >
                                <div style={contentStyle}>
                                    <div className="grid">
                                        {section.panels.map((panel, panelIdx) => (
                                            <InfoPanel key={panelIdx} {...panel} primaryColor={primaryColor} />
                                        ))}
                                    </div>
                                </div>
                            </AccordionTab>
                        ))}
                    </Accordion>
                </div>

                {/* Pie del documento */}
                <Divider style={{ margin: 0, borderColor: `${primaryColor}20` }} />
                <div
                    style={{
                        padding: '2rem 3rem',
                        background: `linear-gradient(135deg, ${lightBg} 0%, ${creamBg} 100%)`,
                        borderTop: `1px solid ${primaryColor}30`
                    }}
                >
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
                            <h3
                                style={{
                                    margin: '0 0 0.5rem 0',
                                    fontSize: '1.1rem',
                                    color: primaryColor,
                                    fontWeight: 700
                                }}
                            >
                                Sistema de Gestión del Patrimonio Cultural
                            </h3>
                            <p
                                style={{
                                    margin: '0 0 0.5rem 0',
                                    color: '#666',
                                    fontSize: '0.9rem'
                                }}
                            >
                                Documento generado el {formatDate(new Date())}
                            </p>
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    fontSize: '0.8rem',
                                    color: '#666',
                                    flexWrap: 'wrap'
                                }}
                            >
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
