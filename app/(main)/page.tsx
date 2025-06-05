/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { LayoutContext } from '@/layout/context/layoutcontext';
import Link from 'next/link';
import { ChartData, ChartOptions } from 'chart.js';
import { ChartDataset } from 'chart.js/dist/types';
import withAuth from '@/lib/withAuth';
import { DashboardService, HeritageTypeCount, MonthlyEntryData } from '@/app/service/DashboardService';
import { CulturalPropertyModel } from '@/app/(main)/pages/cultural-property-heritage/culturalProperty.model';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';

// Datos iniciales para los gráficos (se actualizarán con datos reales)
const initialLineData: ChartData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
    datasets: [
        {
            label: 'Ingresos de Objetos',
            data: [0, 0, 0, 0, 0, 0, 0],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: 0.4
        }
    ] as ChartDataset<any, any>[]
};

const Dashboard = () => {
    // Estados para los datos del dashboard
    const [totalObjects, setTotalObjects] = useState<number>(0);
    const [recentEntries, setRecentEntries] = useState<number>(0);
    const [latestEntries, setLatestEntries] = useState<CulturalPropertyModel[]>([]);
    const [heritageTypeData, setHeritageTypeData] = useState<HeritageTypeCount[]>([]);
    const [monthlyEntryData, setMonthlyEntryData] = useState<MonthlyEntryData[]>([]);
    const [lineData, setLineData] = useState<ChartData>(initialLineData);
    const [pieData, setPieData] = useState<ChartData>({ labels: [], datasets: [] });
    const [loading, setLoading] = useState<boolean>(true);

    // Referencias para los menús
    const menu1 = useRef<Menu | null>(null);
    const menu2 = useRef<Menu | null>(null);

    // Opciones para los gráficos
    const [lineOptions, setLineOptions] = useState<ChartOptions>({});
    const [pieOptions, setPieOptions] = useState<ChartOptions>({});
    const { layoutConfig } = useContext(LayoutContext);

    // Aplicar tema claro a los gráficos
    const applyLightTheme = () => {
        const lineOptions: ChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

        const pieOptions: ChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
        setPieOptions(pieOptions);
    };

    // Aplicar tema oscuro a los gráficos
    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        };

        const pieOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
        setPieOptions(pieOptions);
    };

    // Cargar datos del dashboard
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // Obtener estadísticas generales
                const stats = await DashboardService.getDashboardStats();
                setTotalObjects(stats.totalObjects);
                setRecentEntries(stats.recentEntries);
                setLatestEntries(stats.latestEntries);

                // Obtener distribución por tipo de patrimonio
                const heritageTypes = await DashboardService.getHeritageTypeDistribution();
                console.log('heritage', heritageTypes);
                setHeritageTypeData(heritageTypes);

                const labels = stats.objectsByConservationStatusWithColors.map(item => item.state);
                const data = stats.objectsByConservationStatusWithColors.map(item => item.count);
                const backgroundColors = stats.objectsByConservationStatusWithColors.map(item => item.color);

                // Configurar datos para el gráfico de pie
                const pieData: ChartData = {
                    labels,
                    datasets: [
                        {
                            data,
                            backgroundColor: backgroundColors
                        }
                    ]
                };
                setPieData(pieData);

                // Obtener datos de ingresos mensuales
                const monthlyData = await DashboardService.getMonthlyEntryData();
                setMonthlyEntryData(monthlyData);

                // Configurar datos para el gráfico de línea
                const lineData: ChartData = {
                    labels: monthlyData.map(item => item.month),
                    datasets: [
                        {
                            label: 'Ingresos de Objetos',
                            data: monthlyData.map(item => item.count),
                            fill: false,
                            backgroundColor: '#2f4860',
                            borderColor: '#2f4860',
                            tension: 0.4
                        }
                    ]
                };
                setLineData(lineData);

                setLoading(false);
            } catch (error) {
                console.error('Error al cargar datos del dashboard:', error);
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Aplicar tema según configuración
    useEffect(() => {
        if (layoutConfig.colorScheme === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [layoutConfig.colorScheme]);

    // Formatear moneda
    const formatCurrency = (value: number) => {
        return value?.toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR'
        });
    };

    // Formatear fecha
    const formatDate = (date: any) => {
        if (!date) return '';
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString('es-ES');
    };
 console.log(latestEntries)
    return (
        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Total Objetos Museables</span>
                            <div className="text-900 font-medium text-xl">{totalObjects}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-box text-blue-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-blue-500 font-medium">Patrimonio Cultural </span>
                    <span className="text-500">catalogado en el sistema</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Ingresos Recientes</span>
                            <div className="text-900 font-medium text-xl">{recentEntries}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-calendar-plus text-orange-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-orange-500 font-medium">Nuevos objetos </span>
                    <span className="text-500">en los últimos 30 días</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Tipos de Patrimonio</span>
                            <div className="text-900 font-medium text-xl">{heritageTypeData.length}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-list text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-cyan-500 font-medium">Categorías </span>
                    <span className="text-500">de objetos museables</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Documentación</span>
                            <div className="text-900 font-medium text-xl">Completa</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-file text-purple-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-purple-500 font-medium">Archivos </span>
                    <span className="text-500">y documentos asociados</span>
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5 className="p-mb-3" style={{ display: 'flex', alignItems: 'center', color: '#495057' }}>
                        <i className="pi pi-clock p-mr-2" style={{ fontSize: '1.5rem', color: '#007ad9' }}></i>
                        Ingresos Recientes de Objetos Museables
                    </h5>

                    <DataTable
                        value={latestEntries}
                        rows={5}
                        paginator
                        scrollable
                        scrollHeight="400px"
                        loading={loading}
                        stripedRows
                        responsiveLayout="scroll"
                        emptyMessage="¡No hay objetos recientes por mostrar!"
                        className="p-datatable-striped"
                        style={{ fontSize: '0.95rem' }}
                    >
                        <Column
                            field="culturalRecord.objectTitle.value"
                            header="🥇 Nombre"
                            sortable
                            style={{ width: '35%', fontWeight: 'bold' }}
                            body={(data) => (
                                <span style={{ color: '#007ad9', fontWeight: '500' }}>{data?.culturalRecord?.objectTitle?.value}</span>
                            )}
                        />
                        <Column
                            field="culturalRecord.heritageType.value"
                            header="🎨 Tipo"
                            sortable
                            style={{ width: '25%', fontWeight: 'bold' }}
                            body={(data) => (
                                <Tag
                                    value={data?.culturalRecord?.heritageType?.value}
                                    severity="success"
                                    style={{ fontSize: '0.88rem' }}
                                />
                            )}
                        />
                        <Column
                            field="culturalRecord.entryDate.value"
                            header="📅 Fecha"
                            sortable
                            body={(data) => (
                                <Tag
                                    value={formatDate(data?.createdAt)}
                                    severity="info"

                                    style={{ fontSize: '0.88rem' }}
                                />
                            )}
                            style={{ width: '25%', fontWeight: 'bold' }}
                        />
                        <Column
                            header="🔍 Acción"
                            body={(data) => (
                                <Link href={`/cultural-property-heritage/${data.uuid}`}>
                                    <Button
                                        icon="pi pi-search"
                                        label="Ver"
                                        className="p-button-rounded p-button-text p-button-help"
                                        style={{ fontSize: '0.9rem' }}
                                    />
                                </Link>
                            )}
                            style={{ width: '15%', textAlign: 'center' }}
                        />
                    </DataTable>
                </div>

                <div className="card">
                    <div className="flex justify-content-between align-items-center mb-5">
                        <h5>Distribución por Tipo de Patrimonio</h5>
                        <div>
                            <Button type="button" icon="pi pi-ellipsis-v" rounded text className="p-button-plain" onClick={(event) => menu1.current?.toggle(event)} />
                            <Menu
                                ref={menu1}
                                popup
                                model={[
                                    { label: 'Exportar', icon: 'pi pi-fw pi-file-export' },
                                    { label: 'Actualizar', icon: 'pi pi-fw pi-refresh' }
                                ]}
                            />
                        </div>
                    </div>
                    {loading ? (
                        <div className="flex justify-content-center">
                            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
                        </div>
                    ) : heritageTypeData.length > 0 ? (
                        <ul className="list-none p-0 m-0">
                            {heritageTypeData.slice(0, 6).map((item, index) => {
                                const colors = ['orange', 'cyan', 'pink', 'green', 'purple', 'teal'];
                                const color = colors[index % colors.length];
                                const percentage = totalObjects > 0 ? Math.round((item.count / totalObjects) * 100) : 0;

                                return (
                                    <li key={item.name} className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                        <div>
                                            <span className="text-900 font-medium mr-2 mb-1 md:mb-0">{item.name}</span>
                                            <div className="mt-1 text-600">Tipo de Patrimonio</div>
                                        </div>
                                        <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                            <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                                <div className={`bg-${color}-500 h-full`} style={{ width: `${percentage}%` }} />
                                            </div>
                                            <span className={`text-${color}-500 ml-3 font-medium`}>{percentage}%</span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="text-center p-4">
                            <p>No hay datos disponibles</p>
                        </div>
                    )}
                </div>

                <div className="card">
                    <h5>Estado de Conservación</h5>
                    {loading ? (
                        <div className="flex justify-content-center">
                            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
                        </div>
                    ) : (
                        <Chart type="pie" data={pieData} options={pieOptions} />
                    )}
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Estadísticas de Ingresos Mensuales</h5>
                    {loading ? (
                        <div className="flex justify-content-center p-5">
                            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
                        </div>
                    ) : (
                        <Chart type="line" data={lineData} options={lineOptions} />
                    )}
                </div>

                <div className="card">
                    <div className="flex align-items-center justify-content-between mb-4">
                        <h5>Actividad Reciente</h5>
                        <div>
                            <Button type="button" icon="pi pi-ellipsis-v" rounded text className="p-button-plain" onClick={(event) => menu2.current?.toggle(event)} />
                            <Menu
                                ref={menu2}
                                popup
                                model={[
                                    { label: 'Exportar', icon: 'pi pi-fw pi-file-export' },
                                    { label: 'Actualizar', icon: 'pi pi-fw pi-refresh' }
                                ]}
                            />
                        </div>
                    </div>

                    <span className="block text-600 font-medium mb-3">ÚLTIMOS INGRESOS</span>
                    <ul className="p-0 mx-0 mt-0 mb-4 list-none">
                        {loading ? (
                            <div className="flex justify-content-center p-3">
                                <i className="pi pi-spin pi-spinner" style={{ fontSize: '1.5rem' }}></i>
                            </div>
                        ) : latestEntries.length > 0 ? (
                            latestEntries.slice(0, 2).map((entry) => (
                                <li key={entry.uuid} className="flex align-items-center py-2 border-bottom-1 surface-border">
                                    <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                                        <i className="pi pi-box text-xl text-blue-500" />
                                    </div>
                                    <span className="text-900 line-height-3">
                                        <span className="font-medium">{entry.entryAndLocation?.objectName?.value || 'Objeto Museable'}</span>
                                        <span className="text-700">
                                            {' '}
                                            ha sido ingresado como <span className="text-blue-500">{entry.entryAndLocation?.heritageType?.value || 'Patrimonio Cultural'}</span>
                                        </span>
                                    </span>
                                </li>
                            ))
                        ) : (
                            <li className="text-center p-3">No hay ingresos recientes</li>
                        )}
                    </ul>

                    <span className="block text-600 font-medium mb-3">ESTADÍSTICAS</span>
                    <ul className="p-0 m-0 list-none">
                        <li className="flex align-items-center py-2 border-bottom-1 surface-border">
                            <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-orange-100 border-circle mr-3 flex-shrink-0">
                                <i className="pi pi-chart-bar text-xl text-orange-500" />
                            </div>
                            <span className="text-900 line-height-3">
                                Tipos de Patrimonio
                                <span className="text-700">
                                    {' '}
                                    <span className="text-orange-500 font-medium">{heritageTypeData.length}</span> categorías diferentes registradas
                                </span>
                            </span>
                        </li>
                        <li className="flex align-items-center py-2 border-bottom-1 surface-border">
                            <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-cyan-100 border-circle mr-3 flex-shrink-0">
                                <i className="pi pi-calendar text-xl text-cyan-500" />
                            </div>
                            <span className="text-900 line-height-3">
                                Ingresos Mensuales
                                <span className="text-700"> promedio de <span className="text-cyan-500 font-medium">{monthlyEntryData.length > 0 ? Math.round(totalObjects / monthlyEntryData.length) : 0}</span> objetos por mes</span>
                            </span>
                        </li>
                    </ul>
                </div>

                <div className="card">
                    <h5>Clasificación por Método de Ingreso</h5>
                    {loading ? (
                        <div className="flex justify-content-center p-5">
                            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
                        </div>
                    ) : (
                        <div className="grid">
                            {latestEntries.slice(0, 3).map((entry, index) => (
                                <div key={entry.uuid} className="col-12 md:col-4">
                                    <div className="p-3 border-1 surface-border border-round">
                                        <div className="text-900 font-medium mb-2">{entry.entryAndLocation?.objectName?.value || 'Objeto Museable'}</div>
                                        <div className="text-600 mb-3">Método: {entry.entryAndLocation?.entryMethod?.value || 'No especificado'}</div>
                                        <Tag
                                            severity={index % 3 === 0 ? 'success' : index % 3 === 1 ? 'info' : 'warning'}
                                            value={entry.entryAndLocation?.heritageType?.value || 'Patrimonio Cultural'}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div
                    className="px-4 py-5 shadow-2 flex flex-column md:flex-row md:align-items-center justify-content-between mb-3"
                    style={{
                        borderRadius: '1rem',
                        background: 'linear-gradient(0deg, rgba(0, 123, 255, 0.5), rgba(0, 123, 255, 0.5)), linear-gradient(92.54deg, #1C80CF 47.88%, #FFFFFF 100.01%)'
                    }}
                >
                    <div>
                        <div className="text-blue-100 font-medium text-xl mt-2 mb-3">GESTIÓN DE PATRIMONIO</div>
                        <div className="text-white font-medium text-5xl">Museo Digital</div>
                    </div>
                    <div className="mt-4 mr-auto md:mt-0 md:mr-0">
                        <Link href="/pages/cultural-property-heritage" className="p-button font-bold px-5 py-3 p-button-warning p-button-rounded p-button-raised">
                            Explorar
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProtectedDashboard = withAuth(Dashboard);
export default ProtectedDashboard;
