'use client';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatDate } from '@/app/(main)/pages/util/export.functions';

interface HistoryDialogProps {
    visible: boolean;
    onHide: () => void;
    field: any;
    title: string;
}

export const HistoryDialog = ({ visible, onHide, field, title }: HistoryDialogProps) => {
    // If field is null or has no history, return empty dialog
    if (!field || !field.history || field.history.length === 0) {
        return (
            <Dialog
                header={`Historial de ${title}`}
                visible={visible}
                style={{ width: '50vw' }}
                onHide={onHide}
                modal
                footer={null}
            >
                <div className="p-4 text-center">
                    No hay historial disponible para este campo.
                </div>
            </Dialog>
        );
    }

    // Format date for display
    const dateBodyTemplate = (rowData: any) => {
        return formatDate(new Date(rowData.modifiedAt));
    };

    // Format value for display based on type
    const valueBodyTemplate = (rowData: any) => {
        const value = rowData.previousValue;

        if (value === null || value === undefined) {
            return 'No definido';
        }

        if (Array.isArray(value)) {
            return value.join(', ');
        }

        if (typeof value === 'object') {
            // Handle special object types
            if ('start' in value && 'end' in value) {
                // Date range
                return `${formatDate(new Date(value.start))} - ${formatDate(new Date(value.end))}`;
            }

            // Generic object
            return JSON.stringify(value);
        }

        if (typeof value === 'boolean') {
            return value ? 'Sí' : 'No';
        }

        return value.toString();
    };

    return (
        <Dialog
            header={`Historial de ${title}`}
            visible={visible}
            style={{ width: '70vw' }}
            onHide={onHide}
            modal
            footer={null}
        >
            <DataTable value={field.history} paginator rows={5} rowsPerPageOptions={[5, 10, 25]} tableStyle={{ minWidth: '50rem' }}>
                <Column field="modifiedBy" header="Modificado por" sortable style={{ width: '20%' }}></Column>
                <Column field="modifiedAt" header="Fecha de modificación" body={dateBodyTemplate} sortable style={{ width: '20%' }}></Column>
                <Column field="previousValue" header="Valor anterior" body={valueBodyTemplate} style={{ width: '40%' }}></Column>
                <Column field="comment" header="Comentario" style={{ width: '20%' }}></Column>
                <Column field="status" header="Estado" sortable style={{ width: '15%' }}></Column>
            </DataTable>
        </Dialog>
    );
};
