import { format, isValid  } from 'date-fns';
import { Button } from 'primereact/button';
import React from 'react';
import { CountryResponse } from '@/app/service/CountryService';
import { ColumnProps } from 'primereact/column';

interface TableBodyFunctionProps {
    editData: (updatedCountry: Partial<CountryResponse>) => Promise<void>;
    deleteData: (uuid: string) => Promise<void>;
}

export function TableBodyFunction({
                                      editData,
                                      deleteData
                                  }: TableBodyFunctionProps) {
    const nameBodyTemplate = (rowData: CountryResponse) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const actionBodyTemplate = (rowData: CountryResponse) => {
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
                    onClick={() => deleteData(rowData.uuid)}
                />
            </div>
        );
    };

    const dateBodyTemplate = (rowData: CountryResponse, field: keyof CountryResponse) => {
        const date = new Date(rowData[field]);
        return (
            <>
                <span className="p-column-title">{field}</span>
                {isValid(date) ? format(date, 'dd/MM/yyyy') : 'Fecha inválida'}
            </>
        );
    };


    const columns: ColumnProps[] = [
        {
            field: 'name',
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
