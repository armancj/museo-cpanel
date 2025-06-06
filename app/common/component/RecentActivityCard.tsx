'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { DashboardService } from '@/app/service/DashboardService';
import { CulturalPropertyModel } from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';
import * as XLSX from 'xlsx';

// Función para exportar datos en formato CSV
const exportToExcel = (data: CulturalPropertyModel[], fileName: string) => {
    if (data.length === 0) {
        alert('No hay actividades recientes para exportar.');
        return;
    }

    // Generar los encabezados y las filas de datos
    const headers = ['Nombre del Objeto', 'Tipo de Patrimonio', 'Fecha de Creación'];
    const rows = data.map((entry) => [
        entry.culturalRecord?.objectTitle?.value || 'N/A',
        entry.entryAndLocation?.heritageType?.value || 'N/A',
        new Date(entry.createdAt).toLocaleDateString('es-ES')
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    const columnWidths = headers.map((header, index) =>
        Math.max(
            header.length, // Largo del encabezado
            ...rows.map((row) => row[index]?.toString().length || 0) // Largo de cada celda en esa columna
        )
    );

    worksheet['!cols'] = columnWidths.map((width) => ({ wch: width + 2 })); // +2 para agregar un margen adicional

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos Exportados');

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

// Función que retorna el icono basado en el valor de heritageType
const heritageMap = new Map<string, { icon: string; color: string; bgColor: string }>([
    ['Nombre', { icon: 'pi pi-question-circle', color: 'text-gray-500', bgColor: 'bg-gray-100' }],
    ['Natural', { icon: 'pi pi-leaf', color: 'text-green-500', bgColor: 'bg-green-100' }],
    ['Tangible', { icon: 'pi pi-box', color: 'text-orange-500', bgColor: 'bg-orange-100' }],
    ['Mixto', { icon: 'pi pi-clone', color: 'text-purple-500', bgColor: 'bg-purple-100' }],
    ['Mueble', { icon: 'pi pi-home', color: 'text-teal-500', bgColor: 'bg-teal-100' }],
    ['Intangible', { icon: 'pi pi-sliders-h', color: 'text-yellow-500', bgColor: 'bg-yellow-100' }],
    ['Inmueble', { icon: 'pi pi-building', color: 'text-blue-500', bgColor: 'bg-blue-100' }],
    ['Documental', { icon: 'pi pi-file', color: 'text-red-500', bgColor: 'bg-red-100' }],
    ['Digital', { icon: 'pi pi-desktop', color: 'text-indigo-500', bgColor: 'bg-indigo-100' }],
    ['Industrial', { icon: 'pi pi-cog', color: 'text-gray-700', bgColor: 'bg-gray-200' }],
    ['Arqueológico', { icon: 'pi pi-globe', color: 'text-brown-500', bgColor: 'bg-yellow-200' }],
    ['Subacuático', { icon: 'pi pi-compass', color: 'text-cyan-500', bgColor: 'bg-cyan-100' }],
    ['Local', { icon: 'pi pi-map-marker', color: 'text-pink-500', bgColor: 'bg-pink-100' }],
    ['Mundial', { icon: 'pi pi-world', color: 'text-amber-500', bgColor: 'bg-amber-100' }],
    ['Nacional', { icon: 'pi pi-flag', color: 'text-lime-500', bgColor: 'bg-lime-100' }],
    ['Cultural', { icon: 'pi pi-palette', color: 'text-blue-700', bgColor: 'bg-blue-200' }],
    ['Otro', { icon: 'pi pi-question-circle', color: 'text-gray-400', bgColor: 'bg-gray-100' }]
]);


const getHeritageData = (heritageType: string | undefined): { icon: string; color: string, bgColor: string } => {
    if (!heritageType) return { icon: 'pi pi-palette', color: 'text-blue-700', bgColor: 'bg-blue-200' };

    // @ts-ignore
    for (const [key, data] of heritageMap.entries()) {
        if (heritageType.includes(key)) {
            return data;
        }
    }

    // Si no hay coincidencias, valores por defecto
    return { icon: 'pi pi-palette', color: 'text-blue-700', bgColor: 'bg-blue-200'  };
};



// Componente de "Actividad Reciente"
const RecentActivityCard = () => {
    const menuRef = useRef<Menu | null>(null);
    const [latestEntries, setLatestEntries] = useState<CulturalPropertyModel[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Función para obtener datos actualizados
    const fetchLatestEntries = async () => {
        try {
            setLoading(true);
            const activities = await DashboardService.getLatestEntries(); // Llamar al backend
            setLatestEntries(activities); // Actualizar el estado
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener actividades recientes:', error);
            setLoading(false);
        }
    };

    // Cargar datos al montar el componente
    useEffect(() => {
        fetchLatestEntries();
    }, []);

    return (
        <>
            <div className="flex align-items-center justify-content-between mb-4">
                <h5>Actividad Reciente</h5>
                <div>
                    <Button
                        type="button"
                        icon="pi pi-ellipsis-v"
                        rounded
                        text
                        className="p-button-plain"
                        onClick={(event) => menuRef.current?.toggle(event)}
                    />
                    <Menu
                        ref={menuRef}
                        popup
                        model={[
                            {
                                label: 'Exportar',
                                icon: 'pi pi-fw pi-file-export',
                                command: () => exportToExcel
                                (latestEntries, 'actividades_recientes')
                            },
                            {
                                label: 'Actualizar',
                                icon: 'pi pi-fw pi-refresh',
                                command: fetchLatestEntries // Actualizar
                            }
                        ]}
                    />
                </div>
            </div>

            <span className="block text-600 font-medium mb-3">ÚLTIMOS INGRESOS</span>

            {/* Contenido de actividades recientes */}
            {loading ? (
                <div className="flex justify-content-center p-3">
                    <i className="pi pi-spin pi-spinner" style={{ fontSize: '1.5rem' }}></i>
                </div>
            ) : latestEntries.length > 0 ? (
                <ul className="p-0 mx-0 mt-0 mb-4 list-none">
                    {latestEntries.slice(0, 4).map((entry) => {
                        const { icon, color, bgColor } = getHeritageData(entry.entryAndLocation?.heritageType?.value);
                        return (
                            <li key={entry.uuid} className="flex align-items-center py-2 border-bottom-1 surface-border">
                                <div
                                    className={`w-3rem h-3rem flex align-items-center justify-content-center ${bgColor} border-circle mr-3 flex-shrink-0`}
                                >
                                    {/* Ícono dinámico con color */}
                                    <i className={`${icon} text-xl ${color}`} />
                                </div>
                                <span className="text-900 line-height-3">
                    <span className="font-medium">{entry.culturalRecord?.objectTitle?.value || 'Objeto Museable'}</span>
                    <span className="text-700">
                        {' '}
                        ha sido ingresado como <span className={color}>{entry.entryAndLocation?.heritageType?.value || 'Patrimonio Cultural'}</span>
                    </span>
                </span>
                            </li>
                        );
                    })}

                </ul>
            ) : (
                <p className="text-center">No hay ingresos recientes</p>
            )}
        </>
    );
};

export default RecentActivityCard;
