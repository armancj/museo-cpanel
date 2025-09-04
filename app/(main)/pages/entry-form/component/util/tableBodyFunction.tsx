import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from 'primereact/button';
import React from 'react';
import { EntryFormResponse } from '@/app/service/EntryFormService';
import { ColumnProps } from 'primereact/column';
import styles from './ButtonStyles.module.css';

interface TableBodyFunctionProps {
    editData: (updatedEntryForm: Partial<EntryFormResponse>) => Promise<void>;
    setDeleteDialog: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    setData: (value: (((prevState: EntryFormResponse) => EntryFormResponse) | EntryFormResponse)) => void
}

export function TableBodyFunction({
                                      editData,
                                      setData, setDeleteDialog
                                  }: TableBodyFunctionProps) {

    const actionBodyTemplate = (rowData: EntryFormResponse) => {
        return (
            <div>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-text p-button-warning"
                    tooltip="Editar Formulario de Entrada"
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => editData(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-text p-button-danger"
                    tooltip="Eliminar Formulario de Entrada"
                    tooltipOptions={{ position: 'top' }}
                    onClick={async () => {
                        setDeleteDialog(true);
                        setData(rowData);
                    }}
                />
            </div>
        );
    };

    const dateBodyTemplate = (rowData: EntryFormResponse, field: keyof EntryFormResponse) => {
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
            sortable: true,
            headerStyle: { minWidth: '5rem' },
            style: { whiteSpace: 'nowrap' }
        },
        {
            field: 'description',
            header: 'Descripción',
            sortable: true,
            headerStyle: { minWidth: '10rem' },
            style: { whiteSpace: 'nowrap' }
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
