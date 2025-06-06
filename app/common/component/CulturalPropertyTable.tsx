import { JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactNode, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { get } from '@/adapter/httpAdapter';
import { WebEnvConst } from '@/app/webEnvConst';
import { Fieldset } from 'primereact/fieldset';
import { Divider } from 'primereact/divider';
import { Card } from 'primereact/card';

const CulturalPropertyTable = ({ latestEntries, loading }: { latestEntries: any[]; loading: boolean }) => {
    const [selectedData, setSelectedData] = useState<any>(null);
    const [isModalVisible, setModalVisible] = useState(false);

    // Función para cargar los datos de un objeto cultural desde el backend
    const fetchCulturalProperty = async (uuid: string) => {
        try {
            const response = await get(WebEnvConst.culturalProperty.getOne(uuid));
            setSelectedData(response);
            setModalVisible(true); // Abre el modal
        } catch (error) {
            console.error('Error al obtener el objeto cultural:', error);
        }
    };

    return (
        <div className="card">
            <h5 className="p-mb-3" style={{ display: 'flex', alignItems: 'center', color: '#495057' }}>
                <i className="pi pi-clock p-mr-2" style={{ fontSize: '1.5rem', color: '#007ad9' }}></i>
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
                        >
                            {data?.culturalRecord?.objectTitle?.value}
                        </span>
                    )}
                />
                <Column
                    field="culturalRecord.heritageType.value"
                    header="🎨 Tipo"
                    sortable
                    style={{ width: '25%', fontWeight: 'bold' }}
                    body={(data) => <Tag value={data?.culturalRecord?.heritageType?.value} severity="success" style={{ fontSize: '0.88rem' }} />}
                />
                <Column field="culturalRecord.entryDate.value" header="📅 Fecha" sortable body={(data) => <Tag value={formatDate(data?.createdAt)} severity="info" style={{ fontSize: '0.88rem' }} />} style={{ width: '25%', fontWeight: 'bold' }} />
                <Column
                    header="🔍 Acción"
                    body={(data) => (
                        <Button
                            icon="pi pi-search"
                            label="Ver"
                            className="p-button-rounded p-button-text p-button-help"
                            style={{ fontSize: '0.9rem' }}
                            onClick={() => fetchCulturalProperty(data.uuid)} // Llamada al backend
                        />
                    )}
                    style={{ width: '15%', textAlign: 'center' }}
                />
            </DataTable>

            <Dialog header="Detalles del Patrimonio Cultural" visible={isModalVisible} onHide={() => setModalVisible(false)} style={{ width: '60vw' }} maximizable breakpoints={{ '960px': '75vw', '640px': '100vw' }}>
                {selectedData ? (
                    <div className="dialog-content">
                        {/* Encabezado */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                            <h4
                                style={{
                                    margin: 0,
                                    color: '#007ad9',
                                    flexGrow: 1
                                }}
                            >
                                {selectedData?.culturalRecord?.objectTitle?.value}
                            </h4>
                            <Tag severity="info" value={selectedData?.entryAndLocation?.heritageType?.value} style={{ fontSize: '1rem' }} />
                        </div>

                        <Divider />

                        {/* Secciones principales */}
                        <div className="p-grid">
                            <div className="p-col-12 p-md-6">
                                <Card title="Información General" className="p-card-shadow">
                                    <p>
                                        <strong>Descripción: </strong> {selectedData?.culturalRecord?.objectDescription?.value}
                                    </p>
                                    <p>
                                        <strong>Estado de Conservación: </strong>
                                        {selectedData?.culturalRecord?.conservationState?.value?.map(
                                            (state: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | PromiseLikeOfReactNode | null | undefined, index: Key | null | undefined) => (
                                                <Tag key={index} value={state} severity={state === 'Bueno' ? 'success' : state === 'Malo' ? 'danger' : 'warning'} style={{ marginRight: '0.5rem', fontSize: '0.85rem' }} />
                                            )
                                        )}
                                    </p>
                                </Card>
                            </div>

                            <div className="p-col-12 p-md-6 mt-2">
                                <Card title="Detalles Físicos" className="p-card-shadow">
                                    <ul style={{ padding: 0, listStyle: 'none', margin: 0 }}>
                                        <li>
                                            <strong>Altura:</strong> {selectedData?.culturalRecord?.dimensions?.value?.heightCms || '0'} cm
                                        </li>
                                        <li>
                                            <strong>Ancho:</strong> {selectedData?.culturalRecord?.dimensions?.value?.widthCms || '0'} cm
                                        </li>
                                        <li>
                                            <strong>Longitud:</strong> {selectedData?.culturalRecord?.dimensions?.value?.lengthCms || '0'} cm
                                        </li>
                                        <li>
                                            <strong>Peso:</strong> {selectedData?.culturalRecord?.dimensions?.value?.weightKg || '0'} kg
                                        </li>
                                    </ul>
                                </Card>
                            </div>
                        </div>

                        <Divider />

                        {/* Detalles adicionales con Fieldset */}
                        <Fieldset legend="Ubicación">
                            <ul style={{ padding: 0, listStyle: 'none', margin: 0 }}>
                                <li>
                                    <strong>Sala:</strong> {selectedData?.entryAndLocation?.objectLocation?.value?.exhibitionRoom || 'N/A'}
                                </li>
                                <li>
                                    <strong>Almacén:</strong> {selectedData?.entryAndLocation?.objectLocation?.value?.storage || 'N/A'}
                                </li>
                                <li>
                                    <strong>Entre calles:</strong> {selectedData?.producerAuthor?.betweenStreet1?.value || ''} y {selectedData?.producerAuthor?.betweenStreet2?.value || ''}
                                </li>
                            </ul>
                        </Fieldset>

                        <Divider />

                        <Fieldset legend="Condiciones de Uso">
                            <p>
                                <strong>Acceso:</strong> {selectedData?.accessAndUseConditions?.accessConditions?.value?.join(', ') || 'No especificado'}
                            </p>
                            <p>
                                <strong>Reproducción:</strong> {selectedData?.accessAndUseConditions?.reproductionConditions?.value?.join(', ') || 'No especificado'}
                            </p>
                            <p>
                                <strong>Requisitos Técnicos:</strong> {selectedData?.accessAndUseConditions?.technicalRequirements?.value || 'No especificado'}
                            </p>
                        </Fieldset>

                        <Divider />

                        {/* Notas */}
                        <Card title="Notas" className="p-card-shadow">
                            <p>{selectedData?.notes?.notes?.value || 'Sin notas adicionales.'}</p>
                        </Card>

                        {/* Fecha de creación */}
                        <Divider />
                        <p style={{ textAlign: 'right', color: '#6c757d', fontSize: '0.9rem' }}>Creado el: {formatDate(selectedData?.createdAt)}</p>
                    </div>
                ) : (
                    <p>Cargando datos...</p>
                )}
            </Dialog>
        </div>
    );
};

// Función para formatear fechas
const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
};
export default CulturalPropertyTable;
