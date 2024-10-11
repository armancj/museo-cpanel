import { DataTable } from 'primereact/datatable';
import { CountryResponse } from '@/app/service/CountryService';
import React from 'react';
import { TableBodyFunction } from './util/tableBodyFunction';
import { InputText } from 'primereact/inputtext';
import styles from '@/app/(main)/pages/user/component/UserTable.module.css';
import { Column } from 'primereact/column';


interface TableCustomProps {
    dt: React.RefObject<DataTable<CountryResponse[]>>,
    selects: CountryResponse[],
    globalFilter: string,
    setGlobalFilter: (value: (((prevState: string) => string) | string)) => void,
    editData: (updatedCountry: Partial<CountryResponse>) => Promise<void>,
    deleteData: (uuid: string) => Promise<void>,
    setSelects: (value: (((prevState: CountryResponse[]) => CountryResponse[]) | CountryResponse[])) => void,
    datum: CountryResponse[]
}

export function TableCustom({ dt, selects, globalFilter, setGlobalFilter, editData, deleteData, setSelects, datum }: TableCustomProps) {

    const {
        columns,
        actionBodyTemplate
    } = TableBodyFunction({  editData, deleteData });

    return (
        <>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    type="search"
                    onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                    placeholder="Buscar..."
                />
            </span>
            <DataTable
                ref={dt}
                value={Array.isArray(datum) ? datum : []}
                selection={selects}
                onSelectionChange={(e) => setSelects(e.value as any)}
                dataKey="uuid"
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                className="datatable-responsive"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuarios"
                globalFilter={globalFilter || ''}
                emptyMessage="No hay paises agregados."
                style={{ tableLayout: 'auto' }}
                selectionMode="multiple"
            >
                <Column selectionMode="multiple" headerStyle={{ width: '4rem' }} />
                {columns.map((col, i) => (
                    <Column
                        key={i}
                        field={col.field}
                        header={col.header}
                        sortable={col.sortable || false}
                        body={col.body|| undefined}
                        headerStyle={col.headerStyle || {}}
                        style={col.style || {}}
                    />
                ))}
            <Column body={actionBodyTemplate} header="Acciones" headerStyle={{ minWidth: '10rem' }} bodyStyle={{ overflow: 'visible' }} className={styles.stickyColumn} headerClassName={styles.stickyHeader} />
            </DataTable>
        </>
    );
}
