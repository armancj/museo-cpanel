'use client';
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { TabView, TabPanel } from 'primereact/tabview';

const ForosPage = () => {
    const router = useRouter();

    const handleBackClick = () => {
        router.push('/landing');
    };

    // Estado para los filtros
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        titulo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        categoria: { value: null, matchMode: FilterMatchMode.EQUALS }
    });

    const [globalFilterValue, setGlobalFilterValue] = useState('');

    // Temas de foro de ejemplo
    const temas = [
        {
            id: 1,
            titulo: 'Mejores prácticas para la catalogación de objetos arqueológicos',
            autor: 'Carlos Rodríguez',
            avatar: '/demo/images/login/museo-left.jpg',
            categoria: 'Catalogación',
            respuestas: 24,
            vistas: 342,
            ultimaActividad: '2 horas atrás',
            estado: 'Activo'
        },
        {
            id: 2,
            titulo: 'Dudas sobre el módulo de importación de imágenes',
            autor: 'María González',
            avatar: '/demo/images/login/museo-left.jpg',
            categoria: 'Soporte Técnico',
            respuestas: 8,
            vistas: 156,
            ultimaActividad: '5 horas atrás',
            estado: 'Activo'
        },
        {
            id: 3,
            titulo: 'Protocolo para la conservación de textiles históricos',
            autor: 'Roberto Sánchez',
            avatar: '/demo/images/login/museo-left.jpg',
            categoria: 'Conservación',
            respuestas: 15,
            vistas: 230,
            ultimaActividad: '1 día atrás',
            estado: 'Activo'
        },
        {
            id: 4,
            titulo: 'Sugerencias para mejorar el sistema de búsqueda avanzada',
            autor: 'Ana Fernández',
            avatar: '/demo/images/login/museo-left.jpg',
            categoria: 'Sugerencias',
            respuestas: 12,
            vistas: 189,
            ultimaActividad: '2 días atrás',
            estado: 'Activo'
        },
        {
            id: 5,
            titulo: 'Compartiendo experiencias sobre la digitalización de documentos históricos',
            autor: 'Pedro Domínguez',
            avatar: '/demo/images/login/museo-left.jpg',
            categoria: 'Digitalización',
            respuestas: 19,
            vistas: 275,
            ultimaActividad: '3 días atrás',
            estado: 'Activo'
        },
        {
            id: 6,
            titulo: 'Problema con la generación de reportes PDF',
            autor: 'Laura Pérez',
            avatar: '/demo/images/login/museo-left.jpg',
            categoria: 'Soporte Técnico',
            respuestas: 7,
            vistas: 120,
            ultimaActividad: '4 días atrás',
            estado: 'Resuelto'
        },
        {
            id: 7,
            titulo: 'Debate: ¿Cómo mejorar la accesibilidad de las colecciones digitales?',
            autor: 'Miguel Torres',
            avatar: '/demo/images/login/museo-left.jpg',
            categoria: 'Debate',
            respuestas: 32,
            vistas: 410,
            ultimaActividad: '5 días atrás',
            estado: 'Activo'
        },
        {
            id: 8,
            titulo: 'Recursos para la identificación de cerámicas coloniales',
            autor: 'Carmen Ruiz',
            avatar: '/demo/images/login/museo-left.jpg',
            categoria: 'Recursos',
            respuestas: 14,
            vistas: 198,
            ultimaActividad: '1 semana atrás',
            estado: 'Activo'
        }
    ];

    // Categorías populares
    const categorias = [
        { nombre: 'Catalogación', temas: 45, mensajes: 342 },
        { nombre: 'Conservación', temas: 38, mensajes: 287 },
        { nombre: 'Soporte Técnico', temas: 32, mensajes: 256 },
        { nombre: 'Digitalización', temas: 28, mensajes: 215 },
        { nombre: 'Debate', temas: 25, mensajes: 310 },
        { nombre: 'Recursos', temas: 22, mensajes: 178 },
        { nombre: 'Sugerencias', temas: 18, mensajes: 145 }
    ];

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <Button label="Nuevo Tema" icon="pi pi-plus" className="p-button-rounded" style={{ backgroundColor: '#926941', border: 'none' }} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar tema" />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    const autorBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <Avatar image={rowData.avatar} shape="circle" size="small" />
                <span>{rowData.autor}</span>
            </div>
        );
    };

    const estadoBodyTemplate = (rowData) => {
        return (
            <Badge value={rowData.estado} severity={rowData.estado === 'Activo' ? 'success' : 'info'} />
        );
    };

    const accionesBodyTemplate = () => {
        return (
            <Button icon="pi pi-arrow-right" className="p-button-rounded p-button-outlined" style={{ color: '#926941', borderColor: '#926941' }} />
        );
    };

    return (
        <div className="surface-0 flex justify-content-center">
            <div className="landing-wrapper overflow-hidden">
                <LogoLanding />

                <div className="py-4 px-4 lg:px-8 mt-5 mx-0 lg:mx-8">
                    <div className="grid justify-content-center">
                        <div className="col-12 text-center mt-8 mb-4">
                            <h2 className="text-900 font-normal mb-2" style={{ color: '#926941' }}>Foros de Discusión</h2>
                            <span className="text-600 text-2xl">Comparta conocimientos y experiencias con la comunidad</span>
                        </div>

                        <div className="col-12">
                            <TabView>
                                <TabPanel header="Temas Recientes">
                                    <DataTable value={temas} paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                                        filters={filters} filterDisplay="menu" globalFilterFields={['titulo', 'autor', 'categoria']}
                                        header={header} emptyMessage="No se encontraron temas" className="p-datatable-lg">
                                        <Column field="titulo" header="Tema" sortable filter filterPlaceholder="Buscar por título" style={{ width: '40%' }}></Column>
                                        <Column field="autor" header="Autor" body={autorBodyTemplate} sortable style={{ width: '15%' }}></Column>
                                        <Column field="categoria" header="Categoría" sortable filter filterPlaceholder="Buscar por categoría" style={{ width: '15%' }}></Column>
                                        <Column field="respuestas" header="Respuestas" sortable style={{ width: '10%' }}></Column>
                                        <Column field="vistas" header="Vistas" sortable style={{ width: '10%' }}></Column>
                                        <Column field="estado" header="Estado" body={estadoBodyTemplate} sortable style={{ width: '10%' }}></Column>
                                        <Column field="acciones" header="Ver" body={accionesBodyTemplate} style={{ width: '10%' }}></Column>
                                    </DataTable>
                                </TabPanel>
                                <TabPanel header="Temas Populares">
                                    <DataTable value={temas.sort((a, b) => b.vistas - a.vistas)} paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                                        filters={filters} filterDisplay="menu" globalFilterFields={['titulo', 'autor', 'categoria']}
                                        header={header} emptyMessage="No se encontraron temas" className="p-datatable-lg">
                                        <Column field="titulo" header="Tema" sortable filter filterPlaceholder="Buscar por título" style={{ width: '40%' }}></Column>
                                        <Column field="autor" header="Autor" body={autorBodyTemplate} sortable style={{ width: '15%' }}></Column>
                                        <Column field="categoria" header="Categoría" sortable filter filterPlaceholder="Buscar por categoría" style={{ width: '15%' }}></Column>
                                        <Column field="respuestas" header="Respuestas" sortable style={{ width: '10%' }}></Column>
                                        <Column field="vistas" header="Vistas" sortable style={{ width: '10%' }}></Column>
                                        <Column field="estado" header="Estado" body={estadoBodyTemplate} sortable style={{ width: '10%' }}></Column>
                                        <Column field="acciones" header="Ver" body={accionesBodyTemplate} style={{ width: '10%' }}></Column>
                                    </DataTable>
                                </TabPanel>
                                <TabPanel header="Mis Temas">
                                    <div className="flex flex-column align-items-center justify-content-center py-5">
                                        <i className="pi pi-user-edit text-5xl mb-3" style={{ color: '#926941' }}></i>
                                        <h3 className="text-900 font-medium mb-3">Inicie sesión para ver sus temas</h3>
                                        <p className="text-700 text-center mb-4">Debe iniciar sesión para acceder a sus temas y participar en los foros de discusión.</p>
                                        <Button label="Iniciar Sesión" icon="pi pi-sign-in" className="p-button-rounded" style={{ backgroundColor: '#926941', border: 'none' }} onClick={() => router.push('/auth/login')} />
                                    </div>
                                </TabPanel>
                            </TabView>
                        </div>

                        <div className="col-12 mt-6">
                            <Divider />
                            <h3 className="text-center font-normal mb-4" style={{ color: '#926941' }}>Categorías Populares</h3>
                            <div className="grid">
                                {categorias.map((categoria, index) => (
                                    <div key={index} className="col-12 md:col-6 lg:col-3 p-3">
                                        <div className="p-3 border-1 surface-border surface-card border-round h-full">
                                            <div className="flex flex-column align-items-center text-center">
                                                <h4 className="text-900 mb-2">{categoria.nombre}</h4>
                                                <div className="flex gap-3 text-700">
                                                    <span><i className="pi pi-comments mr-1"></i>{categoria.temas} temas</span>
                                                    <span><i className="pi pi-comment mr-1"></i>{categoria.mensajes} mensajes</span>
                                                </div>
                                                <Button label="Ver Temas" className="p-button-text mt-3" style={{ color: '#926941' }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="col-12 mt-4 mb-8 flex justify-content-center">
                            <Button label="Volver a Inicio" icon="pi pi-arrow-left" className="p-button-rounded" style={{ backgroundColor: '#926941', border: 'none' }} onClick={handleBackClick} />
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default ForosPage;
