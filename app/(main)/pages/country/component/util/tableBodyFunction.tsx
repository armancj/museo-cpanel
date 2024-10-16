import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from 'primereact/button';
import React from 'react';
import { CountryResponse } from '@/app/service/CountryService';
import { ColumnProps } from 'primereact/column';
import styles from './ButtonStyles.module.css';
import { ProvinceResponse } from '@/app/service/ProvinceService';

interface TableBodyFunctionProps {
    editData: (updatedCountry: Partial<CountryResponse>) => Promise<void>;
    setDeleteDialog: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    setData: (value: (((prevState: CountryResponse) => CountryResponse) | CountryResponse)) => void
}

export function TableBodyFunction({
                                      editData,
                                      setData, setDeleteDialog
                                  }: TableBodyFunctionProps) {

    const countryCodes: { [key: string]: string } = {
        "estados unidos": "us",
        "canada": "ca",
        "méxico": "mx",
        "brasil": "br",
        "argentina": "ar",
        "reino Unido": "gb",
        "francia": "fr",
        "alemania": "de",
        "italia": "it",
        "españa": "es",
        "rusia": "ru",
        "china": "cn",
        "japón": "jp",
        "india": "in",
        "australia": "au",
        "sudáfrica": "za",
        "cuba": "cu"
    };
    const nameBodyTemplate = (rowData: ProvinceResponse) => {
        const codeCountry =countryCodes[rowData.name.toLowerCase()];
        return (
            <div className="p-column-title flex align-items-center gap-2">
                <img alt="flag" src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`flag flag-${codeCountry}`} style={{ width: '24px' }} />
                <span>{rowData.name}</span>
            </div>
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
