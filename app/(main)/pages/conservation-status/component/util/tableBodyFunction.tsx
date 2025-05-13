import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from 'primereact/button';
import React from 'react';
import { ConservationStatusResponse } from '@/app/service/ConservationStatusService';
import { ColumnProps } from 'primereact/column';
import styles from './ButtonStyles.module.css';
import { CountryResponse } from '@/app/service/CountryService';
import { Calendar } from 'primereact/calendar';

interface TableBodyFunctionProps {
    editData: (updatedConservationStatus: Partial<ConservationStatusResponse>) => Promise<void>;
    setDeleteDialog: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    setData: (value: (((prevState: ConservationStatusResponse) => ConservationStatusResponse) | ConservationStatusResponse)) => void
}

export function TableBodyFunction({
                                      editData,
                                      setData, setDeleteDialog
                                  }: TableBodyFunctionProps) {

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

    const actionBodyTemplate = (rowData: ConservationStatusResponse) => {
        return (
            <div>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-text p-button-warning"
                    tooltip="Editar Estado de Conservación"
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => editData(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-text p-button-danger"
                    tooltip="Eliminar Estado de Conservación"
                    tooltipOptions={{ position: 'top' }}
                    onClick={async () => {
                        setDeleteDialog(true);
                        setData(rowData);
                    }}
                />
            </div>
        );
    };

    const dateBodyTemplate = (rowData: CountryResponse, field: keyof CountryResponse) => {
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


    const columns: ColumnProps[] = [
        {
            field: 'name',
            header: 'Nombre',
            filter: true,
            filterPlaceholder: 'Buscar',
            sortable: true,
            headerStyle: { minWidth: '5rem' },
            filterHeaderStyle: { minWidth: '20rem' },
            showFilterMenu: false,
            style: { whiteSpace: 'nowrap' },
        },
        {
            field: 'description',
            filter: true,
            filterPlaceholder: 'Buscar',
            header: 'Descripción',
            sortable: true,
            headerStyle: { minWidth: '10rem', maxWidth: '20rem' }, // Agregamos maxWidth
            style: {
                whiteSpace: 'nowrap', // No permite saltos de línea
                overflow: 'hidden', // Oculta el contenido que no cabe
                textOverflow: 'ellipsis', // Muestra "..." al cortar
                maxWidth: '20rem' // Establece el ancho máximo de la celda
            },
            filterHeaderStyle: { minWidth: '20rem' },
            showFilterMenu: false,
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
            filterHeaderStyle: { minWidth: '22rem' },
            showFilterMenu: false,
            body: (rowData) => dateBodyTemplate(rowData, 'updatedAt')
        }
    ];

    return { columns, actionBodyTemplate };
}
