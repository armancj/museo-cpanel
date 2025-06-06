'use client';
import React from 'react';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';
import { LogoLanding } from '@/app/common/component/LogoLanding';

const PublicacionesPage = () => {
    const router = useRouter();

    const handleBackClick = () => {
        router.push('/landing#about');
    };

    // Publicaciones de ejemplo
    const publicaciones = [
        {
            id: 1,
            titulo: 'Revista Patrimonio Cultural Cubano - Volumen 15',
            descripcion: 'Edición dedicada a las nuevas tecnologías aplicadas a la conservación del patrimonio cultural.',
            imagen: '/demo/images/login/museo-left.jpg',
            fecha: 'Junio 2025',
            autor: 'Ministerio de Cultura de Cuba',
            tipo: 'Revista',
            tags: ['Conservación', 'Tecnología', 'Patrimonio']
        },
        {
            id: 2,
            titulo: 'Catálogo: Tesoros de la Colonia',
            descripcion: 'Catálogo de la exposición temporal de arte colonial cubano, con fotografías y descripciones detalladas de las piezas exhibidas.',
            imagen: '/demo/images/login/museo-left.jpg',
            fecha: 'Mayo 2025',
            autor: 'Museo Nacional de Bellas Artes',
            tipo: 'Catálogo',
            tags: ['Arte Colonial', 'Exposición', 'Museo']
        },
        {
            id: 3,
            titulo: 'Boletín Informativo - Primer Trimestre 2025',
            descripcion: 'Resumen de las actividades, adquisiciones y proyectos realizados durante el primer trimestre del año 2025.',
            imagen: '/demo/images/login/museo-left.jpg',
            fecha: 'Abril 2025',
            autor: 'Sistema de Gestión de Patrimonio Cultural',
            tipo: 'Boletín',
            tags: ['Informe', 'Actividades', 'Proyectos']
        },
        {
            id: 4,
            titulo: 'Libro: Gestión Digital del Patrimonio Cultural',
            descripcion: 'Obra que analiza las mejores prácticas en la digitalización y gestión de colecciones patrimoniales.',
            imagen: '/demo/images/login/museo-left.jpg',
            fecha: 'Marzo 2025',
            autor: 'Dr. Carlos Rodríguez Pérez',
            tipo: 'Libro',
            tags: ['Digitalización', 'Gestión', 'Investigación']
        },
        {
            id: 5,
            titulo: 'Informe Anual de Conservación - 2024',
            descripcion: 'Reporte detallado sobre el estado de conservación de las colecciones patrimoniales y las intervenciones realizadas durante el año 2024.',
            imagen: '/demo/images/login/museo-left.jpg',
            fecha: 'Febrero 2025',
            autor: 'Departamento de Conservación',
            tipo: 'Informe',
            tags: ['Conservación', 'Estadísticas', 'Restauración']
        },
        {
            id: 6,
            titulo: 'Artículo: La Cerámica Taína en Cuba',
            descripcion: 'Estudio sobre las colecciones de cerámica taína en los museos cubanos y su importancia para entender las culturas precolombinas.',
            imagen: '/demo/images/login/museo-left.jpg',
            fecha: 'Enero 2025',
            autor: 'Dra. María González Valdés',
            tipo: 'Artículo',
            tags: ['Arqueología', 'Cerámica', 'Culturas Precolombinas']
        }
    ];

    const getTagSeverity = (tag) => {
        switch (tag) {
            case 'Conservación':
            case 'Restauración':
                return 'success';
            case 'Tecnología':
            case 'Digitalización':
                return 'info';
            case 'Patrimonio':
            case 'Arte Colonial':
                return 'warning';
            case 'Investigación':
            case 'Arqueología':
                return 'danger';
            default:
                return 'secondary';
        }
    };

    const getTipoSeverity = (type: any) => {
        switch (type) {
            case 'Revista':
                return 'info';
            case 'Catálogo':
                return 'success';
            case 'Boletín':
                return 'warning';
            case 'Libro':
                return 'danger';
            case 'Informe':
                return 'primary';
            case 'Artículo':
                return 'secondary';
            default:
                return 'info';
        }
    };

    const header = (publication: { id?: number; titulo: any; descripcion?: string; imagen: any; fecha?: string; autor?: string; tipo: any; tags?: string[] }) => (
        <div className="relative">
            <img src={publication.imagen} alt={publication.titulo} className="w-full" style={{ height: '200px', objectFit: 'cover' }} />
            <Tag value={publication.tipo} severity={getTipoSeverity(publication.tipo)} className="absolute" style={{ top: '10px', right: '10px' }} />
        </div>
    );

    const footer = (publication: { id?: number; titulo?: string; descripcion?: string; imagen?: string; fecha: any; autor?: string; tipo?: string; tags: any }) => (
        <div>
            <div className="flex flex-wrap gap-2 mb-3">
                {publication.tags.map(
                    (
                        tag: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined,
                        index: React.Key | null | undefined
                    ) => (
                        <Tag key={index} value={tag} severity={getTagSeverity(tag)} />
                    )
                )}
            </div>
            <div className="flex justify-content-between align-items-center">
                <span className="text-sm text-500">{publication.fecha}</span>
                <Button label="Leer más" icon="pi pi-arrow-right" className="p-button-text" style={{ color: '#926941' }} />
            </div>
        </div>
    );

    return (
        <div className="surface-0 flex justify-content-center">
            <div className="landing-wrapper overflow-hidden">
                <LogoLanding />

                <div className="py-4 px-4 lg:px-8 mt-5 mx-0 lg:mx-8">
                    <div className="grid justify-content-center">
                        <div className="col-12 text-center mt-8 mb-4">
                            <h2 className="text-900 font-normal mb-2" style={{ color: '#926941' }}>Publicaciones</h2>
                            <span className="text-600 text-2xl">Publicaciones relacionadas con el patrimonio cultural cubano</span>
                        </div>

                        <div className="col-12">
                            <div className="grid">
                                {publicaciones.map((publicacion) => (
                                    <div key={publicacion.id} className="col-12 md:col-6 lg:col-4 p-3">
                                        <Card
                                            title={publicacion.titulo}
                                            subTitle={publicacion.autor}
                                            header={() => header(publicacion)}
                                            footer={() => footer(publicacion)}
                                            className="h-full"
                                        >
                                            <p className="line-height-3 text-700">{publicacion.descripcion}</p>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="col-12 mt-6">
                            <Divider />
                            <h3 className="text-center font-normal mb-4" style={{ color: '#926941' }}>Suscríbete a nuestras publicaciones</h3>
                            <div className="flex flex-column md:flex-row align-items-center justify-content-center gap-4">
                                <span className="text-700 text-xl">Recibe nuestras últimas publicaciones directamente en tu correo electrónico</span>
                                <Button label="Suscribirse" icon="pi pi-envelope" className="p-button-rounded" style={{ backgroundColor: '#926941', border: 'none' }} />
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

export default PublicacionesPage;
