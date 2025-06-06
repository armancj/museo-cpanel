'use client';
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';

const DirectorioPage = () => {
    const router = useRouter();

    const handleBackClick = () => {
        router.push('/landing');
    };

    // Estado para los filtros
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nombre: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        cargo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        departamento: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        extension: { value: null, matchMode: FilterMatchMode.EQUALS }
    });

    const [globalFilterValue, setGlobalFilterValue] = useState('');

    // Datos de ejemplo para el directorio
    const directorio = [
        {
            id: 1,
            nombre: 'Dr. Carlos Rodríguez Pérez',
            cargo: 'Director General',
            departamento: 'Dirección General',
            email: 'carlos.rodriguez@patrimoniocultural.cu',
            extension: '101',
            foto: '/demo/images/login/museo-left.jpg'
        },
        {
            id: 2,
            nombre: 'Dra. María González Valdés',
            cargo: 'Directora de Conservación',
            departamento: 'Departamento de Conservación',
            email: 'maria.gonzalez@patrimoniocultural.cu',
            extension: '201',
            foto: '/demo/images/login/museo-left.jpg'
        },
        {
            id: 3,
            nombre: 'Lic. Juan Martínez Soto',
            cargo: 'Jefe de Catalogación',
            departamento: 'Departamento de Catalogación',
            email: 'juan.martinez@patrimoniocultural.cu',
            extension: '301',
            foto: '/demo/images/login/museo-left.jpg'
        },
        {
            id: 4,
            nombre: 'Ing. Ana Fernández Díaz',
            cargo: 'Directora de Tecnología',
            departamento: 'Departamento de Tecnología',
            email: 'ana.fernandez@patrimoniocultural.cu',
            extension: '401',
            foto: '/demo/images/login/museo-left.jpg'
        },
        {
            id: 5,
            nombre: 'Dr. Roberto Sánchez Lima',
            cargo: 'Director de Investigación',
            departamento: 'Departamento de Investigación',
            email: 'roberto.sanchez@patrimoniocultural.cu',
            extension: '501',
            foto: '/demo/images/login/museo-left.jpg'
        },
        {
            id: 6,
            nombre: 'Lic. Laura Pérez Gómez',
            cargo: 'Jefa de Relaciones Institucionales',
            departamento: 'Relaciones Institucionales',
            email: 'laura.perez@patrimoniocultural.cu',
            extension: '601',
            foto: '/demo/images/login/museo-left.jpg'
        },
        {
            id: 7,
            nombre: 'Ing. Miguel Torres Vega',
            cargo: 'Jefe de Soporte Técnico',
            departamento: 'Departamento de Tecnología',
            email: 'miguel.torres@patrimoniocultural.cu',
            extension: '402',
            foto: '/demo/images/login/museo-left.jpg'
        },
        {
            id: 8,
            nombre: 'Dra. Carmen Ruiz Blanco',
            cargo: 'Especialista en Restauración',
            departamento: 'Departamento de Conservación',
            email: 'carmen.ruiz@patrimoniocultural.cu',
            extension: '202',
            foto: '/demo/images/login/museo-left.jpg'
        },
        {
            id: 9,
            nombre: 'Lic. Pedro Domínguez Ramos',
            cargo: 'Especialista en Documentación',
            departamento: 'Departamento de Catalogación',
            email: 'pedro.dominguez@patrimoniocultural.cu',
            extension: '302',
            foto: '/demo/images/login/museo-left.jpg'
        },
        {
            id: 10,
            nombre: 'Lic. Sofía Álvarez Moreno',
            cargo: 'Coordinadora de Eventos',
            departamento: 'Relaciones Institucionales',
            email: 'sofia.alvarez@patrimoniocultural.cu',
            extension: '602',
            foto: '/demo/images/login/museo-left.jpg'
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
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar" />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    const fotoBodyTemplate = (rowData) => {
        return (
            <img src={rowData.foto} alt={rowData.nombre} className="w-3rem h-3rem border-circle shadow-2" />
        );
    };

    const emailBodyTemplate = (rowData) => {
        return (
            <a href={`mailto:${rowData.email}`} className="text-primary" style={{ color: '#926941' }}>
                {rowData.email}
            </a>
        );
    };

    return (
        <div className="surface-0 flex justify-content-center">
            <div className="landing-wrapper overflow-hidden">
                <LogoLanding />

                <div className="py-4 px-4 lg:px-8 mt-5 mx-0 lg:mx-8">
                    <div className="grid justify-content-center">
                        <div className="col-12 text-center mt-8 mb-4">
                            <h2 className="text-900 font-normal mb-2" style={{ color: '#926941' }}>Directorio</h2>
                            <span className="text-600 text-2xl">Personal del Sistema de Gestión de Patrimonio Cultural</span>
                        </div>

                        <div className="col-12">
                            <div className="card">
                                <DataTable value={directorio} paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                                    filters={filters} filterDisplay="menu" globalFilterFields={['nombre', 'cargo', 'departamento', 'email', 'extension']}
                                    header={header} emptyMessage="No se encontraron resultados" className="p-datatable-lg">
                                    <Column field="foto" header="Foto" body={fotoBodyTemplate} style={{ width: '5%' }}></Column>
                                    <Column field="nombre" header="Nombre" sortable filter filterPlaceholder="Buscar por nombre" style={{ width: '25%' }}></Column>
                                    <Column field="cargo" header="Cargo" sortable filter filterPlaceholder="Buscar por cargo" style={{ width: '20%' }}></Column>
                                    <Column field="departamento" header="Departamento" sortable filter filterPlaceholder="Buscar por departamento" style={{ width: '20%' }}></Column>
                                    <Column field="email" header="Email" body={emailBodyTemplate} style={{ width: '20%' }}></Column>
                                    <Column field="extension" header="Ext." sortable filter filterPlaceholder="Ext." style={{ width: '10%' }}></Column>
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

export default DirectorioPage;
