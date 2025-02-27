import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from 'primereact/button';
import React from 'react';
import { ColumnProps } from 'primereact/column';
import styles from './ButtonStyles.module.css';
import { InstitutionResponse } from '@/app/service/InstitutionService';
import { convertToCode } from '@/app/(main)/utilities/convertToCode';

interface TableBodyFunctionProps {
    editData: (updatedInstitution: Partial<InstitutionResponse>) => Promise<void>;
    setDeleteDialog: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    setData: (value: (((prevState: InstitutionResponse) => InstitutionResponse) | InstitutionResponse)) => void
}

export function TableBodyFunction({
                                      editData,
                                      setData,
                                      setDeleteDialog
                                  }: TableBodyFunctionProps) {
    const nameBodyTemplate = (rowData: InstitutionResponse) => {
        const institution = convertToCode(rowData.name);
        const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            e.currentTarget.src = '/demo/images/institutions/default.jpg';
        };

        return (
            <div className="p-column-title flex align-items-center gap-2">
                <img
                    alt="flag"
                    src={`/demo/images/institutions/${institution}.png`}
                    onError={handleImageError}
                    style={{ width: '24px' }} />
                <span>{rowData.name}</span>
            </div>
        );
    };

    const countryCodes: { [key: string]: string } = {
        'estados unidos': 'us',
        'canada': 'ca',
        'méxico': 'mx',
        'brasil': 'br',
        'argentina': 'ar',
        'reino unido': 'gb',
        'francia': 'fr',
        'alemania': 'de',
        'italia': 'it',
        'españa': 'es',
        'rusia': 'ru',
        'china': 'cn',
        'japón': 'jp',
        'india': 'in',
        'australia': 'au',
        'sudáfrica': 'za',
        'cuba': 'cu'
    };

    const countryBodyTemplate = (rowData: InstitutionResponse) => {
        const codeCountry = countryCodes[rowData.country.toLowerCase()];
        return (
            <div className="flex align-items-center gap-2">
                <img alt="flag" src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
                     className={`flag flag-${codeCountry}`} style={{ width: '24px' }} />
                <span>{rowData.country}</span>
            </div>
        );
    };

    const actionBodyTemplate = (rowData: InstitutionResponse) => {
        return (
            <div>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-text p-button-warning"
                    tooltip="Editar Institución"
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => editData(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-text p-button-danger"
                    tooltip="Eliminar Institución"
                    tooltipOptions={{ position: 'top' }}
                    onClick={async () => {
                        setDeleteDialog(true);
                        setData(rowData);
                    }}
                />
            </div>
        );
    };

    const dateBodyTemplate = (rowData: InstitutionResponse, field: keyof InstitutionResponse) => {
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
            header: 'Nombre de la Institución',
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
            filter: true,
            filterPlaceholder: 'Buscar por país',
            filterField: 'country',
            body: countryBodyTemplate
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
