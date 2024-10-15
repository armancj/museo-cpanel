import { useRef, useState } from 'react';
import { CountryResponse, emptyCountry } from '@/app/service/CountryService';
import { useHookCountry } from '@/app/(main)/pages/country/useHookCountry';
import { DataTable } from 'primereact/datatable';
import { createdExportExcel } from '@/app/(main)/pages/util/export.functions';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ToolbarCustom } from './component/ToolbarCustom';
import { TableCustom } from '@/app/(main)/pages/country/component/TableCustom';
import { Dialog } from 'primereact/dialog';
import { DataForm } from '@/app/(main)/pages/country/component/DataForm';
import { FilterMatchMode } from 'primereact/api';


export function CountryList() {

    const [selects, setSelects] = useState<CountryResponse[]>([]);

    const {
        datum,
        dialog,
        setDialog,
        save,
        data,
        setData,
        submitted,
        setSubmitted,
        toast,
        editData,
        deleteData,
        deleteDialog,
        setDeleteDialog
    } = useHookCountry();

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    const [globalFilter, setGlobalFilter] = useState<string>('');

    const dt = useRef<DataTable<CountryResponse[]>>(null);

    const openNew = () => {
        setData(emptyCountry);
        setDialog(true);
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

    const onGlobalFilterChange = (e: { target: { value: any; }; }) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilter(value);
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <ToolbarCustom
                        selects={selects}
                        setDialog={setDialog}
                        confirmDeleteSelected={confirmDeleteSelected}
                        exportExcel={exportExcel}
                        openNew={openNew}
                    />
                    <TableCustom
                        dt={dt}
                        datum={Array.isArray(datum) ? datum : []}
                        selects={selects}
                        setSelects={setSelects}
                        globalFilter={globalFilter}
                        filters={filters}
                        editData={editData}
                        onGlobalFilterChange={onGlobalFilterChange}
                        setDeleteDialog={setDeleteDialog}
                        setData={setData}
                    />
                    <Dialog visible={dialog} header="Detalles de paises" modal className="p-fluid" footer={dialogFooter}
                            onHide={hideDialog}>
                        <DataForm
                            data={data}
                            onInputChange={(e, field) => setData({ ...data, [field]: e.target.value })}
                            submitted={submitted}
                        />
                    </Dialog>
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
                  ¿Estás seguro de que deseas eliminar a <b>{data.name}</b>?
                </span>
                            )}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    );
}
