'use client';
import React from 'react';
import { Button } from 'primereact/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Card } from 'primereact/card';

const GuiasDeUsoPage = () => {
    const router = useRouter();

    const handleBackClick = () => {
        router.push('/landing');
    };

    // Guías de ejemplo
    const guias = [
        {
            id: 1,
            titulo: 'Introducción al Sistema',
            descripcion: 'Guía básica para comenzar a utilizar el Sistema de Gestión de Patrimonio Cultural.',
            icono: 'pi pi-book',
            color: '#4CAF50'
        },
        {
            id: 2,
            titulo: 'Catalogación de Objetos',
            descripcion: 'Aprenda a registrar y catalogar objetos museables en el sistema.',
            icono: 'pi pi-tag',
            color: '#2196F3'
        },
        {
            id: 3,
            titulo: 'Gestión de Imágenes',
            descripcion: 'Cómo subir, editar y asociar imágenes a los objetos patrimoniales.',
            icono: 'pi pi-images',
            color: '#9C27B0'
        },
        {
            id: 4,
            titulo: 'Búsqueda Avanzada',
            descripcion: 'Técnicas para realizar búsquedas eficientes en la base de datos patrimonial.',
            icono: 'pi pi-search',
            color: '#FF9800'
        },
        {
            id: 5,
            titulo: 'Generación de Reportes',
            descripcion: 'Cómo crear y exportar reportes personalizados sobre la colección.',
            icono: 'pi pi-file-pdf',
            color: '#F44336'
        },
        {
            id: 6,
            titulo: 'Administración de Usuarios',
            descripcion: 'Gestión de permisos y roles para el acceso al sistema.',
            icono: 'pi pi-users',
            color: '#607D8B'
        }
    ];

    const header = (guia) => (
        <div className="flex align-items-center gap-2 p-3">
            <div className="flex align-items-center justify-content-center" style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: guia.color }}>
                <i className={`${guia.icono} text-white text-xl`}></i>
            </div>
            <span className="font-bold text-xl">{guia.titulo}</span>
        </div>
    );

    return (
        <div className="surface-0 flex justify-content-center">
            <div className="landing-wrapper overflow-hidden">
                <LogoLanding />

                <div className="py-4 px-4 lg:px-8 mt-5 mx-0 lg:mx-8">
                    <div className="grid justify-content-center">
                        <div className="col-12 text-center mt-8 mb-4">
                            <h2 className="text-900 font-normal mb-2" style={{ color: '#926941' }}>Guías de Uso</h2>
                            <span className="text-600 text-2xl">Aprenda a utilizar el Sistema de Gestión de Patrimonio Cultural</span>
                        </div>

                        <div className="col-12 md:col-10 lg:col-8">
                            <div className="grid">
                                {guias.map((guia) => (
                                    <div key={guia.id} className="col-12 md:col-6 p-3">
                                        <Card title={header(guia)} className="h-full">
                                            <p className="m-0 line-height-3 text-700">{guia.descripcion}</p>
                                            <div className="flex justify-content-end mt-4">
                                                <Button label="Ver Guía" icon="pi pi-arrow-right" className="p-button-outlined" style={{ color: guia.color, borderColor: guia.color }} />
                                            </div>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="col-12 md:col-10 lg:col-8 mt-6">
                            <div className="card">
                                <h3 className="text-center font-normal mb-4" style={{ color: '#926941' }}>Preguntas Frecuentes</h3>
                                <Accordion multiple>
                                    <AccordionTab header="¿Cómo puedo acceder al sistema?">
                                        <p className="line-height-3 text-700">
                                            Para acceder al Sistema de Gestión de Patrimonio Cultural, debe utilizar las credenciales proporcionadas por el administrador del sistema.
                                            Haga clic en el botón &quot;Iniciar Sesión&quot; en la página principal y complete el formulario con su nombre de usuario y contraseña.
                                            Si no tiene credenciales, contacte al Departamento de Tecnología para solicitar acceso.
                                        </p>
                                    </AccordionTab>
                                    <AccordionTab header="¿Cómo registrar un nuevo objeto en el sistema?">
                                        <p className="line-height-3 text-700">
                                            Para registrar un nuevo objeto patrimonial, acceda a la sección &quot;Catalogación&quot; desde el menú principal.
                                            Haga clic en &quot;Nuevo Objeto&quot; y complete el formulario con toda la información disponible sobre el objeto.
                                            Es importante incluir al menos los campos obligatorios marcados con asterisco (*).
                                            Una vez completado el formulario, haga clic en &quot;Guardar&quot; para registrar el objeto en la base de datos.
                                        </p>
                                    </AccordionTab>
                                    <AccordionTab header="¿Cómo puedo asociar imágenes a un objeto?">
                                        <p className="line-height-3 text-700">
                                            Para asociar imágenes a un objeto ya registrado, busque y seleccione el objeto en el sistema.
                                            En la ficha del objeto, vaya a la pestaña &quot;Imágenes&quot; y haga clic en &quot;Agregar Imagen&quot;.
                                            Puede subir imágenes desde su computadora en formatos JPG, PNG o TIFF.
                                            Para cada imagen, puede agregar metadatos como descripción, fecha de captura y créditos.
                                        </p>
                                    </AccordionTab>
                                    <AccordionTab header="¿Cómo generar reportes de la colección?">
                                        <p className="line-height-3 text-700">
                                            Para generar reportes, acceda a la sección &quot;Reportes&quot; desde el menú principal.
                                            Seleccione el tipo de reporte que desea generar (inventario, estado de conservación, ubicación, etc.).
                                            Aplique los filtros necesarios para personalizar el reporte según sus necesidades.
                                            Haga clic en &quot;Generar Reporte&quot; y seleccione el formato de salida (PDF, Excel, CSV).
                                            El sistema procesará la solicitud y le permitirá descargar el reporte generado.
                                        </p>
                                    </AccordionTab>
                                    <AccordionTab header="¿Cómo realizar búsquedas avanzadas?">
                                        <p className="line-height-3 text-700">
                                            Para realizar búsquedas avanzadas, utilice la función &quot;Búsqueda Avanzada&quot; disponible en el menú principal.
                                            Esta herramienta le permite combinar múltiples criterios de búsqueda como categoría, período, material, ubicación, etc.
                                            También puede buscar por campos específicos como número de inventario, autor o palabras clave.
                                            Los resultados pueden ser filtrados, ordenados y exportados según sus necesidades.
                                        </p>
                                    </AccordionTab>
                                    <AccordionTab header="¿Cómo actualizar la información de un objeto?">
                                        <p className="line-height-3 text-700">
                                            Para actualizar la información de un objeto, primero debe localizarlo mediante la función de búsqueda.
                                            Una vez seleccionado el objeto, haga clic en el botón &quot;Editar&quot; en la ficha del objeto.
                                            Modifique los campos necesarios y haga clic en &quot;Guardar&quot; para aplicar los cambios.
                                            El sistema mantendrá un registro de todas las modificaciones realizadas, incluyendo la fecha y el usuario que realizó los cambios.
                                        </p>
                                    </AccordionTab>
                                </Accordion>
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

export default GuiasDeUsoPage;
