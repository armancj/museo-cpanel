import {
    AccessAndUseConditions,
    AssociatedDocumentation, CulturalHeritageProperty, CulturalRecord, DescriptionControl, EntryAndLocation, Notes,
    ProducerAuthor
} from '@/app/(main)/pages/cultural-property-heritage/types';
import {useMemo} from 'react';

export function useGenerateCulturalRecordSections(extractValue: (field: any) => (undefined), property: {
    createdAt: Date | undefined;
    deleted: boolean | undefined;
    updatedAt: Date | undefined;
    uuid: string | undefined;
    producerAuthor?: ProducerAuthor | undefined;
    accessAndUseConditions?: AccessAndUseConditions | undefined;
    associatedDocumentation?: AssociatedDocumentation | undefined;
    culturalRecord: CulturalRecord | undefined;
    notes?: Notes | undefined;
    entryAndLocation?: EntryAndLocation | undefined;
    descriptionControl?: DescriptionControl | undefined
} | CulturalHeritageProperty | null, formatExtremeDatesValue: (extremeDatesField: any) => (string | string), formatDimensionValue: (dimensionsField: any, dimension: string, unit: string) => (string | string), formatQuantityValue: (quantitiesField: any, quantity: string) => (string | string), formatArrayValue: (field: any) => (string | any), formatObjectLocation: (locationField: any) => (string | string), formatBooleanValue: (field: any) => (string)) {
   return useMemo(() => [
        {
            num: '01', icon: 'pi-book', title: 'Registro Cultural',
            subtitle: 'Información básica y descriptores',
            panels: [
                {
                    title: 'Información Básica', icon: 'pi-bookmark', cols: 'col-12 lg:col-6',
                    fields: [
                        {
                            label: 'Título del Objeto',
                            value: extractValue(property?.culturalRecord?.objectTitle),
                            icon: 'pi-bookmark'
                        },
                        {
                            label: 'Descripción',
                            value: extractValue(property?.culturalRecord?.objectDescription),
                            icon: 'pi-align-left'
                        },
                        {
                            label: 'Título de Fondo',
                            value: extractValue(property?.culturalRecord?.backgroundTitle),
                            icon: 'pi-folder'
                        },
                        {
                            label: 'Título de Sección',
                            value: extractValue(property?.culturalRecord?.sectionTitle),
                            icon: 'pi-folder-open'
                        }
                    ]
                },
                {
                    title: 'Descriptores', icon: 'pi-tags', cols: 'col-12 lg:col-6',
                    fields: [
                        {
                            label: 'Descriptores Onomásticos',
                            value: extractValue(property?.culturalRecord?.onomasticDescriptors),
                            icon: 'pi-user'
                        },
                        {
                            label: 'Descriptores Geográficos',
                            value: extractValue(property?.culturalRecord?.geographicDescriptors),
                            icon: 'pi-map-marker'
                        },
                        {
                            label: 'Descriptores Institucionales',
                            value: extractValue(property?.culturalRecord?.institutionalDescriptors),
                            icon: 'pi-building'
                        },
                        {
                            label: 'Descriptores de Materia',
                            value: extractValue(property?.culturalRecord?.subjectDescriptors),
                            icon: 'pi-tags'
                        }
                    ]
                },
                {
                    title: 'Información Técnica', icon: 'pi-chart-bar', cols: 'col-12',
                    fields: [
                        {
                            label: 'Fechas Extremas',
                            value: formatExtremeDatesValue(property?.culturalRecord?.extremeDates),
                            icon: 'pi-calendar-times',
                            cols: 'col-12 md:col-6 lg:col-3'
                        },
                        {
                            label: 'Grado de Valor',
                            value: extractValue(property?.culturalRecord?.valueGrade),
                            icon: 'pi-star',
                            cols: 'col-12 md:col-6 lg:col-3'
                        },
                        {
                            label: 'Nivel de Descripción',
                            value: extractValue(property?.culturalRecord?.descriptionLevel),
                            type: 'number',
                            icon: 'pi-chart-bar',
                            cols: 'col-12 md:col-6 lg:col-3'
                        },
                        {
                            label: 'Valoración',
                            value: extractValue(property?.culturalRecord?.valuation),
                            type: 'number',
                            icon: 'pi-dollar',
                            cols: 'col-12 md:col-6 lg:col-3'
                        }
                    ]
                },
                ...(property?.culturalRecord?.dimensions ? [{
                    title: 'Características Físicas', icon: 'pi-arrows-v', cols: 'col-12 lg:col-6',
                    fields: [
                        {
                            label: 'Altura',
                            value: formatDimensionValue(property.culturalRecord?.dimensions, 'heightCms', 'cm'),
                            icon: 'pi-arrows-v',
                            cols: 'col-6'
                        },
                        {
                            label: 'Ancho',
                            value: formatDimensionValue(property.culturalRecord?.dimensions, 'widthCms', 'cm'),
                            icon: 'pi-arrows-h',
                            cols: 'col-6'
                        },
                        {
                            label: 'Largo',
                            value: formatDimensionValue(property.culturalRecord?.dimensions, 'lengthCms', 'cm'),
                            icon: 'pi-arrows-h',
                            cols: 'col-6'
                        },
                        {
                            label: 'Peso',
                            value: formatDimensionValue(property.culturalRecord?.dimensions, 'weightKg', 'kg'),
                            icon: 'pi-circle',
                            cols: 'col-6'
                        },
                        {
                            label: 'Volumen Cúbico',
                            value: formatDimensionValue(property.culturalRecord?.dimensions, 'cubicMeters', 'm³'),
                            icon: 'pi-box',
                            cols: 'col-6'
                        },
                        {
                            label: 'Área',
                            value: formatDimensionValue(property.culturalRecord?.dimensions, 'squareMeters', 'm²'),
                            icon: 'pi-expand',
                            cols: 'col-6'
                        }
                    ]
                }] : []),
                ...(property?.culturalRecord?.volumesQuantities ? [{
                    title: 'Cantidades y Volúmenes', icon: 'pi-file', cols: 'col-12 lg:col-6',
                    fields: [
                        {
                            label: 'Expedientes',
                            value: formatQuantityValue(property.culturalRecord?.volumesQuantities, 'file'),
                            icon: 'pi-file',
                            cols: 'col-6'
                        },
                        {
                            label: 'Páginas',
                            value: formatQuantityValue(property.culturalRecord?.volumesQuantities, 'pages'),
                            icon: 'pi-file-o',
                            cols: 'col-6'
                        },
                        {
                            label: 'Libros',
                            value: formatQuantityValue(property.culturalRecord?.volumesQuantities, 'books'),
                            icon: 'pi-book',
                            cols: 'col-6'
                        },
                        {
                            label: 'Objetos',
                            value: formatQuantityValue(property.culturalRecord?.volumesQuantities, 'objects'),
                            icon: 'pi-box',
                            cols: 'col-6'
                        },
                        {
                            label: 'Fotografías',
                            value: formatQuantityValue(property.culturalRecord?.volumesQuantities, 'photos'),
                            icon: 'pi-camera',
                            cols: 'col-6'
                        },
                        {
                            label: 'Grabados',
                            value: formatQuantityValue(property.culturalRecord?.volumesQuantities, 'engravings'),
                            icon: 'pi-image',
                            cols: 'col-6'
                        },
                        {
                            label: 'Diapositivas',
                            value: formatQuantityValue(property.culturalRecord?.volumesQuantities, 'slides'),
                            icon: 'pi-images',
                            cols: 'col-6'
                        },
                        {
                            label: 'Negativos',
                            value: formatQuantityValue(property.culturalRecord?.volumesQuantities, 'negatives'),
                            icon: 'pi-eye-slash',
                            cols: 'col-6'
                        },
                        {
                            label: 'Mapas, Planos y Croquis',
                            value: formatQuantityValue(property.culturalRecord?.volumesQuantities, 'mapsPlansSketches'),
                            icon: 'pi-map',
                            cols: 'col-12'
                        }
                    ]
                }] : []),
                {
                    title: 'Características del Material', icon: 'pi-language', cols: 'col-12',
                    fields: [
                        {
                            label: 'Idiomas',
                            value: formatArrayValue(property?.culturalRecord?.languages),
                            icon: 'pi-globe',
                            cols: 'col-12 md:col-6 lg:col-3'
                        },
                        {
                            label: 'Soportes',
                            value: formatArrayValue(property?.culturalRecord?.supports),
                            icon: 'pi-file',
                            cols: 'col-12 md:col-6 lg:col-3'
                        },
                        {
                            label: 'Letras',
                            value: formatArrayValue(property?.culturalRecord?.letters),
                            icon: 'pi-font',
                            cols: 'col-12 md:col-6 lg:col-3'
                        },
                        {
                            label: 'Estado de Conservación',
                            value: formatArrayValue(property?.culturalRecord?.conservationState),
                            icon: 'pi-shield',
                            cols: 'col-12 md:col-6 lg:col-3'
                        },
                        {
                            label: 'Instrumentos de Descripción',
                            value: formatArrayValue(property?.culturalRecord?.descriptionInstrument),
                            icon: 'pi-search',
                            cols: 'col-12'
                        }
                    ]
                }
            ]
        },
        {
            num: '02', icon: 'pi-map-marker', title: 'Entrada y Localización',
            subtitle: 'Ubicación y forma de ingreso',
            panels: [
                {
                    title: 'Información de Entrada', icon: 'pi-home', cols: 'col-12 lg:col-6',
                    fields: [
                        {
                            label: 'Fecha de Ingreso',
                            value: extractValue(property?.entryAndLocation?.entryDate),
                            type: 'date',
                            icon: 'pi-calendar'
                        },
                        {
                            label: 'Tipo de Patrimonio',
                            value: extractValue(property?.entryAndLocation?.heritageType),
                            icon: 'pi-star'
                        },
                        {
                            label: 'Método de Entrada',
                            value: extractValue(property?.entryAndLocation?.entryMethod),
                            icon: 'pi-sign-in'
                        },
                        {
                            label: 'Tipo de Declaración',
                            value: extractValue(property?.entryAndLocation?.declarationType),
                            icon: 'pi-list'
                        }
                    ]
                },
                {
                    title: 'Identificación y Ubicación', icon: 'pi-map', cols: 'col-12 lg:col-6',
                    fields: [
                        {
                            label: 'Nombre del Objeto',
                            value: extractValue(property?.entryAndLocation?.objectName),
                            icon: 'pi-tag'
                        },
                        {
                            label: 'Número de Inventario',
                            value: extractValue(property?.entryAndLocation?.inventoryNumber),
                            icon: 'pi-hashtag'
                        },
                        {
                            label: 'Clasificación Genérica',
                            value: extractValue(property?.entryAndLocation?.genericClassification),
                            icon: 'pi-code'
                        },
                        {
                            label: 'Tipo de Institución',
                            value: extractValue(property?.entryAndLocation?.institutionType),
                            icon: 'pi-building'
                        }
                    ]
                },
                {
                    title: 'Ubicación Física', icon: 'pi-map-marker', cols: 'col-12',
                    fields: [
                        {
                            label: 'Localización',
                            value: formatObjectLocation(property?.entryAndLocation?.objectLocation),
                            icon: 'pi-map-marker',
                            cols: 'col-12 lg:col-6'
                        },
                        {
                            label: 'Inventario Auxiliar',
                            value: formatBooleanValue(property?.entryAndLocation?.auxiliaryInventory),
                            icon: 'pi-check-square',
                            cols: 'col-12 lg:col-3'
                        },
                        {
                            label: 'Inventario de Piezas',
                            value: formatBooleanValue(property?.entryAndLocation?.pieceInventory),
                            icon: 'pi-check-square',
                            cols: 'col-12 lg:col-3'
                        },
                        {
                            label: 'Descripción Inicial',
                            value: extractValue(property?.entryAndLocation?.initialDescription),
                            icon: 'pi-align-left',
                            cols: 'col-12'
                        }
                    ]
                }
            ]
        },
        {
            num: '03', icon: 'pi-user', title: 'Productor/Autor',
            subtitle: 'Información sobre el creador y procedencia',
            panels: [
                {
                    title: 'Creador/Productor', icon: 'pi-user', cols: 'col-12 lg:col-6',
                    fields: [
                        {
                            label: 'Nombre del Productor/Autor',
                            value: extractValue(property?.producerAuthor?.producerAuthorNames),
                            icon: 'pi-user'
                        },
                        {
                            label: 'Historia del Objeto',
                            value: extractValue(property?.producerAuthor?.objectEntryHistory),
                            icon: 'pi-history'
                        },
                        {
                            label: 'Historia Institucional',
                            value: extractValue(property?.producerAuthor?.institutionalHistory),
                            icon: 'pi-building'
                        }
                    ]
                },
                {
                    title: 'Dirección del Productor', icon: 'pi-map-marker', cols: 'col-12 lg:col-6',
                    fields: [
                        {
                            label: 'Calle',
                            value: extractValue(property?.producerAuthor?.street),
                            icon: 'pi-map-marker'
                        },
                        { label: 'Número', value: extractValue(property?.producerAuthor?.number), icon: 'pi-hashtag' },
                        {
                            label: 'Entre Calle 1',
                            value: extractValue(property?.producerAuthor?.betweenStreet1),
                            icon: 'pi-directions'
                        },
                        {
                            label: 'Entre Calle 2',
                            value: extractValue(property?.producerAuthor?.betweenStreet2),
                            icon: 'pi-directions'
                        }
                    ]
                },
                {
                    title: 'Ubicación Geográfica', icon: 'pi-globe', cols: 'col-12',
                    fields: [
                        {
                            label: 'Localidad',
                            value: extractValue(property?.producerAuthor?.locality),
                            icon: 'pi-map',
                            cols: 'col-12 md:col-6 lg:col-3'
                        },
                        {
                            label: 'Municipio',
                            value: extractValue(property?.producerAuthor?.municipality),
                            icon: 'pi-building',
                            cols: 'col-12 md:col-6 lg:col-3'
                        },
                        {
                            label: 'Provincia',
                            value: extractValue(property?.producerAuthor?.province),
                            icon: 'pi-globe',
                            cols: 'col-12 md:col-6 lg:col-3'
                        },
                        {
                            label: 'Distrito',
                            value: extractValue(property?.producerAuthor?.district),
                            icon: 'pi-map',
                            cols: 'col-12 md:col-6 lg:col-3'
                        }
                    ]
                }
            ]
        },
        {
            num: '04', icon: 'pi-key', title: 'Condiciones de Acceso y Uso',
            subtitle: 'Permisos y restricciones de acceso',
            panels: [
                {
                    title: 'Condiciones de Acceso', icon: 'pi-lock', cols: 'col-12 lg:col-6',
                    fields: [
                        {
                            label: 'Condiciones de Acceso',
                            value: formatArrayValue(property?.accessAndUseConditions?.accessConditions),
                            icon: 'pi-unlock'
                        },
                        {
                            label: 'Condiciones de Reproducción',
                            value: formatArrayValue(property?.accessAndUseConditions?.reproductionConditions),
                            icon: 'pi-copy'
                        }
                    ]
                },
                {
                    title: 'Requerimientos Técnicos', icon: 'pi-cog', cols: 'col-12 lg:col-6',
                    fields: [
                        {
                            label: 'Requerimientos Técnicos',
                            value: extractValue(property?.accessAndUseConditions?.technicalRequirements),
                            icon: 'pi-cog'
                        }
                    ]
                }
            ]
        },
        {
            num: '05', icon: 'pi-file', title: 'Documentación Asociada',
            subtitle: 'Referencias y documentación relacionada',
            panels: [
                {
                    title: 'Documentación Relacionada', icon: 'pi-link', cols: 'col-12',
                    fields: [
                        {
                            label: 'Existencia y Localización de Copias',
                            value: extractValue(property?.associatedDocumentation?.copiesExistenceAndLocation),
                            icon: 'pi-copy',
                            cols: 'col-12 lg:col-6'
                        },
                        {
                            label: 'Existencia y Localización de Originales',
                            value: extractValue(property?.associatedDocumentation?.originalsExistenceAndLocation),
                            icon: 'pi-file',
                            cols: 'col-12 lg:col-6'
                        },
                        {
                            label: 'Unidades de Descripción Relacionadas',
                            value: extractValue(property?.associatedDocumentation?.relatedDescriptionUnits),
                            icon: 'pi-sitemap',
                            cols: 'col-12 lg:col-6'
                        },
                        {
                            label: 'Información de Publicaciones Relacionadas',
                            value: extractValue(property?.associatedDocumentation?.relatedPublicationsInformation),
                            icon: 'pi-book',
                            cols: 'col-12 lg:col-6'
                        }
                    ]
                }
            ]
        },
        {
            num: '06', icon: 'pi-check', title: 'Control de Descripción',
            subtitle: 'Información sobre elaboración y revisión',
            panels: [
                {
                    title: 'Elaboración', icon: 'pi-user-edit', cols: 'col-12 lg:col-6',
                    fields: [
                        {
                            label: 'Descripción Elaborada Por',
                            value: extractValue(property?.descriptionControl?.descriptionMadeBy),
                            icon: 'pi-user'
                        },
                        {
                            label: 'Fecha y Hora de Descripción',
                            value: extractValue(property?.descriptionControl?.descriptionDateTime),
                            type: 'date',
                            icon: 'pi-calendar'
                        }
                    ]
                },
                {
                    title: 'Revisión', icon: 'pi-verified', cols: 'col-12 lg:col-6',
                    fields: [
                        {
                            label: 'Revisado Por',
                            value: extractValue(property?.descriptionControl?.reviewedBy),
                            icon: 'pi-user-check'
                        },
                        {
                            label: 'Fecha y Hora de Revisión',
                            value: extractValue(property?.descriptionControl?.reviewDateTime),
                            type: 'date',
                            icon: 'pi-calendar-check'
                        }
                    ]
                }
            ]
        },
        ...(property?.notes ? [{
            num: '07', icon: 'pi-comment', title: 'Notas',
            subtitle: 'Observaciones adicionales',
            panels: [
                {
                    title: 'Notas Generales', icon: 'pi-comment', cols: 'col-12',
                    fields: [
                        { label: 'Notas', value: extractValue(property.notes?.notes), icon: 'pi-comment' }
                    ]
                }
            ]
        }] : [])
    ], [property, extractValue, formatArrayValue, formatBooleanValue, formatDimensionValue, formatExtremeDatesValue, formatObjectLocation, formatQuantityValue]);

}
