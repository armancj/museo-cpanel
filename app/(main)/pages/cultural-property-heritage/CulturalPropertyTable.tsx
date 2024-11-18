import React, { useState, useEffect, useRef } from 'react';
import { DataTable, DataTableExpandedRows, DataTableRowEvent, DataTableValueArray } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Panel } from 'primereact/panel';
import { CulturalPropertyService } from '@/app/service/CulturalPropertyService';
import { CulturalPropertyModel } from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';
import AuthorInfoPanel from '@/app/(main)/pages/cultural-property-heritage/AuthorInfoPanel';

export default function CulturalPropertyTable() {
    const [culturalProperties, setCulturalProperties] = useState<CulturalPropertyModel[]>([]);
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        CulturalPropertyService.getCulturalProperties().then((data) => setCulturalProperties(data));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const onRowExpand = (event: DataTableRowEvent) => {
        toast.current?.show({ severity: 'info', summary: 'Fila expandida', detail: event.data.culturalRecord.objectTitle, life: 3000 });
    };

    const onRowCollapse = (event: DataTableRowEvent) => {
        toast.current?.show({ severity: 'success', summary: 'Fila colapsada', detail: event.data.culturalRecord.objectTitle, life: 3000 });
    };

    const expandAll = () => {
        let _expandedRows: DataTableExpandedRows = {};

        culturalProperties.forEach((p) => (_expandedRows[`${p.uuid}`] = true));

        setExpandedRows(_expandedRows);
    };

    const collapseAll = () => {
        setExpandedRows(undefined);
    };

    const rowExpansionTemplate = (data: CulturalPropertyModel) => {
        return (
            <div className="p-3">
                <h5>Detalles del Objeto Museable</h5>
                <div className="p-grid p-fluid">
                    <div className="p-col-12 p-md-6">
                        <AuthorInfoPanel producerAuthor={data.producerAuthor} />
                        <Panel header="Condiciones de Acceso y Uso" toggleable>
                            <p><b>Condiciones de Acceso:</b> {data.accessAndUseConditions.accessConditions.join(', ')}</p>
                            <p><b>Condiciones de Reproducción:</b> {data.accessAndUseConditions.reproductionConditions.join(', ')}</p>
                            <p><b>Requisitos Técnicos:</b> {data.accessAndUseConditions.technicalRequirements}</p>
                        </Panel>
                        <Panel header="Registro Cultural" toggleable>
                            <p><b>Título:</b> {data.culturalRecord.objectTitle}</p>
                            <p><b>Descripción:</b> {data.culturalRecord.objectDescription}</p>
                            <p><b>Estado de Conservación:</b> {data.culturalRecord.conservationState.join(', ')}</p>
                        </Panel>
                    </div>
                    <div className="p-col-12 p-md-6">
                        <Panel header="Ubicación del Objeto" toggleable>
                            <p><b>Ubicación:</b> {`${data.entryAndLocation.objectLocation.box}, ${data.entryAndLocation.objectLocation.shelfDrawer}, ${data.entryAndLocation.objectLocation.storage}`}</p>
                            <p><b>Tipo de Institución:</b> {data.entryAndLocation.institutionType}</p>
                        </Panel>
                        <Panel header="Control de Descripción" toggleable>
                            <p><b>Hecho por:</b> {data.descriptionControl.descriptionMadeBy}</p>
                            <p><b>Fecha de Descripción:</b> {new Date(data.descriptionControl.descriptionDateTime).toLocaleDateString()}</p>
                            <p><b>Revisado por:</b> {data.descriptionControl.reviewedBy}</p>
                            <p><b>Fecha de Revisión:</b> {new Date(data.descriptionControl.reviewDateTime).toLocaleDateString()}</p>
                        </Panel>
                        <Panel header="Notas" toggleable>
                            <p>{data.notes.notes}</p>
                        </Panel>
                    </div>
                </div>
            </div>
        );
    };

    const header = (
        <div className="flex flex-wrap justify-content-end gap-2">
            <Button icon="pi pi-plus" label="Expandir Todo" onClick={expandAll} text />
            <Button icon="pi pi-minus" label="Colapsar Todo" onClick={collapseAll} text />
        </div>
    );

    return (
        <div className="card">
            <Toast ref={toast} />
            <DataTable value={culturalProperties} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                       onRowExpand={onRowExpand} onRowCollapse={onRowCollapse} rowExpansionTemplate={rowExpansionTemplate}
                       dataKey="uuid" header={header} tableStyle={{ minWidth: '60rem' }}>
                <Column expander style={{ width: '5rem' }} />
                <Column field="producerAuthor.producerAuthorNames" header="Autor" sortable />
                <Column field="culturalRecord.objectTitle" header="Título" sortable />
                <Column field="entryAndLocation.entryDate" header="Fecha de Entrada" sortable body={(rowData) => new Date(rowData.entryAndLocation.entryDate).toLocaleDateString()} />
                <Column field="entryAndLocation.objectName" header="Nombre del Objeto" sortable />
            </DataTable>
        </div>
    );
}
