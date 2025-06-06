'use client';
import React from 'react';
import { Button } from 'primereact/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { useState } from 'react';

const DocumentacionPage = () => {
    const router = useRouter();

    const handleBackClick = () => {
        router.push('/landing');
    };

    // Estado para los filtros
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        titulo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        categoria: { value: null, matchMode: FilterMatchMode.EQUALS },
        formato: { value: null, matchMode: FilterMatchMode.EQUALS }
    });

    const [globalFilterValue, setGlobalFilterValue] = useState('');

    // Documentos de ejemplo
    const documentos = [
        {
            id: 1,
            titulo: 'Manual de Usuario - Sistema de Gestión de Patrimonio Cultural',
            descripcion: 'Guía completa para usuarios del sistema con todas las funcionalidades explicadas paso a paso.',
            categoria: 'Manual',
            formato: 'PDF',
            tamaño: '8.5 MB',
            fecha: '15/05/2025',
            icono: 'pi pi-file-pdf'
        },
        {
            id: 2,
            titulo: 'Guía de Catalogación de Objetos Patrimoniales',
            descripcion: 'Estándares y mejores prácticas para la catalogación de objetos museables y bienes patrimoniales.',
            categoria: 'Guía',
            formato: 'PDF',
            tamaño: '5.2 MB',
            fecha: '10/04/2025',
            icono: 'pi pi-file-pdf'
        },
        {
            id: 3,
            titulo: 'Especificaciones Técnicas del Sistema',
            descripcion: 'Documento técnico con las especificaciones del sistema, arquitectura y requisitos.',
            categoria: 'Técnico',
            formato: 'PDF',
            tamaño: '3.7 MB',
            fecha: '28/03/2025',
            icono: 'pi pi-file-pdf'
        },
        {
            id: 4,
            titulo: 'Plantilla de Inventario',
            descripcion: 'Plantilla para realizar inventarios de colecciones patrimoniales.',
            categoria: 'Plantilla',
            formato: 'XLSX',
            tamaño: '1.2 MB',
            fecha: '15/03/2025',
            icono: 'pi pi-file-excel'
        },
        {
            id: 5,
            titulo: 'Glosario de Términos Museológicos',
            descripcion: 'Diccionario de términos utilizados en museología y gestión patrimonial.',
            categoria: 'Referencia',
            formato: 'PDF',
            tamaño: '2.8 MB',
            fecha: '05/03/2025',
            icono: 'pi pi-file-pdf'
        },
        {
            id: 6,
            titulo: 'Protocolo de Conservación Preventiva',
            descripcion: 'Lineamientos para la conservación preventiva de bienes patrimoniales.',
            categoria: 'Protocolo',
            formato: 'PDF',
            tamaño: '4.1 MB',
            fecha: '20/02/2025',
            icono: 'pi pi-file-pdf'
        },
        {
            id: 7,
            titulo: 'Presentación del Sistema - Capacitación',
            descripcion: 'Presentación utilizada en las sesiones de capacitación para nuevos usuarios.',
            categoria: 'Capacitación',
            formato: 'PPTX',
            tamaño: '6.3 MB',
            fecha: '10/02/2025',
            icono: 'pi pi-file-powerpoint'
        },
        {
            id: 8,
            titulo: 'Formulario de Registro de Objetos',
            descripcion: 'Formulario para el registro manual de objetos patrimoniales.',
            categoria: 'Formulario',
            formato: 'DOCX',
            tamaño: '0.9 MB',
            fecha: '01/02/2025',
            icono: 'pi pi-file-word'
        },
        {
            id: 9,
            titulo: 'Guía de Importación y Exportación de Datos',
            descripcion: 'Instrucciones para importar y exportar datos en diferentes formatos.',
            categoria: 'Guía',
            formato: 'PDF',
            tamaño: '3.2 MB',
            fecha: '15/01/2025',
            icono: 'pi pi-file-pdf'
        },
        {
            id: 10,
            titulo: 'Estándares de Fotografía para Objetos Patrimoniales',
            descripcion: 'Guía para la documentación fotográfica de objetos museables.',
            categoria: 'Estándar',
            formato: 'PDF',
            tamaño: '7.5 MB',
            fecha: '05/01/2025',
            icono: 'pi pi-file-pdf'
        }
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
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar documento" />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    const formatoBodyTemplate = (rowData) => {
        return (
            <Tag
                value={rowData.formato}
                severity={
                    rowData.formato === 'PDF' ? 'danger' :
                    rowData.formato === 'DOCX' ? 'info' :
                    rowData.formato === 'XLSX' ? 'success' :
                    rowData.formato === 'PPTX' ? 'warning' : 'primary'
                }
            />
        );
    };

    const iconoBodyTemplate = (rowData) => {
        return <i className={rowData.icono} style={{ fontSize: '1.5rem', color: '#926941' }}></i>;
    };

    const accionesBodyTemplate = () => {
        return (
            <div className="flex gap-2">
                <Button icon="pi pi-download" className="p-button-rounded p-button-outlined" style={{ color: '#926941', borderColor: '#926941' }} />
                <Button icon="pi pi-eye" className="p-button-rounded p-button-outlined" style={{ color: '#926941', borderColor: '#926941' }} />
            </div>
        );
    };

    return (
        <div className="surface-0 flex justify-content-center">
            <div className="landing-wrapper overflow-hidden">
                <LogoLanding />

                <div className="py-4 px-4 lg:px-8 mt-5 mx-0 lg:mx-8">
                    <div className="grid justify-content-center">
                        <div className="col-12 text-center mt-8 mb-4">
                            <h2 className="text-900 font-normal mb-2" style={{ color: '#926941' }}>Documentación</h2>
                            <span className="text-600 text-2xl">Documentos técnicos y recursos para el Sistema de Gestión de Patrimonio Cultural</span>
                        </div>

                        <div className="col-12">
                            <div className="card">
                                <DataTable value={documentos} paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                                    filters={filters} filterDisplay="menu" globalFilterFields={['titulo', 'descripcion', 'categoria', 'formato']}
                                    header={header} emptyMessage="No se encontraron documentos" className="p-datatable-lg">
                                    <Column field="icono" header="" body={iconoBodyTemplate} style={{ width: '5%' }}></Column>
                                    <Column field="titulo" header="Título" sortable filter filterPlaceholder="Buscar por título" style={{ width: '25%' }}></Column>
                                    <Column field="descripcion" header="Descripción" style={{ width: '30%' }}></Column>
                                    <Column field="categoria" header="Categoría" sortable filter filterPlaceholder="Buscar por categoría" style={{ width: '15%' }}></Column>
                                    <Column field="formato" header="Formato" body={formatoBodyTemplate} sortable filter filterPlaceholder="Buscar por formato" style={{ width: '10%' }}></Column>
                                    <Column field="tamaño" header="Tamaño" sortable style={{ width: '10%' }}></Column>
                                    <Column field="acciones" header="Acciones" body={accionesBodyTemplate} style={{ width: '15%' }}></Column>
                                </DataTable>
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

export default DocumentacionPage;
