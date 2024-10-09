import * as XLSX from 'xlsx';
import { DataTable } from 'primereact/datatable';

export function createdExportExcel(dt: React.RefObject<DataTable<any[]>>) {
    return () => {
        const table = dt.current?.getTable();
        const worksheet = XLSX.utils.table_to_sheet(table);

        // Ajustar el ancho de las columnas automáticamente
        const colWidths: any = [];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        data.forEach((row: any) => {
            row.forEach((cell: any, index: number) => {
                const cellLength = cell ? cell.toString().length : 10;
                colWidths[index] = Math.max(colWidths[index] || 10, cellLength);
            });
        });
        worksheet['!cols'] = colWidths.map((width: any) => ({ wch: width }));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'data.xlsx');
    };
}
