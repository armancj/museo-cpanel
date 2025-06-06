'use client';
/* eslint-disable @next/next/no-img-element */
import React, { useContext, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { StyleClass } from 'primereact/styleclass';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import { Divider } from 'primereact/divider';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { NodeRef } from '@/types';
import { classNames } from 'primereact/utils';

const LandingPage = () => {
    const [isHidden, setIsHidden] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const menuRef = useRef<HTMLElement | null>(null);
    const router = useRouter();

    const toggleMenuItemClick = () => {
        setIsHidden((prevState) => !prevState);
    };

    const handleLoginClick = () => {
        router.push('/auth/login');
    };

    const handleCollectionClick = () => {
        router.push('/' );
    };

    return (
        <div className="surface-0 flex justify-content-center">
            <div id="home" className="landing-wrapper overflow-hidden">
                <div className="py-4 px-4 mx-0 md:mx-6 lg:mx-8 lg:px-8 flex align-items-center justify-content-between relative lg:static">
                    <Link href="/" className="flex align-items-center">
                        <img src="/demo/images/login/logoPatrimonio.jpg" alt="Logo Patrimonio" height="60" className="mr-0 lg:mr-2" />
                    </Link>
                    <StyleClass nodeRef={menuRef as NodeRef} selector="@next" enterClassName="hidden" leaveToClassName="hidden" hideOnOutsideClick>
                        <i ref={menuRef} className="pi pi-bars text-4xl cursor-pointer block lg:hidden text-700"></i>
                    </StyleClass>
                    <div className={classNames('align-items-center surface-0 flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full left-0 px-6 lg:px-0 z-2', { hidden: isHidden })} style={{ top: '100%' }}>
                        <ul className="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row cursor-pointer">
                            <li>
                                <a href="#home" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                                    <span>Inicio</span>
                                    <Ripple />
                                </a>
                            </li>
                            <li>
                                <a href="#features" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                                    <span>Características</span>
                                    <Ripple />
                                </a>
                            </li>
                            <li>
                                <a href="#highlights" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                                    <span>Destacados</span>
                                    <Ripple />
                                </a>
                            </li>
                            <li>
                                <a href="#about" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                                    <span>Nosotros</span>
                                    <Ripple />
                                </a>
                            </li>
                        </ul>
                        <div className="flex justify-content-between lg:block border-top-1 lg:border-top-none surface-border py-3 lg:py-0 mt-3 lg:mt-0">
                            <Button label="Iniciar Sesión" text rounded className="border-none font-light line-height-2" style={{ color: '#926941' }} onClick={handleLoginClick}></Button>
                        </div>
                    </div>
                </div>

                <div
                    id="hero"
                    className="flex flex-column pt-4 px-4 lg:px-8 overflow-hidden"
                    style={{
                        background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #f5e9d9 0%, #e6d2b5 100%)',
                        clipPath: 'ellipse(150% 87% at 93% 13%)'
                    }}
                >
                    <div className="mx-4 md:mx-8 mt-0 md:mt-4">
                        <h1 className="text-6xl font-bold line-height-2" style={{ color: '#926941' }}>
                            <span className="font-light block">Patrimonio Cultural</span>de Cuba
                        </h1>
                        <p className="font-normal text-2xl line-height-3 md:mt-3 text-gray-700">Sistema de gestión para la catalogación, preservación y difusión del patrimonio cultural y objetos museables de Cuba. Salvaguardando nuestra historia para las futuras generaciones.</p>
                        <Button type="button" label="Explorar Colección" rounded className="text-xl border-none mt-3 font-normal line-height-3 px-3 text-white" style={{ backgroundColor: '#926941' }} onClick={handleCollectionClick}></Button>
                    </div>
                    <div className="flex justify-content-center md:justify-content-end">
                        <img src="/demo/images/landing/screen-1.png" alt="Imagen de Patrimonio" className="w-9 md:w-auto"/>
                    </div>
                </div>

                <div id="features" className="py-4 px-4 lg:px-8 mt-5 mx-0 lg:mx-8">
                    <div className="grid justify-content-center">
                        <div className="col-12 text-center mt-8 mb-4">
                            <h2 className="text-900 font-normal mb-2" style={{ color: '#926941' }}>Características Principales</h2>
                            <span className="text-600 text-2xl">Gestión integral del patrimonio cultural</span>
                        </div>

                        <div className="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
                            <div
                                style={{
                                    height: '160px',
                                    padding: '2px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(90deg, rgba(246, 232, 208, 0.2), rgba(187, 199, 205, 0.2)), linear-gradient(180deg, rgba(246, 232, 208, 0.2), rgba(187, 199, 205, 0.2))'
                                }}
                            >
                                <div className="p-3 surface-card h-full" style={{ borderRadius: '8px' }}>
                                    <div
                                        className="flex align-items-center justify-content-center mb-3"
                                        style={{
                                            width: '3.5rem',
                                            height: '3.5rem',
                                            borderRadius: '10px',
                                            backgroundColor: '#f5e9d9'
                                        }}
                                    >
                                        <i className="pi pi-fw pi-database text-2xl" style={{ color: '#926941' }}></i>
                                    </div>
                                    <h5 className="mb-2 text-900">Catalogación Digital</h5>
                                    <span className="text-600">Registro detallado de objetos museables y patrimoniales.</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
                            <div
                                style={{
                                    height: '160px',
                                    padding: '2px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(90deg, rgba(246, 232, 208, 0.2),rgba(230, 210, 181, 0.2)), linear-gradient(180deg, rgba(246, 232, 208, 0.2), rgba(230, 210, 181, 0.2))'
                                }}
                            >
                                <div className="p-3 surface-card h-full" style={{ borderRadius: '8px' }}>
                                    <div
                                        className="flex align-items-center justify-content-center mb-3"
                                        style={{
                                            width: '3.5rem',
                                            height: '3.5rem',
                                            borderRadius: '10px',
                                            backgroundColor: '#f5e9d9'
                                        }}
                                    >
                                        <i className="pi pi-fw pi-camera text-2xl" style={{ color: '#926941' }}></i>
                                    </div>
                                    <h5 className="mb-2 text-900">Documentación Visual</h5>
                                    <span className="text-600">Gestión de imágenes y documentos históricos.</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 md:col-12 lg:col-4 p-0 lg:pb-5 mt-4 lg:mt-0">
                            <div
                                style={{
                                    height: '160px',
                                    padding: '2px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(90deg, rgba(246, 232, 208, 0.2), rgba(230, 210, 181, 0.2)), linear-gradient(180deg, rgba(246, 232, 208, 0.2), rgba(230, 210, 181, 0.2))'
                                }}
                            >
                                <div className="p-3 surface-card h-full" style={{ borderRadius: '8px' }}>
                                    <div
                                        className="flex align-items-center justify-content-center"
                                        style={{
                                            width: '3.5rem',
                                            height: '3.5rem',
                                            borderRadius: '10px',
                                            backgroundColor: '#f5e9d9'
                                        }}
                                    >
                                        <i className="pi pi-fw pi-search text-2xl" style={{ color: '#926941' }}></i>
                                    </div>
                                    <h5 className="mb-2 text-900">Búsqueda Avanzada</h5>
                                    <span className="text-600">Localización rápida de objetos por múltiples criterios.</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
                            <div
                                style={{
                                    height: '160px',
                                    padding: '2px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(90deg, rgba(246, 232, 208, 0.2), rgba(230, 210, 181, 0.2)), linear-gradient(180deg, rgba(246, 232, 208, 0.2), rgba(230, 210, 181, 0.2))'
                                }}
                            >
                                <div className="p-3 surface-card h-full" style={{ borderRadius: '8px' }}>
                                    <div
                                        className="flex align-items-center justify-content-center mb-3"
                                        style={{
                                            width: '3.5rem',
                                            height: '3.5rem',
                                            borderRadius: '10px',
                                            backgroundColor: '#f5e9d9'
                                        }}
                                    >
                                        <i className="pi pi-fw pi-history text-2xl" style={{ color: '#926941' }}></i>
                                    </div>
                                    <h5 className="mb-2 text-900">Registro Histórico</h5>
                                    <span className="text-600">Seguimiento de la procedencia y restauraciones.</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
                            <div
                                style={{
                                    height: '160px',
                                    padding: '2px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(90deg, rgba(246, 232, 208, 0.2), rgba(230, 210, 181, 0.2)), linear-gradient(180deg, rgba(246, 232, 208, 0.2), rgba(230, 210, 181, 0.2))'
                                }}
                            >
                                <div className="p-3 surface-card h-full" style={{ borderRadius: '8px' }}>
                                    <div
                                        className="flex align-items-center justify-content-center mb-3"
                                        style={{
                                            width: '3.5rem',
                                            height: '3.5rem',
                                            borderRadius: '10px',
                                            backgroundColor: '#f5e9d9'
                                        }}
                                    >
                                        <i className="pi pi-fw pi-chart-bar text-2xl" style={{ color: '#926941' }}></i>
                                    </div>
                                    <h5 className="mb-2 text-900">Estadísticas</h5>
                                    <span className="text-600">Análisis y reportes sobre la colección patrimonial.</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 md:col-12 lg:col-4 p-0 lg:pb-5 mt-4 lg:mt-0">
                            <div
                                style={{
                                    height: '160px',
                                    padding: '2px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(90deg, rgba(246, 232, 208, 0.2), rgba(230, 210, 181, 0.2)), linear-gradient(180deg, rgba(246, 232, 208, 0.2), rgba(230, 210, 181, 0.2))'
                                }}
                            >
                                <div className="p-3 surface-card h-full" style={{ borderRadius: '8px' }}>
                                    <div
                                        className="flex align-items-center justify-content-center mb-3"
                                        style={{
                                            width: '3.5rem',
                                            height: '3.5rem',
                                            borderRadius: '10px',
                                            backgroundColor: '#f5e9d9'
                                        }}
                                    >
                                        <i className="pi pi-fw pi-shield text-2xl" style={{ color: '#926941' }}></i>
                                    </div>
                                    <h5 className="mb-2 text-900">Seguridad</h5>
                                    <span className="text-600">Protección de datos históricos y culturales.</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 mt-4 lg:mt-0">
                            <div
                                style={{
                                    height: '160px',
                                    padding: '2px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(90deg, rgba(246, 232, 208, 0.2), rgba(230, 210, 181, 0.2)), linear-gradient(180deg, rgba(246, 232, 208, 0.2), rgba(230, 210, 181, 0.2))'
                                }}
                            >
                                <div className="p-3 surface-card h-full" style={{ borderRadius: '8px' }}>
                                    <div
                                        className="flex align-items-center justify-content-center mb-3"
                                        style={{
                                            width: '3.5rem',
                                            height: '3.5rem',
                                            borderRadius: '10px',
                                            backgroundColor: '#f5e9d9'
                                        }}
                                    >
                                        <i className="pi pi-fw pi-calendar text-2xl" style={{ color: '#926941' }}></i>
                                    </div>
                                    <h5 className="mb-2 text-900">Gestión de Exposiciones</h5>
                                    <span className="text-600">Planificación y seguimiento de exhibiciones.</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 mt-4 lg:mt-0">
                            <div
                                style={{
                                    height: '160px',
                                    padding: '2px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(90deg, rgba(246, 232, 208, 0.2), rgba(230, 210, 181, 0.2)), linear-gradient(180deg, rgba(246, 232, 208, 0.2), rgba(230, 210, 181, 0.2))'
                                }}
                            >
                                <div className="p-3 surface-card h-full" style={{ borderRadius: '8px' }}>
                                    <div
                                        className="flex align-items-center justify-content-center mb-3"
                                        style={{
                                            width: '3.5rem',
                                            height: '3.5rem',
                                            borderRadius: '10px',
                                            backgroundColor: '#f5e9d9'
                                        }}
                                    >
                                        <i className="pi pi-fw pi-map text-2xl" style={{ color: '#926941' }}></i>
                                    </div>
                                    <h5 className="mb-2 text-900">Geolocalización</h5>
                                    <span className="text-600">Ubicación de sitios patrimoniales en Cuba.</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 md:col-12 lg:col-4 p-0 lg-4 mt-4 lg:mt-0">
                            <div
                                style={{
                                    height: '160px',
                                    padding: '2px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(90deg, rgba(246, 232, 208, 0.2), rgba(230, 210, 181, 0.2)), linear-gradient(180deg, rgba(246, 232, 208, 0.2), rgba(230, 210, 181, 0.2))'
                                }}
                            >
                                <div className="p-3 surface-card h-full" style={{ borderRadius: '8px' }}>
                                    <div
                                        className="flex align-items-center justify-content-center mb-3"
                                        style={{
                                            width: '3.5rem',
                                            height: '3.5rem',
                                            borderRadius: '10px',
                                            backgroundColor: '#f5e9d9'
                                        }}
                                    >
                                        <i className="pi pi-fw pi-users text-2xl" style={{ color: '#926941' }}></i>
                                    </div>
                                    <h5 className="mb-2 text-900">Control de Acceso</h5>
                                    <span className="text-600">Gestión de usuarios y permisos del sistema.</span>
                                </div>
                            </div>
                        </div>

                        <div
                            className="col-12 mt-8 mb-8 p-2 md:p-8"
                            style={{
                                borderRadius: '20px',
                                background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #f5e9d9 0%, #e6d2b5 100%)'
                            }}
                        >
                            <div className="flex flex-column justify-content-center align-items-center text-center px-3 py-3 md:py-0">
                                <h3 className="text-gray-900 mb-2" style={{ color: '#926941' }}>Ministerio de Cultura de Cuba</h3>
                                <span className="text-gray-600 text-2xl">Dirección de Patrimonio Cultural</span>
                                <p className="text-gray-900 sm:line-height-2 md:line-height-4 text-2xl mt-4" style={{ maxWidth: '800px' }}>
                                    &quot;Nuestro sistema de gestión patrimonial ha revolucionado la forma en que preservamos y compartimos la rica historia cultural de Cuba. La digitalización y catalogación sistemática nos permite proteger nuestro legado para las generaciones futuras.&quot;
                                </p>
                                <img src="/demo/images/landing/peak-logo.svg" className="mt-4" alt="Logo Patrimonio"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="highlights" className="py-4 px-4 lg:px-8 mx-0 my-6 lg:mx-8">
                    <div className="text-center">
                        <h2 className="text-900 font-normal mb-2" style={{ color: '#926941' }}>Patrimonio en Todas Partes</h2>
                        <span className="text-600 text-2xl">Acceso a nuestra historia desde cualquier dispositivo</span>
                    </div>

                    <div className="grid mt-8 pb-2 md:pb-8">
                        <div className="flex justify-content-center col-12 lg:col-6 p-0 flex-order-1 lg:flex-order-0" style={{ borderRadius: '8px', backgroundColor: '#f5e9d9' }}>
                            <img src="/demo/images/landing/mockup.svg" className="w-11" alt="Acceso móvil"/>
                        </div>

                        <div className="col-12 lg:col-6 my-auto flex flex-column lg:align-items-end text-center lg:text-right">
                            <div
                                className="flex align-items-center justify-content-center align-self-center lg:align-self-end"
                                style={{
                                    width: '4.2rem',
                                    height: '4.2rem',
                                    borderRadius: '10px',
                                    backgroundColor: '#f5e9d9'
                                }}
                            >
                                <i className="pi pi-fw pi-mobile text-5xl" style={{ color: '#926941' }}></i>
                            </div>
                            <h2 className="line-height-1 text-900 text-4xl font-normal" style={{ color: '#926941' }}>Acceso Móvil</h2>
                            <span className="text-700 text-2xl line-height-3 ml-0 md:ml-2" style={{ maxWidth: '650px' }}>
                                Gestione la colección patrimonial desde cualquier lugar. Ideal para trabajo de campo, inventarios y documentación in situ de nuevas adquisiciones o hallazgos arqueológicos.
                            </span>
                        </div>
                    </div>

                    <div className="grid my-8 pt-2 md:pt-8">
                        <div className="col-12 lg:col-6 my-auto flex flex-column text-center lg:text-left lg:align-items-start">
                            <div
                                className="flex align-items-center justify-content-center align-self-center lg:align-self-start"
                                style={{
                                    width: '4.2rem',
                                    height: '4.2rem',
                                    borderRadius: '10px',
                                    backgroundColor: '#f5e9d9'
                                }}
                            >
                                <i className="pi pi-fw pi-desktop text-5xl" style={{ color: '#926941' }}></i>
                            </div>
                            <h2 className="line-height-1 text-900 text-4xl font-normal" style={{ color: '#926941' }}>Panel Administrativo</h2>
                            <span className="text-700 text-2xl line-height-3 mr-0 md:mr-2" style={{ maxWidth: '650px' }}>
                                Interfaz completa para la gestión integral del patrimonio cultural. Reportes detallados, estadísticas y herramientas avanzadas para conservadores, curadores e investigadores.
                            </span>
                        </div>

                        <div className="flex justify-content-end flex-order-1 sm:flex-order-2 col-12 lg:col-6 p-0" style={{ borderRadius: '8px', backgroundColor: '#f5e9d9' }}>
                            <img src="/demo/images/landing/mockup-desktop.svg" className="w-11" alt="Panel administrativo" />
                        </div>
                    </div>
                </div>

                <div id="about" className="py-4 px-4 lg:px-8 mx-0 my-6 lg:mx-8">
                    <div className="text-center">
                        <h2 className="text-900 font-normal mb-2" style={{ color: '#926941' }}>Sobre Nosotros</h2>
                        <span className="text-600 text-2xl">Preservando el patrimonio cultural de Cuba</span>
                    </div>

                    <div className="grid mt-8 pb-2 md:pb-8">
                        <div className="col-12 lg:col-6 my-auto flex flex-column text-center lg:text-left">
                            <p className="text-700 text-xl line-height-3" style={{ maxWidth: '650px' }}>
                                El Sistema de Gestión de Patrimonio Cultural es una iniciativa del Ministerio de Cultura de Cuba, diseñada para preservar, catalogar y difundir el rico patrimonio histórico y cultural de la nación.
                            </p>
                            <p className="text-700 text-xl line-height-3 mt-4" style={{ maxWidth: '650px' }}>
                                Nuestra misión es salvaguardar los objetos museables y bienes patrimoniales, facilitando su documentación, investigación y acceso para las generaciones actuales y futuras.
                            </p>
                            <p className="text-700 text-xl line-height-3 mt-4" style={{ maxWidth: '650px' }}>
                                Trabajamos en colaboración con museos, archivos, bibliotecas y sitios históricos de toda Cuba para crear un registro digital completo de nuestro patrimonio cultural.
                            </p>
                            <Button type="button" label="Iniciar Sesión" rounded className="text-xl border-none mt-5 font-normal line-height-3 px-3 text-white align-self-start" style={{ backgroundColor: '#926941' }} onClick={handleLoginClick}></Button>
                        </div>

                        <div className="flex justify-content-center col-12 lg:col-6 p-0" style={{ borderRadius: '8px' }}>
                            <img src="/demo/images/login/museo-left.jpg" className="w-11" alt="Patrimonio cultural" style={{ borderRadius: '8px', maxHeight: '400px', objectFit: 'cover' }} />
                        </div>
                    </div>
                </div>

                <div className="py-4 px-4 mx-0 mt-8 lg:mx-8">
                    <div className="grid justify-content-between">
                        <div className="col-12 md:col-2" style={{ marginTop: '-1.5rem' }}>
                            <Link href="/" className="flex flex-wrap align-items-center justify-content-center md:justify-content-start md:mb-0 mb-3 cursor-pointer">
                                <img src="/demo/images/login/logoPatrimonio.jpg" alt="Logo Patrimonio" width="200" height="100" className="mr-2" />
                            </Link>
                        </div>

                        <div className="col-12 md:col-10 lg:col-7">
                            <div className="grid text-center md:text-left">
                                <div className="col-12 md:col-3">
                                    <h4 className="font-medium text-2xl line-height-3 mb-3 text-900" style={{ color: '#926941' }}>Institución</h4>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">Sobre Nosotros</a>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">Noticias</a>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">Eventos</a>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">Contacto</a>
                                    <a className="line-height-3 text-xl block cursor-pointer text-700">Directorio</a>
                                </div>

                                <div className="col-12 md:col-3 mt-4 md:mt-0">
                                    <h4 className="font-medium text-2xl line-height-3 mb-3 text-900" style={{ color: '#926941' }}>Recursos</h4>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">Guías de Uso</a>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">Documentación</a>
                                    <a className="line-height-3 text-xl block cursor-pointer text-700">Publicaciones</a>
                                </div>

                                <div className="col-12 md:col-3 mt-4 md:mt-0">
                                    <h4 className="font-medium text-2xl line-height-3 mb-3 text-900" style={{ color: '#926941' }}>Comunidad</h4>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">Foros</a>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                                        Conferencias
                                    </a>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">Preguntas Frecuentes</a>
                                    <a className="line-height-3 text-xl block cursor-pointer text-700">Blog</a>
                                </div>

                                <div className="col-12 md:col-3 mt-4 md:mt-0">
                                    <h4 className="font-medium text-2xl line-height-3 mb-3 text-900" style={{ color: '#926941' }}>Legal</h4>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">Términos de Uso</a>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">Política de Privacidad</a>
                                    <a className="line-height-3 text-xl block cursor-pointer text-700">Derechos de Autor</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
