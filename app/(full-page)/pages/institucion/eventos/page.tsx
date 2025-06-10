'use client';
import React from 'react';
import { Button } from 'primereact/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Timeline } from 'primereact/timeline';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { LogoLanding } from '@/app/common/component/LogoLanding';

const EventosPage = () => {
    const router = useRouter();

    const handleBackClick = () => {
        router.push('/landing#about');
    };

    // Eventos de ejemplo
    const eventos = [
        {
            id: 1,
            titulo: 'Exposición: "Tesoros de la Colonia"',
            fecha: '20 de junio - 15 de agosto, 2025',
            lugar: 'Museo Nacional de Bellas Artes, La Habana',
            descripcion: 'Exposición temporal que muestra piezas de arte colonial cubano de los siglos XVII y XVIII, incluyendo pinturas, esculturas y objetos decorativos.',
            estado: 'Próximo',
            icono: 'pi pi-calendar-plus'
        },
        {
            id: 2,
            titulo: 'Conferencia Internacional de Patrimonio Digital',
            fecha: '10-12 de julio, 2025',
            lugar: 'Centro de Convenciones, La Habana',
            descripcion: 'Encuentro internacional de especialistas en digitalización y preservación del patrimonio cultural. Incluye talleres, conferencias y mesas redondas.',
            estado: 'Próximo',
            icono: 'pi pi-users'
        },
        {
            id: 3,
            titulo: 'Taller de Conservación Preventiva',
            fecha: '5-7 de junio, 2025',
            lugar: 'Centro Nacional de Conservación, Restauración y Museología',
            descripcion: 'Taller práctico dirigido a profesionales de museos y archivos sobre técnicas de conservación preventiva para bienes patrimoniales.',
            estado: 'Activo',
            icono: 'pi pi-briefcase'
        },
        {
            id: 4,
            titulo: 'Jornada de Puertas Abiertas: Sistema de Gestión Patrimonial',
            fecha: '15 de mayo, 2025',
            lugar: 'Ministerio de Cultura, La Habana',
            descripcion: 'Presentación pública de las nuevas funcionalidades del Sistema de Gestión de Patrimonio Cultural y demostración de su uso para instituciones culturales.',
            estado: 'Activo',
            icono: 'pi pi-desktop'
        },
        {
            id: 5,
            titulo: 'Seminario: "Patrimonio Cultural y Turismo Sostenible"',
            fecha: '25-26 de abril, 2025',
            lugar: 'Hotel Nacional, La Habana',
            descripcion: 'Seminario sobre la relación entre la preservación del patrimonio cultural y el desarrollo del turismo sostenible en Cuba.',
            estado: 'Finalizado',
            icono: 'pi pi-map-marker'
        },
        {
            id: 6,
            titulo: 'Exposición Fotográfica: "Cuba en el Tiempo"',
            fecha: '10 de marzo - 10 de abril, 2025',
            lugar: 'Fototeca de Cuba, La Habana',
            descripcion: 'Muestra fotográfica que documenta la evolución del paisaje urbano y rural de Cuba a lo largo del siglo XX, con imágenes del archivo patrimonial.',
            estado: 'Finalizado',
            icono: 'pi pi-camera'
        }
    ];

    const getStatusColor = (status: any) => {
        switch(status) {
            case 'Próximo':
                return 'info';
            case 'Activo':
                return 'success';
            case 'Finalizado':
                return 'secondary';
            default:
                return 'primary';
        }
    };

    const customizedMarker = (item: { icono: string | undefined }) => {
        return (
            <span className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1" style={{ backgroundColor: '#926941' }}>
                <i className={item.icono}></i>
            </span>
        );
    };

    const customizedContent = (item: {
        estado: string;
        titulo: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined;
        fecha: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined;
        lugar: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined;
        descripcion: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined;
    }) => {
        return (
            <Card className="mb-3" style={{ borderLeft: `4px solid ${item.estado === 'Próximo' ? '#2196F3' : item.estado === 'Activo' ? '#4CAF50' : '#9E9E9E'}` }}>
                <div className="flex justify-content-between align-items-center mb-2">
                    <h3 className="m-0" style={{ color: '#926941' }}>
                        {item.titulo}
                    </h3>
                    <Badge value={item.estado} severity={getStatusColor(item.estado)}></Badge>
                </div>
                <p className="text-700 text-sm m-0 mb-2">
                    {item.fecha} | {item.lugar}
                </p>
                <p className="line-height-3 text-700 mb-3">{item.descripcion}</p>
                <Button label="Ver detalles" className="p-button-outlined" style={{ color: '#926941', borderColor: '#926941' }} />
            </Card>
        );
    };

    return (
        <div className="surface-0 flex justify-content-center">
            <div className="landing-wrapper overflow-hidden">
                <LogoLanding />

                <div className="py-4 px-4 lg:px-8 mt-5 mx-0 lg:mx-8">
                    <div className="grid justify-content-center">
                        <div className="col-12 text-center mt-8 mb-4">
                            <h2 className="text-900 font-normal mb-2" style={{ color: '#926941' }}>Eventos</h2>
                            <span className="text-600 text-2xl">Calendario de actividades relacionadas con el patrimonio cultural</span>
                        </div>

                        <div className="col-12 md:col-10 lg:col-8">
                            <Timeline value={eventos} align="alternate" className="customized-timeline"
                                marker={customizedMarker} content={customizedContent} />
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

export default EventosPage;
