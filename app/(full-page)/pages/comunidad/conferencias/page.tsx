'use client';
import React from 'react';
import { Button } from 'primereact/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import { Timeline } from 'primereact/timeline';
import { LogoLanding } from '@/app/common/component/LogoLanding';

const ConferenciasPage = () => {
    const router = useRouter();

    const handleBackClick = () => {
        router.push('/landing#about');
    };

    // Conferencias de ejemplo
    const conferencias = [
        {
            id: 1,
            titulo: 'Digitalización del Patrimonio Cultural: Desafíos y Oportunidades',
            fecha: '15 de julio, 2025',
            hora: '10:00 - 12:00',
            lugar: 'Salón de Conferencias, Museo Nacional de Bellas Artes, La Habana',
            modalidad: 'Presencial',
            ponente: 'Dr. Carlos Rodríguez Pérez',
            cargo: 'Director General, Sistema de Gestión de Patrimonio Cultural',
            descripcion: 'Conferencia sobre los retos y oportunidades en la digitalización del patrimonio cultural cubano. Se abordarán temas como la preservación digital, accesibilidad y difusión de colecciones patrimoniales.',
            imagen: '/demo/images/login/museo-left.jpg',
            estado: 'Próxima'
        },
        {
            id: 2,
            titulo: 'Webinar: Nuevas Funcionalidades del Sistema de Gestión Patrimonial',
            fecha: '28 de julio, 2025',
            hora: '15:00 - 16:30',
            lugar: 'Plataforma Zoom',
            modalidad: 'Virtual',
            ponente: 'Ing. Ana Fernández Díaz',
            cargo: 'Directora de Tecnología',
            descripcion: 'Presentación de las nuevas funcionalidades implementadas en la última actualización del Sistema de Gestión de Patrimonio Cultural. Incluye demostración en vivo y sesión de preguntas y respuestas.',
            imagen: '/demo/images/login/museo-left.jpg',
            estado: 'Próxima'
        },
        {
            id: 3,
            titulo: 'Taller: Catalogación de Objetos Arqueológicos',
            fecha: '10 de agosto, 2025',
            hora: '09:00 - 17:00',
            lugar: 'Centro Nacional de Conservación, Restauración y Museología, La Habana',
            modalidad: 'Presencial',
            ponente: 'Lic. Juan Martínez Soto',
            cargo: 'Jefe de Catalogación',
            descripcion: 'Taller práctico sobre metodologías y estándares para la catalogación de objetos arqueológicos. Los participantes aprenderán a utilizar el módulo de catalogación del sistema para registrar piezas arqueológicas con todos sus metadatos.',
            imagen: '/demo/images/login/museo-left.jpg',
            estado: 'Próxima'
        },
        {
            id: 4,
            titulo: 'Mesa Redonda: El Futuro de los Museos Digitales',
            fecha: '25 de agosto, 2025',
            hora: '18:00 - 20:00',
            lugar: 'Casa de las Américas, La Habana',
            modalidad: 'Híbrida',
            ponente: 'Varios especialistas',
            cargo: 'Expertos en museología y tecnología',
            descripcion: 'Debate sobre el futuro de los museos digitales y su papel en la preservación y difusión del patrimonio cultural. Participan especialistas nacionales e internacionales en museología, tecnología y gestión cultural.',
            imagen: '/demo/images/login/museo-left.jpg',
            estado: 'Próxima'
        },
        {
            id: 5,
            titulo: 'Conferencia Internacional de Patrimonio Digital',
            fecha: '15-17 de septiembre, 2025',
            hora: 'Todo el día',
            lugar: 'Centro de Convenciones, La Habana',
            modalidad: 'Presencial',
            ponente: 'Múltiples ponentes internacionales',
            cargo: 'Especialistas en patrimonio cultural',
            descripcion: 'Conferencia internacional de tres días sobre patrimonio digital, con ponencias, talleres y mesas redondas. Participan especialistas de América Latina, Europa y Norteamérica.',
            imagen: '/demo/images/login/museo-left.jpg',
            estado: 'Próxima'
        },
        {
            id: 6,
            titulo: 'Webinar: Conservación Preventiva de Documentos Históricos',
            fecha: '5 de mayo, 2025',
            hora: '14:00 - 15:30',
            lugar: 'Plataforma Zoom',
            modalidad: 'Virtual',
            ponente: 'Dra. María González Valdés',
            cargo: 'Directora de Conservación',
            descripcion: 'Webinar sobre técnicas de conservación preventiva para documentos históricos y su correcta digitalización. Incluye recomendaciones para la manipulación, almacenamiento y digitalización de documentos frágiles.',
            imagen: '/demo/images/login/museo-left.jpg',
            estado: 'Realizada',
            grabacion: 'https://ejemplo.com/grabacion1'
        }
    ];

    // Conferencias pasadas
    const conferenciasPasadas = [
        {
            fecha: 'Mayo 2025',
            eventos: [
                {
                    titulo: 'Webinar: Conservación Preventiva de Documentos Históricos',
                    fecha: '5 de mayo, 2025',
                    ponente: 'Dra. María González Valdés',
                    modalidad: 'Virtual',
                    grabacion: 'https://ejemplo.com/grabacion1'
                }
            ]
        },
        {
            fecha: 'Abril 2025',
            eventos: [
                {
                    titulo: 'Taller: Fotografía de Objetos Patrimoniales',
                    fecha: '20 de abril, 2025',
                    ponente: 'Pedro Domínguez Ramos',
                    modalidad: 'Presencial',
                    grabacion: null
                },
                {
                    titulo: 'Conferencia: Metadatos para Colecciones Digitales',
                    fecha: '12 de abril, 2025',
                    ponente: 'Lic. Sofía Álvarez Moreno',
                    modalidad: 'Híbrida',
                    grabacion: 'https://ejemplo.com/grabacion2'
                }
            ]
        },
        {
            fecha: 'Marzo 2025',
            eventos: [
                {
                    titulo: 'Webinar: Introducción al Sistema de Gestión Patrimonial',
                    fecha: '25 de marzo, 2025',
                    ponente: 'Ing. Miguel Torres Vega',
                    modalidad: 'Virtual',
                    grabacion: 'https://ejemplo.com/grabacion3'
                }
            ]
        }
    ];

    const getModalidadSeverity = (modalidad: any) => {
        switch (modalidad) {
            case 'Presencial':
                return 'success';
            case 'Virtual':
                return 'info';
            case 'Híbrida':
                return 'warning';
            default:
                return 'secondary';
        }
    };

    const getEstadoSeverity = (estado: string) => {
        return estado === 'Próxima' ? 'warning' : 'success';
    };

    const header = (
        conference:
            | { id: number; titulo: string; fecha: string; hora: string; lugar: string; modalidad: string; ponente: string; cargo: string; descripcion: string; imagen: string; estado: string; grabacion?: undefined }
            | { id: number; titulo: string; fecha: string; hora: string; lugar: string; modalidad: string; ponente: string; cargo: string; descripcion: string; imagen: string; estado: string; grabacion: string }
    ) => (
        <div className="relative">
            <img src={conference.imagen} alt={conference.titulo} className="w-full" style={{ height: '200px', objectFit: 'cover' }} />
            <div className="absolute flex gap-2" style={{ top: '10px', right: '10px' }}>
                <Tag value={conference.modalidad} severity={getModalidadSeverity(conference.modalidad)} />
                <Tag value={conference.estado} severity={getEstadoSeverity(conference.estado)} />
            </div>
        </div>
    );

    const footer = (
        conference:
            | { id: number; titulo: string; fecha: string; hora: string; lugar: string; modalidad: string; ponente: string; cargo: string; descripcion: string; imagen: string; estado: string; grabacion?: undefined }
            | { id: number; titulo: string; fecha: string; hora: string; lugar: string; modalidad: string; ponente: string; cargo: string; descripcion: string; imagen: string; estado: string; grabacion: string }
    ) => (
        <div className="flex justify-content-between align-items-center">
            <span className="text-sm text-500">
                {conference.fecha} | {conference.hora}
            </span>
            <Button
                label={conference.estado === 'Próxima' ? 'Inscribirse' : 'Ver Grabación'}
                icon={conference.estado === 'Próxima' ? 'pi pi-calendar-plus' : 'pi pi-video'}
                className="p-button-rounded"
                style={{ backgroundColor: '#926941', border: 'none' }}
            />
        </div>
    );

    const customizedMarker = (item) => {
        return (
            <span className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1" style={{ backgroundColor: '#926941' }}>
                <i className="pi pi-calendar text-xl"></i>
            </span>
        );
    };

    const customizedContent = (item: {
        fecha: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined;
        eventos: any[];
    }) => {
        return (
            <div className="mb-5">
                <h5 className="m-0 font-bold">{item.fecha}</h5>
                <div className="mt-3">
                    {item.eventos.map((evento, index) => (
                        <div key={index} className="p-3 border-1 surface-border surface-card border-round mb-3">
                            <div className="flex justify-content-between align-items-center mb-2">
                                <h6 className="m-0">{evento.titulo}</h6>
                                <Tag value={evento.modalidad} severity={getModalidadSeverity(evento.modalidad)} />
                            </div>
                            <p className="text-700 m-0 mb-2">Ponente: {evento.ponente}</p>
                            <div className="flex justify-content-between align-items-center">
                                <span className="text-sm text-500">{evento.fecha}</span>
                                {evento.grabacion && <Button label="Ver Grabación" icon="pi pi-video" className="p-button-text p-button-sm" style={{ color: '#926941' }} />}
                            </div>
                        </div>
                    ))}
                </div>
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
                            <h2 className="text-900 font-normal mb-2" style={{ color: '#926941' }}>Conferencias y Eventos</h2>
                            <span className="text-600 text-2xl">Participe en nuestras conferencias, talleres y webinars</span>
                        </div>

                        <div className="col-12">
                            <h3 className="text-900 font-normal mb-4" style={{ color: '#926941' }}>Próximos Eventos</h3>
                            <div className="grid">
                                {conferencias.filter(c => c.estado === 'Próxima').map((conferencia) => (
                                    <div key={conferencia.id} className="col-12 md:col-6 lg:col-4 p-3">
                                        <Card
                                            title={conferencia.titulo}
                                            subTitle={conferencia.ponente + ' | ' + conferencia.cargo}
                                            header={() => header(conferencia)}
                                            footer={() => footer(conferencia)}
                                            className="h-full"
                                        >
                                            <p className="line-height-3 text-700 mb-3">{conferencia.descripcion}</p>
                                            <p className="line-height-3 text-700 m-0"><i className="pi pi-map-marker mr-2"></i>{conferencia.lugar}</p>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="col-12 mt-6">
                            <Divider />
                            <h3 className="text-900 font-normal mb-4" style={{ color: '#926941' }}>Eventos Pasados</h3>
                            <div className="card">
                                <Timeline value={conferenciasPasadas} align="left" className="customized-timeline"
                                    marker={customizedMarker} content={customizedContent} />
                            </div>
                        </div>

                        <div className="col-12 mt-6">
                            <Divider />
                            <div className="flex flex-column md:flex-row align-items-center justify-content-center p-3 bg-primary" style={{ borderRadius: '10px', backgroundColor: '#f5e9d9 !important' }}>
                                <div className="flex flex-column align-items-center md:align-items-start md:mr-4 mb-3 md:mb-0">
                                    <h3 className="text-900 font-normal m-0" style={{ color: '#926941' }}>¿Desea proponer una conferencia?</h3>
                                    <span className="text-700 text-xl">Comparta sus conocimientos con la comunidad</span>
                                </div>
                                <Button label="Enviar Propuesta" icon="pi pi-send" className="p-button-rounded" style={{ backgroundColor: '#926941', border: 'none' }} />
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

export default ConferenciasPage;
