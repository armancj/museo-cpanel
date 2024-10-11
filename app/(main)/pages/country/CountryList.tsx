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
        deleteData

    } = useHookCountry();

    const [deleteDialog, setDeleteDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');

    const dt = useRef<DataTable<CountryResponse[]>>(null);

    const openNew = () => {
        setData(emptyCountry);
        setDialog(true);
    };

    const hideDialog = () => {
        setDialog(false);
    };

    const confirmDeleteSelected = () => {
        setDeleteDialog(true);
    };

    const exportExcel = createdExportExcel(dt);

    const dialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" text onClick={() => save()} />
        </>
    );

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
                        setGlobalFilter={setGlobalFilter}
                        editData={editData}
                        deleteData={deleteData}
                    />
                    <Dialog visible={dialog} header="Detalles de paises" modal className="p-fluid" footer={dialogFooter} onHide={hideDialog}>
                        <DataForm
                            data={data}
                            onInputChange={(e, field) => setData({ ...data, [field]: e.target.value })}
                            submitted={submitted}
                        />
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
