import React, { useState, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { get } from '@/adapter/httpAdapter';
import { WebEnvConst } from '@/app/webEnvConst';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Divider } from 'primereact/divider';

const CulturalPropertyTable = ({ latestEntries, loading }: { latestEntries: any[]; loading: boolean }) => {
    const [selectedData, setSelectedData] = useState<any>(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const toast = useRef<Toast>(null);

    // Función para cargar los datos de un objeto cultural desde el backend
    const fetchCulturalProperty = async (uuid: string) => {
        try {
            setLoadingDetail(true);
            const response = await get(WebEnvConst.culturalProperty.getOne(uuid));
            setSelectedData(response);
            setModalVisible(true);
        } catch (error) {
            console.error('Error al obtener el objeto cultural:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo cargar la información del objeto',
                life: 5000
            });
        } finally {
            setLoadingDetail(false);
        }
    };

    const truncateText = (text: string, maxLength: number = 50): string => {
        if (!text || text.length <= maxLength) return text || 'Sin Titulo';
        return text.substring(0, maxLength).trim() + '...';
    };

    const formatDate = (date: string | Date) => {
        if (!date) return 'Sin fecha';
        const d = new Date(date);
        return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const getSeverityForConservationState = (state: string): "success" | "info" | "warning" | "danger" => {
        switch (state?.toLowerCase()) {
            case 'excelente':
            case 'bueno':
                return 'success';
            case 'regular':
                return 'warning';
            case 'malo':
            case 'crítico':
                return 'danger';
            default:
                return 'info';
        }
    };

    // Template para el estado de conservación en el modal
    const renderConservationStates = (states: string[]) => {
        if (!states || states.length === 0) return <span className="text-color-secondary">No especificado</span>;

        return (
            <div className="flex flex-wrap gap-2">
                {states.map((state, index) => (
                    <Tag
                        key={index}
                        value={state}
                        severity={getSeverityForConservationState(state)}
                        className="text-sm"
                    />
                ))}
            </div>
        );
    };

    // Header del modal
    const modalHeader = (
        <div className="flex align-items-center gap-3">
            <i className="pi pi-info-circle text-2xl text-primary"></i>
            <div>
                <h3 className="m-0">Detalles del Patrimonio Cultural</h3>
                <p className="m-0 text-color-secondary">Información completa del objeto</p>
            </div>
        </div>
    );

    return (
        <>
            <Toast ref={toast} />

            <div className="card">
                <h5 className="mb-3" style={{ display: 'flex', alignItems: 'center', color: '#495057' }}>
                    <i className="pi pi-clock mr-2" style={{ fontSize: '1.5rem', color: '#007ad9' }}></i>
                    Ingresos Recientes de Objetos Museables
                </h5>

                <DataTable
                    value={latestEntries}
                    rows={5}
                    paginator
                    scrollable
                    scrollHeight="400px"
                    loading={loading}
                    stripedRows
                    responsiveLayout="scroll"
                    emptyMessage="¡No hay objetos recientes por mostrar!"
                    className="p-datatable-striped"
                    style={{ fontSize: '0.95rem' }}
                >
                    <Column
                        field="culturalRecord.objectTitle.value"
                        header="🥇 Nombre"
                        sortable
                        style={{ width: '35%', fontWeight: 'bold' }}
                        body={(data) => (
                            <span
                                style={{
                                    color: '#007ad9',
                                    fontWeight: '500'
                                }}
                                title={data?.culturalRecord?.objectTitle?.value || 'Sin Titulo'}
                            >
                                {truncateText(data?.culturalRecord?.objectTitle?.value, 15)}
                            </span>
                        )}
                    />

                    <Column
                        field="entryAndLocation.heritageType.value"
                        header="🎨 Tipo"
                        sortable
                        style={{ width: '25%', fontWeight: 'bold' }}
                        body={(data) => <Tag value={data?.entryAndLocation?.heritageType?.value} severity="success" style={{ fontSize: '0.88rem' }} />}
                    />

                    <Column
                        field="createdAt"
                        header="📅 Fecha"
                        sortable
                        body={(data) => <Tag value={formatDate(data?.createdAt)} severity="info" style={{ fontSize: '0.88rem' }} />}
                        style={{ width: '25%', fontWeight: 'bold' }}
                    />

                    <Column
                        header="🔍 Acción"
                        body={(data) => (
                            <Button
                                icon="pi pi-search"
                                label="Ver"
                                className="p-button-rounded p-button-text p-button-help"
                                style={{ fontSize: '0.9rem' }}
                                onClick={() => fetchCulturalProperty(data.uuid)}
                                loading={loadingDetail}
                            />
                        )}
                        style={{ width: '15%', textAlign: 'center' }}
                    />
                </DataTable>

                {/* Modal mejorado con el diseño anterior */}
                <Dialog
                    header={modalHeader}
                    visible={isModalVisible}
                    onHide={() => setModalVisible(false)}
                    style={{ width: '90vw', maxWidth: '1200px' }}
                    maximizable
                    modal
                    breakpoints={{ '960px': '95vw', '640px': '100vw' }}
                    className="p-fluid"
                >
                    {loadingDetail ? (
                        <div className="flex justify-content-center align-items-center p-8">
                            <div className="flex flex-column align-items-center gap-3">
                                <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                                <span className="text-color-secondary">Cargando información...</span>
                            </div>
                        </div>
                    ) : selectedData ? (
                        <div className="grid">
                            {/* Información principal */}
                            <div className="col-12">
                                <div className="flex align-items-center justify-content-between mb-4 p-3 surface-100 border-round">
                                    <div className="flex-1">
                                        <h2 className="m-0 text-primary text-2xl">
                                            {selectedData?.culturalRecord?.objectTitle?.value || 'Sin título'}
                                        </h2>
                                        <p className="m-0 text-color-secondary mt-2">
                                            {selectedData?.culturalRecord?.objectDescription?.value || 'Sin descripción'}
                                        </p>
                                    </div>
                                    <Tag
                                        value={selectedData?.entryAndLocation?.heritageType?.value || 'N/A'}
                                        severity="info"
                                        className="text-lg font-medium"
                                    />
                                </div>
                            </div>

                            {/* Información general */}
                            <div className="col-12 md:col-6">
                                <Card title="📋 Información General" className="h-full">
                                    <div className="grid">
                                        <div className="col-12">
                                            <div className="field">
                                                <label className="font-medium text-color-secondary">Estado de Conservación</label>
                                                <div className="mt-2">
                                                    {renderConservationStates(selectedData?.culturalRecord?.conservationState?.value)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="field">
                                                <label className="font-medium text-color-secondary">Método de Ingreso</label>
                                                <p className="mt-1 mb-0">
                                                    {selectedData?.entryAndLocation?.entryMethod?.value || 'No especificado'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Dimensiones físicas */}
                            <div className="col-12 md:col-6">
                                <Card title="📏 Dimensiones Físicas" className="h-full">
                                    <div className="grid">
                                        <div className="col-6">
                                            <div className="field">
                                                <label className="font-medium text-color-secondary">Altura</label>
                                                <p className="mt-1 mb-0 text-lg">
                                                    {selectedData?.culturalRecord?.dimensions?.value?.heightCms || '0'} cm
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="field">
                                                <label className="font-medium text-color-secondary">Ancho</label>
                                                <p className="mt-1 mb-0 text-lg">
                                                    {selectedData?.culturalRecord?.dimensions?.value?.widthCms || '0'} cm
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="field">
                                                <label className="font-medium text-color-secondary">Longitud</label>
                                                <p className="mt-1 mb-0 text-lg">
                                                    {selectedData?.culturalRecord?.dimensions?.value?.lengthCms || '0'} cm
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="field">
                                                <label className="font-medium text-color-secondary">Peso</label>
                                                <p className="mt-1 mb-0 text-lg">
                                                    {selectedData?.culturalRecord?.dimensions?.value?.weightKg || '0'} kg
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Ubicación */}
                            <div className="col-12 md:col-6">
                                <Card title="📍 Ubicación" className="h-full">
                                    <div className="grid">
                                        <div className="col-12">
                                            <div className="field">
                                                <label className="font-medium text-color-secondary">Sala de Exhibición</label>
                                                <p className="mt-1 mb-0">
                                                    {selectedData?.entryAndLocation?.objectLocation?.value?.exhibitionRoom || 'No asignada'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="field">
                                                <label className="font-medium text-color-secondary">Almacén</label>
                                                <p className="mt-1 mb-0">
                                                    {selectedData?.entryAndLocation?.objectLocation?.value?.storage || 'No asignado'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="field">
                                                <label className="font-medium text-color-secondary">Referencia de Calles</label>
                                                <p className="mt-1 mb-0">
                                                    {selectedData?.producerAuthor?.betweenStreet1?.value && selectedData?.producerAuthor?.betweenStreet2?.value
                                                        ? `Entre ${selectedData.producerAuthor.betweenStreet1.value} y ${selectedData.producerAuthor.betweenStreet2.value}`
                                                        : 'No especificado'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Condiciones de uso */}
                            <div className="col-12 md:col-6">
                                <Card title="🔐 Condiciones de Uso" className="h-full">
                                    <div className="grid">
                                        <div className="col-12">
                                            <div className="field">
                                                <label className="font-medium text-color-secondary">Condiciones de Acceso</label>
                                                <p className="mt-1 mb-0">
                                                    {selectedData?.accessAndUseConditions?.accessConditions?.value?.join(', ') || 'No especificado'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="field">
                                                <label className="font-medium text-color-secondary">Condiciones de Reproducción</label>
                                                <p className="mt-1 mb-0">
                                                    {selectedData?.accessAndUseConditions?.reproductionConditions?.value?.join(', ') || 'No especificado'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="field">
                                                <label className="font-medium text-color-secondary">Requisitos Técnicos</label>
                                                <p className="mt-1 mb-0">
                                                    {selectedData?.accessAndUseConditions?.technicalRequirements?.value || 'No especificado'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Notas */}
                            <div className="col-12">
                                <Card title="📝 Notas Adicionales">
                                    <p className="line-height-3">
                                        {selectedData?.notes?.notes?.value || 'Sin notas adicionales.'}
                                    </p>
                                </Card>
                            </div>

                            {/* Información de creación */}
                            <div className="col-12">
                                <div className="flex justify-content-between align-items-center p-3 surface-100 border-round">
                                    <div className="flex align-items-center gap-2">
                                        <i className="pi pi-calendar text-color-secondary"></i>
                                        <span className="text-color-secondary">Fecha de registro:</span>
                                    </div>
                                    <Badge
                                        value={formatDate(selectedData?.createdAt)}
                                        severity="info"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-content-center align-items-center p-8">
                            <div className="flex flex-column align-items-center gap-3">
                                <i className="pi pi-exclamation-triangle text-4xl text-orange-500"></i>
                                <span className="text-color-secondary">No se pudo cargar la información</span>
                            </div>
                        </div>
                    )}
                </Dialog>
            </div>
        </>
    );
};

export default CulturalPropertyTable;
