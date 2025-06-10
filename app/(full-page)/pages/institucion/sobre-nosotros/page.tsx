'use client';
import React from 'react';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { LogoLanding } from '@/app/common/component/LogoLanding';
const SobreNosotrosPage = () => {
    const router = useRouter();

    const handleBackClick = () => {
        router.push('/landing#about');
    };

    return (
        <div className="surface-0 flex justify-content-center">
            <div className="landing-wrapper overflow-hidden">
                <LogoLanding />

                <div className=" px-4 lg:px-8 mt-0 mx-0 lg:mx-8">
                    <div className="grid justify-content-center">
                        <div className="col-12 text-center mt-8 mb-4">
                            <h2 className="text-900 font-normal mb-2" style={{ color: '#926941' }}>Sobre Nosotros</h2>
                            <span className="text-600 text-2xl">Conoce más sobre el Sistema de Gestión de Patrimonio Cultural</span>
                        </div>

                        <div className="col-12 mt-4">
                            <div className="p-4 border-1 surface-border surface-card border-round">
                                <div
                                    className="flex flex-column md:flex-row align-items-center justify-content-between mb-4">
                                    <div className="flex flex-column align-items-center md:align-items-start">
                                        <h3 className="text-2xl font-medium text-900 mb-2"
                                            style={{ color: '#926941' }}>Nuestra Historia</h3>
                                        <span
                                            className="text-600 text-xl">Preservando el patrimonio cultural de Cuba</span>
                                    </div>
                                </div>
                                <div className="flex flex-column md:flex-row">
                                    <div className="flex-1 md:pr-5">
                                        <p className="line-height-3 text-lg text-700 mb-4">
                                            El Sistema de Gestión de Patrimonio Cultural fue fundado en 2015 como una
                                            iniciativa del Ministerio de Cultura de Cuba, con el objetivo de preservar,
                                            catalogar y difundir el rico patrimonio histórico y cultural de la nación.
                                        </p>
                                        <p className="line-height-3 text-lg text-700 mb-4">
                                            Desde sus inicios, nuestro sistema ha evolucionado para convertirse en una
                                            herramienta integral que permite a museos, archivos, bibliotecas y sitios
                                            históricos de toda Cuba gestionar eficientemente sus colecciones y bienes
                                            patrimoniales.
                                        </p>
                                        <p className="line-height-3 text-lg text-700 mb-4">
                                            A lo largo de los años, hemos desarrollado funcionalidades específicas para
                                            atender las necesidades de los profesionales del patrimonio cultural,
                                            incluyendo catalogación digital, documentación visual, búsqueda avanzada,
                                            registro histórico, estadísticas, seguridad, gestión de exposiciones,
                                            geolocalización y control de acceso.
                                        </p>
                                    </div>
                                    <div className="flex-1 md:pl-5 mt-4 md:mt-0">
                                        <img src="/demo/images/login/museo-left.jpg" alt="Patrimonio Cultural"
                                             className="w-full border-round"
                                             style={{ maxHeight: '300px', objectFit: 'cover' }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 mt-4">
                            <div className="p-4 border-1 surface-border surface-card border-round">
                                <div className="flex flex-column align-items-start mb-4">
                                    <h3 className="text-2xl font-medium text-900 mb-2"
                                        style={{ color: '#926941' }}>Nuestra Misión</h3>
                                    <span className="text-600 text-xl">Salvaguardando nuestro legado cultural</span>
                                </div>
                                <p className="line-height-3 text-lg text-700 mb-4">
                                    Nuestra misión es salvaguardar los objetos museables y bienes patrimoniales de Cuba,
                                    facilitando su documentación, investigación y acceso para las generaciones actuales
                                    y futuras. Trabajamos para:
                                </p>
                                <ul className="list-none p-0 m-0">
                                    <li className="flex align-items-center mb-3">
                                        <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span className="text-lg text-700">Preservar la integridad y autenticidad del patrimonio cultural cubano</span>
                                    </li>
                                    <li className="flex align-items-center mb-3">
                                        <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span className="text-lg text-700">Facilitar la catalogación sistemática de bienes culturales</span>
                                    </li>
                                    <li className="flex align-items-center mb-3">
                                        <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span className="text-lg text-700">Promover la investigación y el estudio del patrimonio</span>
                                    </li>
                                    <li className="flex align-items-center mb-3">
                                        <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span className="text-lg text-700">Garantizar el acceso a la información patrimonial</span>
                                    </li>
                                    <li className="flex align-items-center">
                                        <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span className="text-lg text-700">Contribuir a la difusión y valoración de la cultura cubana</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-12 mt-4">
                            <div className="p-4 border-1 surface-border surface-card border-round">
                                <div className="flex flex-column align-items-start mb-4">
                                    <h3 className="text-2xl font-medium text-900 mb-2"
                                        style={{ color: '#926941' }}>Nuestro Equipo</h3>
                                    <span
                                        className="text-600 text-xl">Profesionales comprometidos con el patrimonio</span>
                                </div>
                                <p className="line-height-3 text-lg text-700 mb-4">
                                    El Sistema de Gestión de Patrimonio Cultural cuenta con un equipo multidisciplinario
                                    de profesionales especializados en museología, conservación, historia del arte,
                                    tecnología de la información y gestión cultural. Nuestro personal incluye:
                                </p>
                                <div className="grid">
                                    <div className="col-12 md:col-6 lg:col-4 mb-4">
                                        <div className="p-3 border-1 surface-border border-round">
                                            <h4 className="text-xl font-medium text-900 mb-2"
                                                style={{ color: '#926941' }}>Conservadores</h4>
                                            <p className="line-height-3 text-base text-700 m-0">
                                                Especialistas en la preservación y restauración de bienes culturales,
                                                encargados de garantizar la integridad física de los objetos
                                                patrimoniales.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-6 lg:col-4 mb-4">
                                        <div className="p-3 border-1 surface-border border-round">
                                            <h4 className="text-xl font-medium text-900 mb-2"
                                                style={{ color: '#926941' }}>Museólogos</h4>
                                            <p className="line-height-3 text-base text-700 m-0">
                                                Expertos en la gestión y organización de colecciones museísticas,
                                                responsables de la catalogación y documentación de los objetos.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-6 lg:col-4 mb-4">
                                        <div className="p-3 border-1 surface-border border-round">
                                            <h4 className="text-xl font-medium text-900 mb-2"
                                                style={{ color: '#926941' }}>Historiadores</h4>
                                            <p className="line-height-3 text-base text-700 m-0">
                                                Investigadores especializados en historia y arte cubano, que aportan el
                                                contexto histórico y cultural a los bienes patrimoniales.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-6 lg:col-4 mb-4 lg:mb-0">
                                        <div className="p-3 border-1 surface-border border-round">
                                            <h4 className="text-xl font-medium text-900 mb-2"
                                                style={{ color: '#926941' }}>Desarrolladores</h4>
                                            <p className="line-height-3 text-base text-700 m-0">
                                                Profesionales de la tecnología encargados de mantener y mejorar la
                                                plataforma digital del sistema de gestión.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-6 lg:col-4 mb-4 md:mb-0">
                                        <div className="p-3 border-1 surface-border border-round">
                                            <h4 className="text-xl font-medium text-900 mb-2"
                                                style={{ color: '#926941' }}>Gestores Culturales</h4>
                                            <p className="line-height-3 text-base text-700 m-0">
                                                Especialistas en la administración y promoción de proyectos culturales
                                                relacionados con el patrimonio.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-6 lg:col-4">
                                        <div className="p-3 border-1 surface-border border-round">
                                            <h4 className="text-xl font-medium text-900 mb-2"
                                                style={{ color: '#926941' }}>Educadores</h4>
                                            <p className="line-height-3 text-base text-700 m-0">
                                                Profesionales dedicados a la difusión y enseñanza del valor del
                                                patrimonio cultural cubano a diferentes públicos.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 mt-4 mb-8 flex justify-content-center">
                            <Button label="Volver a Inicio" icon="pi pi-arrow-left" className="p-button-rounded"
                                    style={{ backgroundColor: '#926941', border: 'none' }} onClick={handleBackClick} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SobreNosotrosPage;
