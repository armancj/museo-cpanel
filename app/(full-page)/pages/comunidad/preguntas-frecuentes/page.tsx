'use client';
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputText } from 'primereact/inputtext';
import { Divider } from 'primereact/divider';
import { TabView, TabPanel } from 'primereact/tabview';
import { LogoLanding } from '@/app/common/component/LogoLanding';

const PreguntasFrecuentesPage = () => {
    const router = useRouter();
    const [searchValue, setSearchValue] = useState('');
    const [activeIndex, setActiveIndex] = useState(null);

    const handleBackClick = () => {
        router.push('/landing#about');
    };

    // Categorías de preguntas
    const categorias = [
        {
            nombre: 'General',
            icono: 'pi pi-info-circle',
            preguntas: [
                {
                    pregunta: '¿Qué es el Sistema de Gestión de Patrimonio Cultural?',
                    respuesta: 'El Sistema de Gestión de Patrimonio Cultural es una plataforma digital desarrollada por el Ministerio de Cultura de Cuba para la catalogación, preservación y difusión del patrimonio cultural y objetos museables de Cuba. Permite a museos, archivos, bibliotecas y sitios históricos gestionar eficientemente sus colecciones y bienes patrimoniales.'
                },
                {
                    pregunta: '¿Quiénes pueden utilizar el sistema?',
                    respuesta: 'El sistema está diseñado para ser utilizado por profesionales del patrimonio cultural, incluyendo conservadores, curadores, archivistas, bibliotecarios, investigadores y personal administrativo de instituciones culturales cubanas. El acceso se otorga a través de credenciales proporcionadas por el administrador del sistema.'
                },
                {
                    pregunta: '¿Cómo puedo solicitar acceso al sistema?',
                    respuesta: 'Para solicitar acceso al Sistema de Gestión de Patrimonio Cultural, debe contactar al Departamento de Tecnología del Ministerio de Cultura o al administrador de su institución. Deberá proporcionar información sobre su cargo, institución y el tipo de acceso que requiere.'
                },
                {
                    pregunta: '¿El sistema es gratuito?',
                    respuesta: 'Sí, el Sistema de Gestión de Patrimonio Cultural es gratuito para todas las instituciones culturales públicas de Cuba. Las instituciones privadas pueden solicitar información sobre condiciones de uso contactando al Ministerio de Cultura.'
                }
            ]
        },
        {
            nombre: 'Funcionalidades',
            icono: 'pi pi-cog',
            preguntas: [
                {
                    pregunta: '¿Qué funcionalidades principales ofrece el sistema?',
                    respuesta: 'El sistema ofrece múltiples funcionalidades, incluyendo: catalogación digital de objetos patrimoniales, gestión de imágenes y documentos, búsqueda avanzada, registro histórico de procedencia y restauraciones, generación de estadísticas y reportes, control de acceso y permisos, gestión de exposiciones, geolocalización de sitios patrimoniales, entre otras.'
                },
                {
                    pregunta: '¿Puedo personalizar los campos de catalogación según las necesidades de mi institución?',
                    respuesta: 'Sí, el sistema permite cierto grado de personalización en los campos de catalogación. Los administradores pueden activar o desactivar campos específicos según las necesidades de cada institución o colección. Para solicitar campos adicionales muy específicos, debe contactar al equipo de soporte técnico.'
                },
                {
                    pregunta: '¿Es posible importar datos desde otros sistemas o formatos?',
                    respuesta: 'Sí, el sistema permite la importación de datos desde varios formatos, incluyendo CSV, XML y JSON. También cuenta con conectores para sistemas comunes de gestión museística. Para importaciones complejas o migraciones desde sistemas específicos, se recomienda contactar al equipo de soporte técnico para recibir asistencia personalizada.'
                },
                {
                    pregunta: '¿Cómo puedo generar reportes sobre la colección?',
                    respuesta: 'El sistema ofrece un módulo de reportes que permite generar informes personalizados sobre la colección. Puede filtrar por diversos criterios como tipo de objeto, período, ubicación, estado de conservación, etc. Los reportes pueden ser exportados en formatos PDF, Excel o CSV para su posterior análisis o presentación.'
                }
            ]
        },
        {
            nombre: 'Técnico',
            icono: 'pi pi-desktop',
            preguntas: [
                {
                    pregunta: '¿Cuáles son los requisitos técnicos para utilizar el sistema?',
                    respuesta: 'El Sistema de Gestión de Patrimonio Cultural es una aplicación web que puede ser accedida desde cualquier navegador moderno (Chrome, Firefox, Safari, Edge). Se recomienda una conexión a internet estable y una resolución de pantalla mínima de 1280x720 para una experiencia óptima. Para la carga de imágenes y documentos, se recomienda una conexión de al menos 2 Mbps.'
                },
                {
                    pregunta: '¿El sistema funciona en dispositivos móviles?',
                    respuesta: 'Sí, el sistema cuenta con una interfaz responsiva que se adapta a diferentes tamaños de pantalla, incluyendo tablets y smartphones. Existe también una aplicación móvil específica para trabajo de campo, inventarios y documentación in situ, disponible para dispositivos Android e iOS.'
                },
                {
                    pregunta: '¿Cómo se gestionan las copias de seguridad de los datos?',
                    respuesta: 'El sistema realiza copias de seguridad automáticas diarias de todos los datos. Estas copias se almacenan en servidores redundantes para garantizar la seguridad de la información. Adicionalmente, cada institución puede solicitar copias de seguridad específicas de sus colecciones cuando lo considere necesario.'
                },
                {
                    pregunta: '¿Qué medidas de seguridad implementa el sistema para proteger la información?',
                    respuesta: 'El sistema implementa múltiples capas de seguridad, incluyendo: conexiones cifradas mediante HTTPS, autenticación de dos factores para usuarios con privilegios elevados, registro detallado de todas las acciones realizadas en el sistema, control de acceso basado en roles, protección contra ataques comunes (SQL injection, XSS, CSRF), y auditorías de seguridad periódicas.'
                }
            ]
        },
        {
            nombre: 'Soporte',
            icono: 'pi pi-question-circle',
            preguntas: [
                {
                    pregunta: '¿Cómo puedo obtener ayuda si tengo problemas con el sistema?',
                    respuesta: 'Existen varias vías para obtener soporte: consultar la documentación y guías de usuario disponibles en la sección de Recursos, participar en los foros de la comunidad para preguntar a otros usuarios, contactar al administrador del sistema en su institución, o abrir un ticket de soporte técnico a través del formulario de contacto para problemas más complejos.'
                },
                {
                    pregunta: '¿Existe capacitación disponible para nuevos usuarios?',
                    respuesta: 'Sí, el Ministerio de Cultura ofrece regularmente sesiones de capacitación tanto presenciales como virtuales para nuevos usuarios. Además, hay tutoriales en video disponibles en la sección de Recursos y webinars mensuales sobre diferentes aspectos del sistema. Las instituciones también pueden solicitar sesiones de capacitación personalizadas para su personal.'
                },
                {
                    pregunta: '¿Con qué frecuencia se actualiza el sistema?',
                    respuesta: 'El sistema recibe actualizaciones de mantenimiento mensualmente y actualizaciones mayores con nuevas funcionalidades aproximadamente cada tres meses. Todas las actualizaciones son anunciadas con anticipación a través de la plataforma y por correo electrónico a los administradores de cada institución.'
                },
                {
                    pregunta: '¿Puedo sugerir mejoras o nuevas funcionalidades para el sistema?',
                    respuesta: 'Absolutamente. Valoramos mucho la retroalimentación de los usuarios. Puede enviar sugerencias a través del formulario de contacto, participar en los foros de la comunidad en la sección de Sugerencias, o asistir a las reuniones trimestrales de usuarios donde se discuten las prioridades de desarrollo futuro.'
                }
            ]
        }
    ];

    const filteredCategorias = searchValue.trim() === ''
        ? categorias
        : categorias.map(categoria => ({
            ...categoria,
            preguntas: categoria.preguntas.filter(pregunta =>
                pregunta.pregunta.toLowerCase().includes(searchValue.toLowerCase()) ||
                pregunta.respuesta.toLowerCase().includes(searchValue.toLowerCase())
            )
        })).filter(categoria => categoria.preguntas.length > 0);

    return (
        <div className="surface-0 flex justify-content-center">
            <div className="landing-wrapper overflow-hidden">
                <LogoLanding />

                <div className="py-4 px-4 lg:px-8 mt-5 mx-0 lg:mx-8">
                    <div className="grid justify-content-center">
                        <div className="col-12 text-center mt-8 mb-4">
                            <h2 className="text-900 font-normal mb-2" style={{ color: '#926941' }}>Preguntas Frecuentes</h2>
                            <span className="text-600 text-2xl">Respuestas a las dudas más comunes sobre el Sistema de Gestión de Patrimonio Cultural</span>
                        </div>

                        <div className="col-12 mb-5">
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-search"></i>
                                </span>
                                <InputText
                                    placeholder="Buscar preguntas frecuentes..."
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    className="w-full"
                                />
                                {searchValue && (
                                    <Button
                                        icon="pi pi-times"
                                        className="p-button-danger"
                                        onClick={() => setSearchValue('')}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="col-12">
                            <TabView>
                                <TabPanel header="Todas las Preguntas">
                                    {filteredCategorias.length > 0 ? (
                                        filteredCategorias.map((categoria, index) => (
                                            <div key={index} className="mb-5">
                                                <div className="flex align-items-center mb-3">
                                                    <i className={`${categoria.icono} text-2xl mr-2`} style={{ color: '#926941' }}></i>
                                                    <h3 className="m-0" style={{ color: '#926941' }}>{categoria.nombre}</h3>
                                                </div>
                                                <Accordion multiple activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                                                    {categoria.preguntas.map((pregunta, idx) => (
                                                        <AccordionTab key={idx} header={pregunta.pregunta}>
                                                            <p className="line-height-3 text-700">{pregunta.respuesta}</p>
                                                        </AccordionTab>
                                                    ))}
                                                </Accordion>
                                                {index < filteredCategorias.length - 1 && <Divider />}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex flex-column align-items-center justify-content-center py-5">
                                            <i className="pi pi-search text-5xl mb-3" style={{ color: '#926941' }}></i>
                                            <h3 className="text-900 font-medium mb-3">No se encontraron resultados</h3>
                                            <p className="text-700 text-center mb-4">No hay preguntas que coincidan con su búsqueda. Intente con otros términos o consulte todas las categorías.</p>
                                            <Button label="Ver Todas las Preguntas" icon="pi pi-list" className="p-button-rounded" style={{ backgroundColor: '#926941', border: 'none' }} onClick={() => setSearchValue('')} />
                                        </div>
                                    )}
                                </TabPanel>
                                {categorias.map((categoria, index) => (
                                    <TabPanel key={index} header={categoria.nombre} leftIcon={`${categoria.icono} mr-2`}>
                                        <Accordion multiple>
                                            {categoria.preguntas.map((pregunta, idx) => (
                                                <AccordionTab key={idx} header={pregunta.pregunta}>
                                                    <p className="line-height-3 text-700">{pregunta.respuesta}</p>
                                                </AccordionTab>
                                            ))}
                                        </Accordion>
                                    </TabPanel>
                                ))}
                            </TabView>
                        </div>

                        <div className="col-12 mt-6">
                            <Divider />
                            <div className="flex flex-column align-items-center justify-content-center p-5 bg-primary" style={{ borderRadius: '10px', backgroundColor: '#f5e9d9 !important' }}>
                                <h3 className="text-900 font-normal mb-2" style={{ color: '#926941' }}>¿No encuentra respuesta a su pregunta?</h3>
                                <p className="text-700 text-center mb-4">Si no ha encontrado la información que busca, puede contactarnos directamente o participar en nuestros foros de discusión.</p>
                                <div className="flex flex-column sm:flex-row gap-3">
                                    <Button label="Contactar Soporte" icon="pi pi-envelope" className="p-button-rounded" style={{ backgroundColor: '#926941', border: 'none' }} onClick={() => router.push('/pages/institucion/contacto')} />
                                    <Button label="Visitar Foros" icon="pi pi-comments" className="p-button-rounded p-button-outlined" style={{ color: '#926941', borderColor: '#926941' }} onClick={() => router.push('/pages/comunidad/foros')} />
                                </div>
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

export default PreguntasFrecuentesPage;
