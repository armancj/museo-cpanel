'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CulturalHeritageProperty } from '@/app/(main)/pages/cultural-property-heritage/types';
import { CulturalPropertyService } from '@/app/service/CulturalPropertyService';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';
import { Fieldset } from 'primereact/fieldset';
import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

export default function PublicCulturalHeritagePropertyPage() {
    const { uuid } = useParams();
    const [property, setProperty] = useState<CulturalHeritageProperty | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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

    if (loading) {
        return (
            <div className="flex align-items-center justify-content-center" style={{ height: '100vh' }}>
                <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
                <span className="ml-2">Cargando...</span>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="flex align-items-center justify-content-center" style={{ height: '100vh' }}>
                <div className="text-center">
                    <i className="pi pi-exclamation-triangle" style={{ fontSize: '2rem', color: 'var(--red-500)' }}></i>
                    <div className="mt-2 text-red-500">
                        {error || 'No se encontró el bien patrimonial'}
                    </div>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string | Date | undefined) => {
        if (!dateString) return 'No disponible';
        const date = new Date(dateString);
        return isValid(date) ? format(date, 'dd/MM/yyyy', { locale: es }) : 'Fecha inválida';
    };

    return (
        <div className="grid p-4">
            <div className="col-12">
                <Card className="mb-4">
                    {/* Encabezado */}
                    <div className="flex align-items-center justify-content-between mb-3">
                        <h1 className="text-3xl font-bold m-0 text-primary">
                            {property.culturalRecord?.objectTitle?.value || 'Bien Patrimonial Cultural'}
                        </h1>
                        <Tag severity="info" value={property.entryAndLocation?.heritageType?.value} style={{ fontSize: '1rem' }} />
                    </div>

                    <Divider />

                    {/* Información General */}
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <Card title="Información General" className="h-full">
                                <p>
                                    <strong>Descripción: </strong> {property.culturalRecord?.objectDescription?.value || 'No disponible'}
                                </p>
                                <p>
                                    <strong>Estado de Conservación: </strong>
                                    {property.culturalRecord?.conservationState?.value?.map(
                                        (state, index) => (
                                            <Tag
                                                key={index}
                                                value={state}
                                                severity={state === 'Bueno' ? 'success' : state === 'Malo' ? 'danger' : 'warning'}
                                                style={{ marginRight: '0.5rem', fontSize: '0.85rem' }}
                                            />
                                        )
                                    ) || 'No disponible'}
                                </p>
                                <p>
                                    <strong>Clasificación Genérica: </strong>
                                    {property.entryAndLocation?.genericClassification?.value || 'No disponible'}
                                </p>
                                <p>
                                    <strong>Fecha de Entrada: </strong>
                                    {formatDate(property.entryAndLocation?.entryDate?.value)}
                                </p>
                            </Card>
                        </div>

                        <div className="col-12 md:col-6">
                            <Card title="Detalles Físicos" className="h-full">
                                <ul className="list-none p-0 m-0">
                                    <li className="mb-2">
                                        <strong>Altura:</strong> {property.culturalRecord?.dimensions?.value?.heightCms || '0'} cm
                                    </li>
                                    <li className="mb-2">
                                        <strong>Ancho:</strong> {property.culturalRecord?.dimensions?.value?.widthCms || '0'} cm
                                    </li>
                                    <li className="mb-2">
                                        <strong>Longitud:</strong> {property.culturalRecord?.dimensions?.value?.lengthCms || '0'} cm
                                    </li>
                                    <li className="mb-2">
                                        <strong>Peso:</strong> {property.culturalRecord?.dimensions?.value?.weightKg || '0'} kg
                                    </li>
                                </ul>
                            </Card>
                        </div>
                    </div>

                    <Divider />

                    {/* Ubicación */}
                    <Fieldset legend="Ubicación" toggleable>
                        <ul className="list-none p-0 m-0">
                            <li className="mb-2">
                                <strong>Sala:</strong> {property.entryAndLocation?.objectLocation?.value?.exhibitionRoom || 'N/A'}
                            </li>
                            <li className="mb-2">
                                <strong>Almacén:</strong> {property.entryAndLocation?.objectLocation?.value?.storage || 'N/A'}
                            </li>
                            <li className="mb-2">
                                <strong>Piso:</strong> {property.entryAndLocation?.objectLocation?.value?.floor || 'N/A'}
                            </li>
                        </ul>
                    </Fieldset>

                    {/* Productor/Autor */}
                    <Fieldset legend="Productor/Autor" toggleable className="mt-3">
                        <p>
                            <strong>Nombre:</strong> {property.producerAuthor?.producerAuthorNames?.value || 'No disponible'}
                        </p>
                        <p>
                            <strong>Historia Institucional:</strong> {property.producerAuthor?.institutionalHistory?.value || 'No disponible'}
                        </p>
                    </Fieldset>

                    {/* Condiciones de Acceso y Uso */}
                    <Fieldset legend="Condiciones de Acceso y Uso" toggleable className="mt-3">
                        <p>
                            <strong>Condiciones de Acceso:</strong> {property.accessAndUseConditions?.accessConditions?.value || 'No disponible'}
                        </p>
                        <p>
                            <strong>Condiciones de Reproducción:</strong> {property.accessAndUseConditions?.reproductionConditions?.value || 'No disponible'}
                        </p>
                    </Fieldset>

                    {/* Pie de página */}
                    <div className="mt-4 pt-3 border-top-1 border-300 text-500 text-sm">
                        <p>Última actualización: {formatDate(property.updatedAt)}</p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
