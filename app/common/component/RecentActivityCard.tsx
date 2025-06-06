'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { DashboardService } from '@/app/service/DashboardService';
import { CulturalPropertyModel } from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';

// Función para exportar datos en formato CSV
const exportToCSV = (data: CulturalPropertyModel[], fileName: string) => {
    if (data.length === 0) {
        alert('No hay actividades recientes para exportar.');
        return;
    }

    // Generar contenido CSV
    const csvRows = [
        ['UUID', 'Nombre del Objeto', 'Tipo de Patrimonio', 'Fecha de Creación'], // Encabezado
        ...data.map((entry) => [
            entry.uuid,
            entry.culturalRecord?.objectTitle?.value || 'N/A',
            entry.entryAndLocation?.heritageType?.value || 'N/A',
            new Date(entry.createdAt).toLocaleDateString('es-ES') // Formatear fecha
        ])
    ];

    const csvContent = csvRows.map((row) => row.join(',')).join('\n');

    // Crear un enlace para la descarga
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                                command: () => exportToCSV(latestEntries, 'actividades_recientes.csv') // Exportar
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
                    {latestEntries.slice(0, 2).map((entry) => (
                        <li key={entry.uuid} className="flex align-items-center py-2 border-bottom-1 surface-border">
                            <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                                <i className="pi pi-box text-xl text-blue-500" />
                            </div>
                            <span className="text-900 line-height-3">
                                <span className="font-medium">{entry.culturalRecord?.objectTitle?.value || 'Objeto Museable'}</span>
                                <span className="text-700">
                                    {' '}
                                    ha sido ingresado como <span className="text-blue-500">{entry.entryAndLocation?.heritageType?.value || 'Patrimonio Cultural'}</span>
                                </span>
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center">No hay ingresos recientes</p>
            )}
        </>
    );
};

export default RecentActivityCard;
