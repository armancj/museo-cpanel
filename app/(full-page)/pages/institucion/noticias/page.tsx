'use client';
import React from 'react';
import { Button } from 'primereact/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { LogoLanding } from '@/app/common/component/LogoLanding';

const NoticiasPage = () => {
    const router = useRouter();

    const handleBackClick = () => {
        router.push('/landing');
    };

    // Noticias de ejemplo
    const noticias = [
        {
            id: 1,
            titulo: 'Nueva exposición de arte colonial cubano',
            fecha: '15 de junio, 2025',
            resumen: 'El Museo Nacional de Bellas Artes inaugura una exposición de arte colonial cubano con piezas catalogadas en nuestro sistema.',
            categoria: 'Exposición',
            imagen: '/demo/images/login/museo-left.jpg'
        },
        {
            id: 2,
            titulo: 'Actualización del sistema de catalogación',
            fecha: '3 de mayo, 2025',
            resumen: 'Se ha lanzado una actualización importante del Sistema de Gestión de Patrimonio Cultural con nuevas funcionalidades.',
            categoria: 'Tecnología',
            imagen: '/demo/images/login/museo-left.jpg'
        },
        {
            id: 3,
            titulo: 'Descubrimiento arqueológico en La Habana Vieja',
            fecha: '27 de abril, 2025',
            resumen: 'Arqueólogos han descubierto restos coloniales del siglo XVII durante trabajos de restauración en La Habana Vieja.',
            categoria: 'Arqueología',
            imagen: '/demo/images/login/museo-left.jpg'
        },
        {
            id: 4,
            titulo: 'Convenio con la UNESCO para preservación digital',
            fecha: '15 de abril, 2025',
            resumen: 'El Ministerio de Cultura de Cuba ha firmado un convenio con la UNESCO para la preservación digital del patrimonio cultural.',
            categoria: 'Cooperación',
            imagen: '/demo/images/login/museo-left.jpg'
        },
        {
            id: 5,
            titulo: 'Taller de conservación preventiva',
            fecha: '2 de abril, 2025',
            resumen: 'Se realizará un taller de conservación preventiva para profesionales de museos y archivos de toda Cuba.',
            categoria: 'Formación',
            imagen: '/demo/images/login/museo-left.jpg'
        }
    ];

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Exposición':
                return 'success';
            case 'Tecnología':
                return 'info';
            case 'Arqueología':
                return 'warning';
            case 'Cooperación':
                return 'primary';
            case 'Formación':
                return 'danger';
            default:
                return 'secondary';
        }
    };

    const header = (noticia: {
        id: number;
        titulo: string;
        fecha: string;
        resumen: string;
        categoria: string;
        imagen: string
    }) => (
        <img alt={noticia.titulo} src={noticia.imagen} style={{ height: '200px', objectFit: 'cover', width: '100%' }} />
    );

    const footer = (noticia: {
        id: number;
        titulo: string;
        fecha: string;
        resumen: string;
        categoria: string;
        imagen: string
    }) => (
        <div className="flex flex-wrap justify-content-between align-items-center mt-3">
            <Tag value={noticia.categoria} severity={getCategoryColor(noticia.categoria)}></Tag>
            <Button label="Leer más" icon="pi pi-arrow-right" className="p-button-text" style={{ color: '#926941' }} />
        </div>
    );

    return (
        <div className="surface-0 flex justify-content-center">
            <div className="landing-wrapper overflow-hidden">
                <LogoLanding />

                <div className="py-4 px-4 lg:px-8 mt-5 mx-0 lg:mx-8">
                    <div className="grid justify-content-center">
                        <div className="col-12 text-center mt-8 mb-4">
                            <h2 className="text-900 font-normal mb-2" style={{ color: '#926941' }}>Noticias</h2>
                            <span className="text-600 text-2xl">Últimas novedades sobre patrimonio cultural</span>
                        </div>

                        <div className="col-12">
                            <div className="grid">
                                {noticias.map((noticia) => (
                                    <div key={noticia.id} className="col-12 md:col-6 lg:col-4 p-3">
                                        <Card
                                            title={noticia.titulo}
                                            subTitle={noticia.fecha}
                                            header={() => header(noticia)}
                                            footer={() => footer(noticia)}
                                            className="h-full"
                                        >
                                            <p className="line-height-3 text-700">{noticia.resumen}</p>
                                        </Card>
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

export default NoticiasPage;
