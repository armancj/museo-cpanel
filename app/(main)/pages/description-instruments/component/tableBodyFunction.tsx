import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from 'primereact/button';
import React, { useState } from 'react';
import { ColumnFilterElementTemplateOptions, ColumnProps } from 'primereact/column';
import styles from '../../user/component/util/ButtonStyles.module.css';
import { Calendar } from 'primereact/calendar';
import { FilterMatchMode } from 'primereact/api';
import { Tag } from 'primereact/tag';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { DescriptionInstrumentsResponse } from '@/app/service/DescriptionInstrumentsService';


interface TableBodyFunctionProps {
    editData: (updatedCountry: Partial<DescriptionInstrumentsResponse>) => Promise<void>;
    setDeleteDialog: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    setData: (value: (((prevState: DescriptionInstrumentsResponse) => DescriptionInstrumentsResponse) | DescriptionInstrumentsResponse)) => void
}

export function TableBodyFunction({
                                      editData,
                                      setData, setDeleteDialog
                                  }: TableBodyFunctionProps) {

    const [statuses] = useState<{ label: string; value: boolean }[]>([
        { label: 'ACTIVADO', value: true },
        { label: 'DESACTIVADO', value: false },
    ]);

    const getSeverity = (status: boolean) => {
        return status ? 'success' : 'danger';
    };

    const statusItemTemplate = (option: { label: string; value: boolean }) => {
        return <Tag value={option.label} severity={getSeverity(option.value)} />;
    };


    const statusRowFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return (
            <Dropdown
                value={options.value}
                options={statuses}
                onChange={(e: DropdownChangeEvent) => options.filterApplyCallback(e.value)}
                optionLabel="label"
                placeholder="Selecciona uno"
                className="p-column-filter"
                showClear
                style={{ minWidth: '12rem' }}
                itemTemplate={statusItemTemplate}
            />
        );
    };


    const nameBodyTemplate = (rowData: DescriptionInstrumentsResponse) => {
        return (
            <>
                <span className="p-column-title">Name</span>
        {rowData.name}
        </>
    );
    };


    const actionBodyTemplate = (rowData: DescriptionInstrumentsResponse) => {
        return (
            <div>
                <Button
                    icon="pi pi-pencil"
        className="p-button-rounded p-button-text p-button-warning"
        tooltip="Editar Categorias de Museo"
        tooltipOptions={{ position: 'top' }}
        onClick={() => editData(rowData)}
        />
        <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-text p-button-danger"
        tooltip="Eliminar Categorias de Museo"
        tooltipOptions={{ position: 'top' }}
        onClick={async () => {
            setDeleteDialog(true);
            setData(rowData);
        }}
        />
        </div>
    );
    };

    const dateBodyTemplate = (rowData: DescriptionInstrumentsResponse, field: keyof DescriptionInstrumentsResponse) => {
        const date = new Date(rowData[field]);
        return (
            <>
                <span className="p-column-title">{field}</span>
        {isValid(date) ? (
            <span className={styles.formattedDate}>
                {format(date, 'dd/MM/yyyy hh:mm:ss a', { locale: es })}
            </span>
        ) : (
            'Invalid Date'
        )}
        </>
    );
    };

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

    const statusBodyTemplate = (rowData: DescriptionInstrumentsResponse) => {
        const status = rowData.active ? 'ACTIVADO' : 'DESACTIVADO';
        return <Tag value={status} severity={getSeverity(rowData.active)} />;
    };


    const columns: ColumnProps[] = [
        {
            field: 'name',
            header: 'Nombre',
            filter: true,
            filterPlaceholder: 'Buscar',
            sortable: true,
            headerStyle: { minWidth: '1rem' },
            filterHeaderStyle: { minWidth: '20rem' },
            style: { whiteSpace: 'nowrap' },
            showFilterMenu: false,
            body: nameBodyTemplate,
        },
        {
            field: "active",
            header:"Estado",
            filter: true,
            showFilterMenu: false,
            body:statusBodyTemplate,
            sortable: true,
            headerStyle:{ minWidth: '5rem'},
            filterElement: statusRowFilterTemplate,
            filterHeaderStyle: { minWidth: '22rem' },
            style: { minWidth: '12rem' }
        },
        {
            field: 'createdAt',
            header: 'Fecha de Creación',
            sortable: true,
            headerStyle: { minWidth: '10rem' },
            style: { whiteSpace: 'nowrap' },
            filter: true,
            filterElement: calendarFilterTemplate,
            filterHeaderStyle: { minWidth: '22rem' },
            filterMatchMode: FilterMatchMode.DATE_IS,
            showFilterMenu: false,
            body: (rowData) => dateBodyTemplate(rowData, 'createdAt')
        },
        {
            field: 'updatedAt',
            header: 'Fecha de Actualización',
            sortable: true,
            headerStyle: { minWidth: '10rem' },
            style: { whiteSpace: 'nowrap' },
            filter: true,
            filterElement: calendarFilterTemplate,
            showFilterMenu: false,
            filterHeaderStyle: { minWidth: '22rem' },
            //filterMatchMode: FilterMatchMode.DATE_IS,
            body: (rowData) => dateBodyTemplate(rowData, 'updatedAt')
        },
    ];

    return { columns, actionBodyTemplate };
}
