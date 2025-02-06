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
import { createdExportExcel } from '@/app/(main)/pages/util/export.functions';
import { ToolbarCustom } from '@/app/(main)/pages/country/component/ToolbarCustom';
import { ToolbarCommon } from '@/app/common/component/ToolbarCommon';
import styles from '@/app/(main)/pages/user/component/UserTable.module.css';
import { CountryResponse } from '@/app/service/CountryService';


export default function CulturalPropertyTable() {
    const [culturalProperties, setCulturalProperties] = useState<CulturalPropertyModel[]>([]);
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);
    const toast = useRef<Toast>(null);

    const dt = useRef<DataTable<CulturalPropertyModel[]>>(null);
    useEffect(() => {
        CulturalPropertyService.getCulturalProperties().then((data) => setCulturalProperties(data));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const onRowExpand = (event: DataTableRowEvent) => {
        toast.current?.show({
            severity: 'info',
            summary: 'Fila expandida',
            detail: event.data.culturalRecord.objectTitle,
            life: 3000
        });
    };

    const onRowCollapse = (event: DataTableRowEvent) => {
        toast.current?.show({
            severity: 'success',
            summary: 'Fila colapsada',
            detail: event.data.culturalRecord.objectTitle,
            life: 3000
        });
    };

    const expandAll = () => {
        let _expandedRows: DataTableExpandedRows = {};

        culturalProperties.forEach((p) => (_expandedRows[`${p.uuid}`] = true));

        setExpandedRows(_expandedRows);
    };

    const collapseAll = () => {
        setExpandedRows(undefined);
    };

    const exportExcel = createdExportExcel(dt);

    const openNewCulturalObject = () => {
        console.log('add');
    };

    const deleteSelectedCulturalObject = (select: any) => {
        console.log(`delete`);
    };

    const exportCulturalObject = () => {
        console.log('Export');
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

    const createCulturalProperty = () => {
        alert('Creado por <NAME>');
    };
    const header = (
        <div className="flex flex-wrap justify-content-end gap-2">
            {!expandedRows ? (
                    <Button icon="pi pi-angle-down" label="Expandir Todo" onClick={!expandedRows ?  expandAll : collapseAll}
                            text />) :
                (<Button icon="pi pi-angle-up" label="Colapsar Todo" onClick={expandedRows ?  collapseAll : expandAll} text />)
            }
        </div>
    );

    const actionBodyTemplate = (rowData: CountryResponse) => {
        return (
            <div>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-text p-button-warning"
                    tooltip="Editar País"
                    tooltipOptions={{ position: 'top' }}
                    //onClick={() => editData(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-text p-button-danger"
                    tooltip="Eliminar País"
                    tooltipOptions={{ position: 'top' }}
                    onClick={async () => {
                        /*setDeleteDialog(true);
                        setData(rowData);*/
                    }}
                />
            </div>
        );
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <ToolbarCommon
                selects={culturalProperties}
                setDialog={(value) => console.log('Dialog status:', value)}
                confirmDeleteSelected={deleteSelectedCulturalObject}
                exportExcel={exportCulturalObject}
                openNew={openNewCulturalObject}
            />
            <DataTable value={culturalProperties} expandedRows={expandedRows}
                       onRowToggle={(e) => setExpandedRows(e.data)}
                       onRowExpand={onRowExpand} onRowCollapse={onRowCollapse}
                       rowExpansionTemplate={rowExpansionTemplate}
                       dataKey="uuid" header={header} tableStyle={{ minWidth: '60rem' }}>
                <Column expander style={{ width: '5rem' }} />
                <Column field="entryAndLocation.objectName" header="Nombre del Objeto" sortable />
                <Column field="producerAuthor.producerAuthorNames" header="Autor" sortable />
                <Column field="culturalRecord.objectTitle" header="Título" sortable />
                <Column field="entryAndLocation.entryDate" header="Fecha de Entrada" sortable
                        body={(rowData) => new Date(rowData.entryAndLocation.entryDate).toLocaleDateString()} />
                <Column body={actionBodyTemplate} header="Acciones" headerStyle={{ minWidth: '10rem' }} bodyStyle={{ overflow: 'visible' }} className={styles.stickyColumn} headerClassName={styles.stickyHeader} />
            </DataTable>
        </div>
    );
}
