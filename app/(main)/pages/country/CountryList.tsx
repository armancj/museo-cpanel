import { useRef, useState } from 'react';
import { CountryResponse, emptyCountry } from '@/app/service/CountryService';
import { useHookCountry } from '@/app/(main)/pages/country/useHookCountry';
import { DataTable } from 'primereact/datatable';
import { createdExportExcel } from '@/app/(main)/pages/util/export.functions';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ToolbarCustom } from './component/ToolbarCustom';


export function CountryList() {

    const {
        selects,
        dialog,
        setDialog,
        save,
        data,
        setData,
        submitted,
        setSubmitted,
        toast,
        deleteCountry,
        editCountry
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
                        openNew={ openNew }
                    />
                </div>
            </div>
        </div>
    );
}
