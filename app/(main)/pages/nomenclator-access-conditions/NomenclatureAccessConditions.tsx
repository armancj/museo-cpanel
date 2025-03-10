import React, { useRef, useState } from 'react';
import {
    DataTable,
    DataTableFilterMeta,
} from 'primereact/datatable';
import { FilterMatchMode } from 'primereact/api';
import { createdExportExcel } from '@/app/(main)/pages/util/export.functions';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { ToolbarCustom } from './component/ToolbarCustom';
import { TableCustom } from './component/TableCustom';
import {
    emptyNomenclatureAccessConditions,
    NomenclatureAccessConditionsResponse,
} from '@/app/service/NomenclatureAccessConditionsService';
import NomenclatureAccessConditionsForm
    from '@/app/(main)/pages/nomenclator-access-conditions/component/NomenclatureAccessConditionsForm';
import {
    useHookNomenclatureAccessConditions
} from '@/app/(main)/pages/nomenclator-access-conditions/useHookNomenclatureAccessConditions';

export default function NomenclatureAccessConditions() {
    const [selects, setSelects] = useState<NomenclatureAccessConditionsResponse[]>([]);
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
    } = useHookNomenclatureAccessConditions()

    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH},
        description: { value: null, matchMode: FilterMatchMode.STARTS_WITH},
        active: { value: null, matchMode: FilterMatchMode.EQUALS },
        createdAt: {value: null, matchMode: FilterMatchMode.DATE_IS},
        updatedAt: {value: null, matchMode: FilterMatchMode.DATE_IS},
    });
    const [globalFilter, setGlobalFilter] = useState<string>('');

    const dt = useRef<DataTable<NomenclatureAccessConditionsResponse[]>>(null);

    const openNew = () => {
        setData(emptyNomenclatureAccessConditions);
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

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFilters(prevFilters => ({
            ...prevFilters,
            global: { value, matchMode: FilterMatchMode.CONTAINS }
        }));
        setGlobalFilter(value);
    };

    function getOnInputChange() {
        return (e: any, field: any) => {
            let value: string | boolean;

            if (field === 'active' && e.target instanceof HTMLInputElement) {
                value = e.target.checked;
            } else {
                value = e.target.value;
            }

            setData({ ...data, [field]: value });
        };
    }

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
                        setDeleteDialog={setDeleteDialog}
                        setData={setData}
                        onGlobalFilterChange={onGlobalFilterChange}
                    />
                    <Dialog
                        visible={dialog}
                        header="Detalles"
                        modal
                        className="p-fluid"
                        footer={dialogFooter}
                        onHide={hideDialog}
                    >
                        <NomenclatureAccessConditionsForm
                            data={data}
                            submitted={submitted}
                            setSubmitted={setSubmitted}
                            onInputChange={getOnInputChange()}
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
