import { DataTable } from 'primereact/datatable';
import React from 'react';
import { TableBodyFunction } from './util/tableBodyFunction';
import { InputText } from 'primereact/inputtext';
import styles from '@/app/(main)/pages/user/component/UserTable.module.css';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { InstitutionResponse } from '@/app/service/InstitutionService';

interface TableCustomProps {
    dt: React.RefObject<DataTable<InstitutionResponse[]>>,
    selects: InstitutionResponse[],
    globalFilter: string,
    editData: (updatedInstitution: Partial<InstitutionResponse>) => Promise<void>,
    setSelects: (value: (((prevState: InstitutionResponse[]) => InstitutionResponse[]) | InstitutionResponse[])) => void,
    datum: InstitutionResponse[],
    onGlobalFilterChange: (e: { target: { value: any } }) => void,
    filters: { global: { value: null, matchMode: FilterMatchMode } },
    setDeleteDialog: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    setData: (value: (((prevState: InstitutionResponse) => InstitutionResponse) | InstitutionResponse)) => void
}

export function TableCustom({
                                dt,
                                selects,
                                globalFilter,
                                editData,
                                setSelects,
                                datum,
                                onGlobalFilterChange,
                                filters,
                                setDeleteDialog,
                                setData
                            }: TableCustomProps) {

    const {
        columns,
        actionBodyTemplate
    } = TableBodyFunction({ editData, setDeleteDialog, setData });

    return (
        <>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    type="search"
                    value={globalFilter}
                    onChange={onGlobalFilterChange}
                    placeholder="Buscar..."
                />
            </span>
            <DataTable
                ref={dt}
                value={Array.isArray(datum) ? datum : []}
                selection={selects}
                filters={filters}
                onSelectionChange={(e) => setSelects(e.value as any)}
                dataKey="uuid"
                paginator
                rows={10}
                globalFilterFields={['name', 'country']}
                rowsPerPageOptions={[5, 10, 25]}
                className="datatable-responsive"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} instituciones"
                globalFilter={globalFilter || ''}
                emptyMessage="No hay instituciones agregadas."
                style={{ tableLayout: 'auto' }}
                selectionMode="multiple"
            >
                <Column selectionMode="multiple" headerStyle={{ width: '4rem' }} />
                {columns.map((col: any, i: any) => (
                    <Column
                        key={i}
                        field={col.field}
                        header={col.header}
                        sortable={col.sortable || false}
                        body={col.body || undefined}
                        headerStyle={col.headerStyle || {}}
                        style={col.style || {}}
                    />
                ))}
                <Column body={actionBodyTemplate} header="Acciones" headerStyle={{ minWidth: '10rem' }} bodyStyle={{ overflow: 'visible' }} className={styles.stickyColumn} headerClassName={styles.stickyHeader} />
            </DataTable>
        </>
    );
}
