import { useRef, useState } from 'react';
import { CulturalHeritageProperty, Status } from '@/app/(main)/pages/cultural-property-heritage/types';
import { useHookCulturalHeritageProperty } from './useHookCulturalHeritageProperty';
import { DataTable } from 'primereact/datatable';
import { createdExportExcel } from '@/app/(main)/pages/util/export.functions';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { FilterMatchMode } from 'primereact/api';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from 'primereact/calendar';
import { Toolbar } from 'primereact/toolbar';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { QRCodeDialog } from '@/app/common/component/QRCodeDialog';

interface CulturalHeritagePropertyListProps {
    onAddNew: () => void;
    onView?: () => void;
    onEdit?: () => void;
    hookData?: ReturnType<typeof useHookCulturalHeritageProperty>;
    heritageTypeOptions: { label: string; value: string }[];
}


export function CulturalHeritagePropertyList({ onAddNew, hookData, onView, onEdit, heritageTypeOptions }: CulturalHeritagePropertyListProps) {
    const [selects, setSelects] = useState<CulturalHeritageProperty[]>([]);
    const [qrDialogVisible, setQrDialogVisible] = useState<boolean>(false);
    const [selectedProperty, setSelectedProperty] = useState<CulturalHeritageProperty | null>(null);

    const {
        datum,
        data,
        setData,
        toast,
        editData,
        deleteData,
        deleteDialog,
        setDeleteDialog
        // eslint-disable-next-line react-hooks/rules-of-hooks
    } = hookData || useHookCulturalHeritageProperty();

    const processedDatum = (Array.isArray(datum) ? datum : []).map(item => ({
        ...item,
        // Convert only if they are not already Date objects
        createdAt: typeof item.createdAt === 'string' ? new Date(item.createdAt) : item.createdAt,
        updatedAt: typeof item.updatedAt === 'string' ? new Date(item.updatedAt) : item.updatedAt,
    }));

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        'culturalRecord.objectTitle.value': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'culturalRecord.objectDescription.value': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'entryAndLocation.heritageType.value': { value: null, matchMode: FilterMatchMode.EQUALS },
        'status': { value: null, matchMode: FilterMatchMode.EQUALS },
        createdAt: { value: null, matchMode: FilterMatchMode.DATE_IS },
        updatedAt: { value: null, matchMode: FilterMatchMode.DATE_IS },
    });

    const [globalFilter, setGlobalFilter] = useState<string>('');

    const dt = useRef<DataTable<CulturalHeritageProperty[]>>(null);

    const hideDeleteDialog = () => {
        setDeleteDialog(false);
    };

    const confirmDeleteSelected = () => {
        setDeleteDialog(true);
    };

    const exportExcel = createdExportExcel(dt);

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

    // Custom column templates
    const dateBodyTemplate = (rowData: CulturalHeritageProperty, field: keyof CulturalHeritageProperty) => {
        const date = new Date(rowData[field] as Date);
        return (
            <>
                <span className="p-column-title">{field}</span>
                {isValid(date) ? (
                    <span>
                        {format(date, 'dd/MM/yyyy hh:mm:ss a', { locale: es })}
                    </span>
                ) : (
                    'Fecha inválida'
                )}
            </>
        );
    };

    const objectTitleBodyTemplate = (rowData: CulturalHeritageProperty) => {
        return (
            <>
                <span className="p-column-title">Título</span>
                <div style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '10rem'
                }}>
                    {rowData.culturalRecord?.objectTitle?.value || 'Sin título'}
                </div>
            </>
        );
    };

    const objectDescriptionBodyTemplate = (rowData: CulturalHeritageProperty) => {
        const description = rowData.culturalRecord?.objectDescription?.value || '';
        return (
            <>
                <span className="p-column-title">Descripción</span>
                <div style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '20rem'
                }}>
                    {description || 'Sin descripción'}
                </div>
            </>
        );
    };

    const heritageTypeBodyTemplate = (rowData: CulturalHeritageProperty) => {
        return (
            <>
                <span className="p-column-title">Tipo de Patrimonio</span>
                {rowData.entryAndLocation?.heritageType?.value || 'No especificado'}
            </>
        );
    };

    const statusBodyTemplate = (rowData: CulturalHeritageProperty) => {
        // Check the status of the main fields to determine overall status
        const objectTitleStatus = rowData.culturalRecord?.objectTitle?.status;
        const objectDescriptionStatus = rowData.culturalRecord?.objectDescription?.status;

        let statusClass = 'bg-blue-100 text-blue-900'; // Default: Pending
        let statusText = 'Pendiente';

        if (objectTitleStatus === 'Has Issue' || objectDescriptionStatus === 'Has Issue') {
            statusClass = 'bg-red-100 text-red-900';
            statusText = 'Con Problemas';
        } else if (objectTitleStatus === 'To Review' || objectDescriptionStatus === 'To Review') {
            statusClass = 'bg-yellow-100 text-yellow-900';
            statusText = 'Para Revisar';
        } else if (objectTitleStatus === 'Reviewed' && objectDescriptionStatus === 'Reviewed') {
            statusClass = 'bg-green-100 text-green-900';
            statusText = 'Revisado';
        }

        return (
            <>
                <span className="p-column-title">Estado</span>
                <span className={`px-2 py-1 border-round ${statusClass}`}>
                    {statusText}
                </span>
            </>
        );
    };

    const actionBodyTemplate = (rowData: CulturalHeritageProperty) => {
        return (
            <div>
                <Button
                    icon="pi pi-eye"
                    className="p-button-rounded p-button-text p-button-info"
                    tooltip="Ver Detalles"
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => {
                        setData(rowData);
                        if (onView) {
                            onView();
                        }
                        else {
                            onAddNew(); // Fallback para compatibilidad
                        }
                    }}
                />
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-text p-button-warning"
                    tooltip="Editar Bien Patrimonial"
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => {
                        editData(rowData);
                        if (onEdit) {
                            onEdit();
                        } else {
                            onAddNew(); // Fallback para compatibilidad
                        }
                    }}
                />
                <Button
                    icon="pi pi-qrcode"
                    className="p-button-rounded p-button-text p-button-success"
                    tooltip="Generar Código QR"
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => {
                        setSelectedProperty(rowData);
                        setQrDialogVisible(true);
                    }}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-text p-button-danger"
                    tooltip="Eliminar Bien Patrimonial"
                    tooltipOptions={{ position: 'top' }}
                    onClick={async () => {
                        setDeleteDialog(true);
                        setData(rowData);
                    }}
                />
            </div>
        );
    };

    // Calendar filter template
    const calendarFilterTemplate = (options: any) => {
        return (
            <Calendar
                value={options.value}
                onChange={(e) => options.filterApplyCallback(e.value as Date)}
                dateFormat="dd/mm/yy"
                placeholder="Seleccionar fecha"
                showIcon
            />
        );
    };

    // Heritage type filter template
    const heritageTypeFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return (
            <Dropdown
                value={options.value}
                options={heritageTypeOptions}
                onChange={(e: DropdownChangeEvent) => options.filterApplyCallback(e.value)}
                optionLabel="label"
                placeholder="Seleccionar tipo"
                className="p-column-filter"
                showClear
                filter
                style={{ minWidth: '12rem' }}
            />
        );
    };

    // Status filter template
    const statusFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        const statusOptions = [
            { label: 'Pendiente', value: Status.Pending },
            { label: 'Para Revisar', value: Status.ToReview },
            { label: 'Revisado', value: Status.Reviewed },
            { label: 'Con Problemas', value: Status.HasIssue }
        ];

        return (
            <Dropdown
                value={options.value}
                options={statusOptions}
                onChange={(e: DropdownChangeEvent) => options.filterApplyCallback(e.value)}
                optionLabel="label"
                placeholder="Seleccionar estado"
                className="p-column-filter"
                showClear
                filter
                style={{ minWidth: '12rem' }}
            />
        );
    };

    // Toolbar template
    const leftToolbarTemplate = () => {
        return (
            <>
                <div className="my-2">
                    <Button label="Agregar Bien Patrimonial" icon="pi pi-plus" severity="success" className="mr-2" onClick={onAddNew} />
                    <Button label="Eliminar Bien Patrimonial" icon="pi pi-trash" severity="danger" onClick={() => {
                        if (selects.length) {
                            setData(selects[0]);
                            confirmDeleteSelected();
                        }
                    }} disabled={!selects || !selects.length} />
                </div>
            </>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <>
                <Button label="Exportar" icon="pi pi-upload" severity="help" onClick={exportExcel} />
            </>
        );
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>

                    <span className="block mt-2 md:mt-0 p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText type="search" value={globalFilter} onChange={onGlobalFilterChange} placeholder="Buscar..." />
                    </span>

                    <DataTable
                        ref={dt}
                        value={processedDatum}
                        selection={selects}
                        filters={filters}
                        onSelectionChange={(e) => setSelects(e.value as any)}
                        dataKey="uuid"
                        paginator
                        rows={10}
                        globalFilterFields={['culturalRecord.objectTitle.value', 'culturalRecord.objectDescription.value', 'entryAndLocation.heritageType.value', 'status']}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} bienes patrimoniales"
                        globalFilter={globalFilter || ''}
                        emptyMessage="No hay bienes patrimoniales agregados."
                        style={{ tableLayout: 'auto' }}
                        selectionMode="multiple"
                        filterDisplay="row"
                        scrollable
                        scrollHeight="500px"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }} />
                        <Column
                            field="culturalRecord.objectTitle.value"
                            header="Título"
                            body={objectTitleBodyTemplate}
                            filter
                            filterPlaceholder="Buscar"
                            sortable
                            headerStyle={{ minWidth: '10rem' }}
                            style={{ whiteSpace: 'nowrap' }}
                            filterHeaderStyle={{ minWidth: '10rem' }}
                            showFilterMenu={false}
                        />
                        <Column
                            field="culturalRecord.objectDescription.value"
                            header="Descripción"
                            body={objectDescriptionBodyTemplate}
                            filter
                            filterPlaceholder="Buscar"
                            sortable
                            headerStyle={{ minWidth: '10rem', maxWidth: '10rem' }}
                            style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '10rem'
                            }}
                            filterHeaderStyle={{ minWidth: '15rem' }}
                            showFilterMenu={false}
                        />
                        <Column
                            field="entryAndLocation.heritageType.value"
                            header="Tipo de Patrimonio"
                            body={heritageTypeBodyTemplate}
                            filter
                            sortable
                            headerStyle={{ minWidth: '10rem' }}
                            style={{ whiteSpace: 'nowrap' }}
                            filterHeaderStyle={{ minWidth: '10rem' }}
                            showFilterMenu={false}
                            filterElement={heritageTypeFilterTemplate}
                        />
                        <Column
                            field="status"
                            header="Estado"
                            body={statusBodyTemplate}
                            filter
                            sortable
                            headerStyle={{ minWidth: '8rem' }}
                            style={{ whiteSpace: 'nowrap' }}
                            filterHeaderStyle={{ minWidth: '10rem' }}
                            showFilterMenu={false}
                            filterElement={statusFilterTemplate}
                        />
                        <Column
                            field="createdAt"
                            header="Fecha de Creación"
                            body={(rowData) => dateBodyTemplate(rowData, 'createdAt')}
                            sortable
                            headerStyle={{ minWidth: '10rem' }}
                            style={{ whiteSpace: 'nowrap' }}
                            filter
                            filterElement={calendarFilterTemplate}
                            filterHeaderStyle={{ minWidth: '16rem' }}
                            showFilterMenu={false}
                        />
                        <Column
                            field="updatedAt"
                            header="Fecha de Actualización"
                            body={(rowData) => dateBodyTemplate(rowData, 'updatedAt')}
                            sortable
                            headerStyle={{ minWidth: '10rem' }}
                            style={{ whiteSpace: 'nowrap' }}
                            filter
                            filterElement={calendarFilterTemplate}
                            filterHeaderStyle={{ minWidth: '16rem' }}
                            showFilterMenu={false}
                        />
                        <Column
                            body={actionBodyTemplate}
                            header="Acciones"
                            headerStyle={{ minWidth: '10rem' }}
                            bodyStyle={{ overflow: 'visible' }}
                        />
                    </DataTable>

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
                                    ¿Estás seguro de que deseas eliminar este bien patrimonial cultural?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    {/* QR Code Dialog */}
                    <QRCodeDialog
                        visible={qrDialogVisible}
                        onHide={() => setQrDialogVisible(false)}
                        uuid={selectedProperty?.uuid || ''}
                        title={selectedProperty?.culturalRecord?.objectTitle?.value || 'Bien Patrimonial'}
                    />
                </div>
            </div>
        </div>
    );
}
