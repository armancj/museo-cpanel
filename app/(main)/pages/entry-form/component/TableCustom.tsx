import { DataTable } from 'primereact/datatable';
import { EntryFormResponse } from '@/app/service/EntryFormService';
import React from 'react';
import { TableBodyFunction } from './util/tableBodyFunction';
import { InputText } from 'primereact/inputtext';
import styles from '@/app/(main)/pages/user/component/UserTable.module.css';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';


interface TableCustomProps {
    dt: React.RefObject<DataTable<EntryFormResponse[]>>,
    selects: EntryFormResponse[],
    globalFilter: string,
    editData: (updatedEntryForm: Partial<EntryFormResponse>) => Promise<void>,
    setSelects: (value: (((prevState: EntryFormResponse[]) => EntryFormResponse[]) | EntryFormResponse[])) => void,
    datum: EntryFormResponse[],
    onGlobalFilterChange: (e: { target: { value: any } }) => void,
    filters: { global: { value: null, matchMode: FilterMatchMode } },
    setDeleteDialog: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    setData: (value: (((prevState: EntryFormResponse) => EntryFormResponse) | EntryFormResponse)) => void
}

export function TableCustom({ dt, selects, globalFilter, editData, setSelects, datum, onGlobalFilterChange, filters, setDeleteDialog, setData }: Readonly<TableCustomProps>) {
    const { columns, actionBodyTemplate } = TableBodyFunction({ editData, setDeleteDialog, setData });

    return (
        <>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" value={globalFilter} onChange={onGlobalFilterChange} placeholder="Buscar..." />
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
                globalFilterFields={['name', 'description']}
                rowsPerPageOptions={[5, 10, 25]}
                className="datatable-responsive"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} formularios de entrada"
                globalFilter={globalFilter || ''}
                emptyMessage="No hay formularios de entrada agregados."
                style={{ tableLayout: 'auto' }}
                selectionMode="multiple"
                filterDisplay="row"
                scrollable
                scrollHeight="500px"
            >
                <Column selectionMode="multiple" headerStyle={{ width: '4rem' }} />
                {columns.map((col, i) => (
                    <Column key={i} {...col} />
                ))}
                <Column body={actionBodyTemplate} header="Acciones" headerStyle={{ minWidth: '10rem' }} bodyStyle={{ overflow: 'visible' }} className={styles.stickyColumn} headerClassName={styles.stickyHeader} />
            </DataTable>
        </>
    );
}
