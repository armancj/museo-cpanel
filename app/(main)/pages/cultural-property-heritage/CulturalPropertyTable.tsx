import React, { useState, useRef } from 'react';
import { DataTable, DataTableExpandedRows, DataTableRowEvent, DataTableValueArray } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
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
import { ToolbarCommon } from '@/app/common/component/ToolbarCommon';
import styles from '@/app/(main)/pages/user/component/UserTable.module.css';
import { useHookCulturalProperty } from '@/app/(main)/pages/cultural-property-heritage/usehookCulturalProperty';
import { FilterMatchMode } from 'primereact/api';
import { emptyCulturalProperty } from '@/app/service/utilities/culturalproperty.data';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import CulturalPropertyForm from '@/app/(main)/pages/cultural-property-heritage/form-componenet/CulturalPropertyForm';

export default function CulturalPropertyTable() {
    const [culturalProperties, setCulturalProperties] = useState<CulturalPropertyModel[]>([]);
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);

    const {
        datum,
        dialog,
        setDialog,
        save,
        data,
        setData,
        submitted,
        toast,
        editData,
        deleteData,
        deleteDialog,
        setDeleteDialog
    } = useHookCulturalProperty();

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    const [globalFilter, setGlobalFilter] = useState<string>('');

    const dt = useRef<DataTable<CulturalPropertyModel[]>>(null);

    const openNew = () => {
        setData(emptyCulturalProperty);
        setDialog(true);
    };

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

    const hideDialog = () => {
        setDialog(false);
    };

    const hideDeleteDialog = () => {
        setDeleteDialog(false);
    };

    const confirmDeleteSelected = () => {
        setDeleteDialog(true);
    };

    const exportExcel = createdExportExcel(dt);

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
            {!expandedRows ? (
                    <Button icon="pi pi-angle-down" label="Expandir Todo" onClick={!expandedRows ? expandAll : collapseAll}
                            text />) :
                (<Button icon="pi pi-angle-up" label="Colapsar Todo" onClick={expandedRows ? collapseAll : expandAll}
                         text />)
            }
        </div>
    );

    const dialogFooter = (
        <>
            <Button
                label="Cancelar"
                icon="pi pi-times"
                text
                className="p-button-rounded p-button-danger p-button-outlined"
                onClick={hideDialog}
            />

            <Button
                label="Guardar"
                icon="pi pi-check"
                text
                onClick={() => save()}
                className="p-button-rounded p-button-success"
            />
        </>
    );

    const deleteDialogFooter = (
        <>
            <Button
                label="Cancelar"
                icon="pi pi-times"
                text
                onClick={hideDeleteDialog}
                className="p-button-rounded p-button-danger p-button-outlined"
            />
            <Button
                label="Aceptar"
                icon="pi pi-check"
                text
                className="p-button-rounded p-button-success"
                onClick={async () => {
                    await deleteData(data.uuid);
                    hideDeleteDialog();
                }}
            />
        </>
    );

    const actionBodyTemplate = (rowData: CulturalPropertyModel) => {
        return (
            <div>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-text p-button-warning"
                    tooltip="Editar País"
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => editData(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-text p-button-danger"
                    tooltip="Eliminar País"
                    tooltipOptions={{ position: 'top' }}
                    onClick={async () => {
                        setDeleteDialog(true);
                        setData(rowData);
                    }}
                />
            </div>
        );
    };

    const onGlobalFilterChange = (e: { target: { value: any; }; }) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilter(value);
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            {
                !dialog ? (
                    <>
                        {/* Barra de herramientas */}
                        <ToolbarCommon
                            selects={culturalProperties}
                            setDialog={setDialog}
                            confirmDeleteSelected={confirmDeleteSelected}
                            exportExcel={exportExcel}
                            openNew={openNew}
                        />

                        {/* Barra de búsqueda */}
                        <span className="block mt-2 mb-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    type="search"
                    value={globalFilter}
                    onChange={onGlobalFilterChange}
                    placeholder="Buscar..."
                />
            </span>

                        {/* Tabla */}
                        <DataTable
                            ref={dt}
                            value={Array.isArray(datum) ? datum : []}
                            filters={filters}
                            expandedRows={expandedRows}
                            selection={culturalProperties}
                            onRowToggle={(e) => setExpandedRows(e.data)}
                            onRowExpand={onRowExpand}
                            onRowCollapse={onRowCollapse}
                            rowExpansionTemplate={rowExpansionTemplate}
                            dataKey="uuid"
                            header={header}
                            selectionMode="multiple"
                            tableStyle={{ minWidth: '60rem' }}
                            onSelectionChange={(e) => setCulturalProperties(e.value as any)}
                            paginator
                            rows={10}
                            className="datatable-responsive"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} de objetos culturales"
                            globalFilter={globalFilter || ''}
                            emptyMessage="No hay patrimonio agregado de objetos culturales."
                            style={{ tableLayout: 'auto' }}
                        >
                            {/* Columnas */}
                            <Column expander style={{ width: '5rem' }} />
                            <Column
                                field="entryAndLocation.objectName"
                                header="Nombre del Objeto"
                                sortable
                            />
                            <Column
                                field="producerAuthor.producerAuthorNames"
                                header="Autor"
                                sortable
                            />
                            <Column
                                field="culturalRecord.objectTitle"
                                header="Título"
                                sortable
                            />
                            <Column
                                field="entryAndLocation.entryDate"
                                header="Fecha de Entrada"
                                sortable
                                body={(rowData) =>
                                    new Date(rowData.entryAndLocation?.entryDate).toLocaleDateString()
                                }
                            />
                            <Column
                                body={actionBodyTemplate}
                                header="Acciones"
                                headerStyle={{ minWidth: '10rem' }}
                                bodyStyle={{ overflow: 'visible' }}
                                className={styles.stickyColumn}
                                headerClassName={styles.stickyHeader}
                            />
                        </DataTable>
                    </>
                ) : (
                    <CulturalPropertyForm setDialog={hideDialog} />
                )
            }

            <Dialog
                visible={deleteDialog}
                header="Confirmar Eliminación"
                modal
                footer={deleteDialogFooter}
                onHide={hideDeleteDialog}
            >
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {data && (
                        <span>
                  ¿Estás seguro de que deseas eliminar a <b>{data.culturalRecord?.objectTitle}</b>?
                </span>
                    )}
                </div>
            </Dialog>
        </div>
    );
}
