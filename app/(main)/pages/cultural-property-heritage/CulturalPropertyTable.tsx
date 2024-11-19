import React, { useState, useEffect, useRef } from 'react';
import { DataTable, DataTableExpandedRows, DataTableRowEvent, DataTableValueArray } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { CulturalPropertyService } from '@/app/service/CulturalPropertyService';
import { CulturalPropertyModel } from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';
import AuthorInfoPanel from '@/app/(main)/pages/cultural-property-heritage/panel-component/AuthorInfoPanel';
import CulturalRecordPanel from '@/app/(main)/pages/cultural-property-heritage/panel-component/CulturalRecordPanel';
import AccessAndUseConditionsPanel
    from '@/app/(main)/pages/cultural-property-heritage/panel-component/AccessAndUseConditionsPanel';
import EntryAndLocationPanel from '@/app/(main)/pages/cultural-property-heritage/panel-component/EntryAndLocationPanel';
import DescriptionControlPanel
    from '@/app/(main)/pages/cultural-property-heritage/panel-component/DescriptionControlPanel';
import NotesPanel from '@/app/(main)/pages/cultural-property-heritage/panel-component/NotesPanel';

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
                <h5>Detalles del objeto: {data.culturalRecord.objectTitle}</h5>
                <div className="p-grid p-fluid">
                    <div className="p-col-12 p-md-6">
                        <AuthorInfoPanel producerAuthor={data.producerAuthor} />
                        <AccessAndUseConditionsPanel accessAndUseConditions={data.accessAndUseConditions} />
                        <CulturalRecordPanel culturalRecord={data.culturalRecord} />
                    </div>
                    <div className="p-col-12 p-md-6">
                        <EntryAndLocationPanel entryAndLocation={data.entryAndLocation} />
                        <DescriptionControlPanel descriptionControl={data.descriptionControl} />
                        <NotesPanel notes={data.notes} />
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
                <Column field="entryAndLocation.objectName" header="Nombre del Objeto" sortable />
                <Column field="producerAuthor.producerAuthorNames" header="Autor" sortable />
                <Column field="culturalRecord.objectTitle" header="Título" sortable />
                <Column field="entryAndLocation.entryDate" header="Fecha de Entrada" sortable body={(rowData) => new Date(rowData.entryAndLocation.entryDate).toLocaleDateString()} />
            </DataTable>
        </div>
    );
}
