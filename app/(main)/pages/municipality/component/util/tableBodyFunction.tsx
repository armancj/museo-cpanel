import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from 'primereact/button';
import React from 'react';
import { ColumnProps } from 'primereact/column';
import styles from './ButtonStyles.module.css';
import { MunicipalityResponse } from '@/app/service/MunicipalityService';


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


    const columns: ColumnProps[] = [
        {
            field: 'name',
            header: 'Nombre del Municipio',
            filter: true,
            filterPlaceholder: 'Buscar por nombre',
            sortable: true,
            headerStyle: { minWidth: '5rem' },
            style: { whiteSpace: 'nowrap' },
            body: nameBodyTemplate
        },
        {
            field: 'province',
            header: 'Nombre de la Provincia',
            headerStyle: { minWidth: '5rem' },
            style: { whiteSpace: 'nowrap' },
            filter: true,
            filterPlaceholder: 'Buscar por province',
        },
        {
            field: 'createdAt',
            header: 'Fecha de Creación',
            sortable: true,
            headerStyle: { minWidth: '10rem' },
            style: { whiteSpace: 'nowrap' },
            body: (rowData) => dateBodyTemplate(rowData, 'createdAt')
        },
        {
            field: 'updatedAt',
            header: 'Fecha de Actualización',
            sortable: true,
            headerStyle: { minWidth: '10rem' },
            style: { whiteSpace: 'nowrap' },
            body: (rowData) => dateBodyTemplate(rowData, 'updatedAt')
        }
    ];

    return { columns, actionBodyTemplate };
}
