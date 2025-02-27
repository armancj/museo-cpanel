import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from 'primereact/button';
import React from 'react';
import { ColumnProps } from 'primereact/column';
import styles from './ButtonStyles.module.css';
import { MunicipalityResponse } from '@/app/service/MunicipalityService';
import { Calendar } from 'primereact/calendar';
import { FilterMatchMode } from 'primereact/api';
import { convertToCode } from '@/app/(main)/utilities/convertToCode';


interface TableBodyFunctionProps {
    editData: (updatedCountry: Partial<MunicipalityResponse>) => Promise<void>;
    setDeleteDialog: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    setData: (value: (((prevState: MunicipalityResponse) => MunicipalityResponse) | MunicipalityResponse)) => void
}

export function TableBodyFunction({
                                      editData,
                                      setData, setDeleteDialog
                                  }: TableBodyFunctionProps) {
    const nameBodyTemplate = (rowData: MunicipalityResponse) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const provinceBodyTemplate = (rowData: MunicipalityResponse) => {
        const province = convertToCode(rowData.province);
        const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            e.currentTarget.src = '/demo/images/provinces/default.jpg';
        };

        return (
            <div className="p-column-title flex align-items-center gap-2">
                <img
                    alt="flag"
                    src={`/demo/images/provinces/${province}.png`}
                    onError={handleImageError}
                    style={{ width: '24px' }} />
                <span>{rowData.province}</span>
            </div>
        );
    };

    const actionBodyTemplate = (rowData: MunicipalityResponse) => {
        return (
            <div>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-text p-button-warning"
                    tooltip="Editar Municipio"
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => editData(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-text p-button-danger"
                    tooltip="Eliminar Municipio"
                    tooltipOptions={{ position: 'top' }}
                    onClick={async () => {
                        setDeleteDialog(true);
                        setData(rowData);
                    }}
                />
            </div>
        );
    };

    const dateBodyTemplate = (rowData: MunicipalityResponse, field: keyof MunicipalityResponse) => {
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


    const columns: ColumnProps[] = [
        {
            field: 'name',
            header: 'Nombre del Municipio',
            filter: true,
            filterPlaceholder: 'Buscar por municipio',
            sortable: true,
            headerStyle: { minWidth: '1rem' },
            style: { whiteSpace: 'nowrap' },
            body: nameBodyTemplate,
            filterHeaderStyle: { minWidth: '20rem' }
        },
        {
            field: 'province',
            header: 'Nombre de la Provincia',
            headerStyle: { minWidth: '5rem' },
            style: { whiteSpace: 'nowrap' },
            body: provinceBodyTemplate,
            filter: true,
            filterPlaceholder: 'Buscar por provincia',
            filterHeaderStyle: { minWidth: '20rem' }
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
            filterMatchMode: FilterMatchMode.DATE_IS,
            body: (rowData) => dateBodyTemplate(rowData, 'updatedAt')
        }
    ];

    return { columns, actionBodyTemplate };
}
