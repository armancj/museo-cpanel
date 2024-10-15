import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from 'primereact/button';
import React from 'react';
import { ColumnProps } from 'primereact/column';
import styles from './ButtonStyles.module.css';
import { ProvinceResponse } from '@/app/service/ProvinceService';

interface TableBodyFunctionProps {
    editData: (updatedCountry: Partial<ProvinceResponse>) => Promise<void>;
    setDeleteDialog: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    setData: (value: (((prevState: ProvinceResponse) => ProvinceResponse) | ProvinceResponse)) => void
}

export function TableBodyFunction({
                                      editData,
                                      setData, setDeleteDialog
                                  }: TableBodyFunctionProps) {
    const nameBodyTemplate = (rowData: ProvinceResponse) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const actionBodyTemplate = (rowData: ProvinceResponse) => {
        return (
            <div>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-text p-button-warning"
                    tooltip="Editar País"
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => editData(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-text p-button-danger"
                    tooltip="Eliminar País"
                    tooltipOptions={{ position: 'top' }}
                    onClick={async () => {
                        setDeleteDialog(true);
                        setData(rowData);
                    }}
                />
            </div>
        );
    };

    const dateBodyTemplate = (rowData: ProvinceResponse, field: keyof ProvinceResponse) => {
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
            header: 'Nombre de la Provincia',
            sortable: true,
            headerStyle: { minWidth: '5rem' },
            style: { whiteSpace: 'nowrap' },
            body: nameBodyTemplate
        },
        {
            field: 'country',
            header: 'Nombre del País',
            sortable: true,
            headerStyle: { minWidth: '5rem' },
            style: { whiteSpace: 'nowrap' },
            body: nameBodyTemplate
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
