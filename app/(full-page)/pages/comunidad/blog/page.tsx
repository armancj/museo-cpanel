'use client';
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Avatar } from 'primereact/avatar';
import { Chip } from 'primereact/chip';
import { LogoLanding } from '@/app/common/component/LogoLanding';

const BlogPage = () => {
    const router = useRouter();
    const [searchValue, setSearchValue] = useState('');

    const handleBackClick = () => {
        router.push('/landing');
    };

    // Artículos de blog de ejemplo
    const articulos = [
        {
            id: 1,
            titulo: 'La Digitalización del Patrimonio Cultural: Un Paso Hacia el Futuro',
            resumen: 'Exploramos cómo la digitalización está transformando la preservación y difusión del patrimonio cultural cubano, permitiendo un acceso sin precedentes a colecciones históricas.',
            contenido: `
                <p>La digitalización del patrimonio cultural representa uno de los avances más significativos en la preservación y difusión de nuestra historia. En Cuba, este proceso ha cobrado especial relevancia en los últimos años, permitiendo que colecciones de incalculable valor histórico y cultural sean accesibles para investigadores, estudiantes y el público en general.</p>

                <p>El Sistema de Gestión de Patrimonio Cultural ha sido fundamental en este proceso, proporcionando las herramientas necesarias para la catalogación digital, el almacenamiento seguro y la difusión controlada de estos bienes patrimoniales.</p>

                <h3>Beneficios de la Digitalización</h3>

                <ul>
                    <li><strong>Preservación:</strong> Las copias digitales permiten conservar el contenido de documentos y objetos frágiles, reduciendo la manipulación de los originales.</li>
                    <li><strong>Accesibilidad:</strong> Las colecciones digitalizadas pueden ser consultadas desde cualquier lugar, eliminando barreras geográficas.</li>
                    <li><strong>Investigación:</strong> Facilita el análisis comparativo y la aplicación de herramientas digitales para el estudio del patrimonio.</li>
                    <li><strong>Difusión:</strong> Permite compartir el patrimonio cultural con audiencias más amplias, promoviendo su valoración y conocimiento.</li>
                </ul>

                <p>Sin embargo, la digitalización también presenta desafíos importantes, como la necesidad de actualización tecnológica constante, la gestión de grandes volúmenes de datos y la garantía de la autenticidad de las copias digitales.</p>

                <p>En el Ministerio de Cultura de Cuba, estamos comprometidos con abordar estos desafíos y continuar avanzando en la digitalización de nuestro rico patrimonio cultural, asegurando que las generaciones futuras puedan acceder a este legado invaluable.</p>
            `,
            imagen: '/demo/images/login/museo-left.jpg',
            fecha: '10 de junio, 2025',
            autor: 'Dr. Carlos Rodríguez Pérez',
            cargo: 'Director General, Sistema de Gestión de Patrimonio Cultural',
            avatar: '/demo/images/login/museo-left.jpg',
            categorias: ['Digitalización', 'Preservación', 'Tecnología'],
            destacado: true
        },
        {
            id: 2,
            titulo: 'Técnicas Avanzadas de Conservación Preventiva para Documentos Históricos',
            resumen: 'Analizamos las últimas técnicas y mejores prácticas en conservación preventiva para documentos históricos, fundamentales para la preservación del patrimonio documental cubano.',
            contenido: `
                <p>La conservación preventiva constituye la primera línea de defensa para la preservación de documentos históricos. A diferencia de la restauración, que interviene cuando el daño ya está hecho, la conservación preventiva se enfoca en crear condiciones óptimas para evitar el deterioro de los materiales.</p>

                <p>En el contexto del patrimonio documental cubano, caracterizado por un clima tropical con alta humedad, la conservación preventiva adquiere una importancia crítica.</p>

                <h3>Factores de Deterioro</h3>

                <p>Los principales factores que amenazan la integridad de los documentos históricos incluyen:</p>

                <ul>
                    <li><strong>Factores ambientales:</strong> Temperatura, humedad relativa, luz y contaminantes atmosféricos.</li>
                    <li><strong>Factores biológicos:</strong> Microorganismos, insectos y roedores.</li>
                    <li><strong>Factores químicos:</strong> Acidez del papel, oxidación de tintas y contaminantes.</li>
                    <li><strong>Factores físico-mecánicos:</strong> Manipulación inadecuada, almacenamiento incorrecto y desastres naturales.</li>
                </ul>

                <h3>Técnicas Avanzadas de Conservación</h3>

                <p>Las técnicas más recientes para la conservación preventiva incluyen:</p>

                <ul>
                    <li><strong>Control ambiental inteligente:</strong> Sistemas automatizados que mantienen condiciones estables de temperatura (18-20°C) y humedad relativa (45-55%).</li>
                    <li><strong>Materiales de almacenamiento libres de ácido:</strong> Cajas, carpetas y sobres con reserva alcalina que neutralizan la acidez.</li>
                    <li><strong>Filtros UV y control de iluminación:</strong> Limitación de la exposición a la luz a menos de 50 lux para materiales sensibles.</li>
                    <li><strong>Monitoreo integrado:</strong> Sensores que alertan sobre cambios en las condiciones ambientales o presencia de plagas.</li>
                </ul>

                <p>La implementación de estas técnicas, junto con la capacitación continua del personal y la elaboración de planes de emergencia, son fundamentales para garantizar la preservación a largo plazo de nuestro invaluable patrimonio documental.</p>
            `,
            imagen: '/demo/images/login/museo-left.jpg',
            fecha: '28 de mayo, 2025',
            autor: 'Dra. María González Valdés',
            cargo: 'Directora de Conservación',
            avatar: '/demo/images/login/museo-left.jpg',
            categorias: ['Conservación', 'Documentos', 'Metodología'],
            destacado: false
        },
        {
            id: 3,
            titulo: 'El Papel de la Inteligencia Artificial en la Catalogación de Objetos Patrimoniales',
            resumen: 'Investigamos cómo la inteligencia artificial está revolucionando los procesos de catalogación de objetos patrimoniales, mejorando la eficiencia y precisión en la documentación.',
            contenido: `
                <p>La inteligencia artificial (IA) está transformando numerosos campos, y la gestión del patrimonio cultural no es una excepción. En particular, la catalogación de objetos patrimoniales, tradicionalmente un proceso laborioso y que requiere conocimientos especializados, está experimentando una revolución gracias a las tecnologías de IA.</p>

                <h3>Aplicaciones de la IA en la Catalogación</h3>

                <ul>
                    <li><strong>Reconocimiento de imágenes:</strong> Algoritmos capaces de identificar estilos artísticos, períodos históricos y características formales de objetos a partir de fotografías.</li>
                    <li><strong>Procesamiento de lenguaje natural:</strong> Análisis de documentos históricos y extracción automática de metadatos relevantes.</li>
                    <li><strong>Clasificación automática:</strong> Categorización de objetos según taxonomías establecidas basándose en sus características visuales y descriptivas.</li>
                    <li><strong>Detección de similitudes:</strong> Identificación de relaciones entre objetos de diferentes colecciones, facilitando estudios comparativos.</li>
                </ul>

                <h3>Caso de Estudio: Proyecto Piloto en el Museo Nacional de Bellas Artes</h3>

                <p>En colaboración con la Universidad de La Habana, hemos implementado un sistema de IA para la catalogación de la colección de arte colonial. Los resultados preliminares muestran:</p>

                <ul>
                    <li>Reducción del 60% en el tiempo necesario para la catalogación inicial.</li>
                    <li>Mejora del 40% en la consistencia de los metadatos asignados.</li>
                    <li>Identificación de relaciones previamente desconocidas entre obras de la colección.</li>
                </ul>

                <p>Es importante destacar que la IA no reemplaza el conocimiento experto de conservadores y curadores, sino que actúa como una herramienta de apoyo que potencia su trabajo. La validación humana sigue siendo esencial para garantizar la calidad y precisión de la catalogación.</p>

                <p>A medida que estas tecnologías continúen evolucionando, anticipamos un futuro donde la colaboración entre humanos e IA permitirá una documentación más completa, accesible y enriquecida de nuestro patrimonio cultural.</p>
            `,
            imagen: '/demo/images/login/museo-left.jpg',
            fecha: '15 de mayo, 2025',
            autor: 'Ing. Ana Fernández Díaz',
            cargo: 'Directora de Tecnología',
            avatar: '/demo/images/login/museo-left.jpg',
            categorias: ['Tecnología', 'Catalogación', 'Inteligencia Artificial'],
            destacado: true
        }
    ];

    // Categorías populares
    const categorias = [
        { nombre: 'Digitalización', articulos: 12 },
        { nombre: 'Conservación', articulos: 15 },
        { nombre: 'Tecnología', articulos: 10 },
        { nombre: 'Catalogación', articulos: 8 },
        { nombre: 'Metodología', articulos: 7 },
        { nombre: 'Investigación', articulos: 9 },
        { nombre: 'Patrimonio', articulos: 14 },
        { nombre: 'Museos', articulos: 11 }
    ];

    // Autores destacados
    const autores = [
        { nombre: 'Dr. Carlos Rodríguez Pérez', cargo: 'Director General', articulos: 8, avatar: '/demo/images/login/museo-left.jpg' },
        { nombre: 'Dra. María González Valdés', cargo: 'Directora de Conservación', articulos: 12, avatar: '/demo/images/login/museo-left.jpg' },
        { nombre: 'Ing. Ana Fernández Díaz', cargo: 'Directora de Tecnología', articulos: 7, avatar: '/demo/images/login/museo-left.jpg' },
        { nombre: 'Lic. Juan Martínez Soto', cargo: 'Jefe de Catalogación', articulos: 9, avatar: '/demo/images/login/museo-left.jpg' }
    ];

    const filteredArticulos =
        searchValue.trim() === ''
            ? articulos
            : articulos.filter(
                  (articulo) =>
                      articulo.titulo.toLowerCase().includes(searchValue.toLowerCase()) ||
                      articulo.resumen.toLowerCase().includes(searchValue.toLowerCase()) ||
                      articulo.autor.toLowerCase().includes(searchValue.toLowerCase()) ||
                      articulo.categorias.some((cat) => cat.toLowerCase().includes(searchValue.toLowerCase()))
              );

    const getCategorySeverity = (category: any) => {
        switch(category) {
            case 'Digitalización':
            case 'Tecnología':
            case 'Inteligencia Artificial':
                return 'info';
            case 'Conservación':
            case 'Preservación':
            case 'Metodología':
                return 'success';
            case 'Catalogación':
            case 'Documentos':
            case 'Patrimonio':
                return 'warning';
            case 'Investigación':
            case 'Museos':
                return 'danger';
            default:
                return 'secondary';
        }
    };

    const header = (articulo: { id?: number; titulo: any; resumen?: string; contenido?: string; imagen: any; fecha?: string; autor?: string; cargo?: string; avatar?: string; categorias?: string[]; destacado: any }) => (
        <div className="relative">
            <img src={articulo.imagen} alt={articulo.titulo} className="w-full" style={{ height: '250px', objectFit: 'cover' }} />
            {articulo.destacado && (
                <div className="absolute" style={{ top: '10px', left: '10px' }}>
                    <Tag value="Destacado" severity="warning" />
                </div>
            )}
        </div>
    );

    const footer = (articulo: { id?: number; titulo?: string; resumen?: string; contenido?: string; imagen?: string; fecha: any; autor?: string; cargo?: string; avatar?: string; categorias: any; destacado?: boolean }) => (
        <div>
            <div className="flex flex-wrap gap-2 mb-3">
                {articulo.categorias.map(
                    (
                        categoria: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined,
                        index: React.Key | null | undefined
                    ) => (
                        <Tag key={index} value={categoria} severity={getCategorySeverity(categoria)} />
                    )
                )}
            </div>
            <div className="flex justify-content-between align-items-center">
                <span className="text-sm text-500">{articulo.fecha}</span>
                <Button label="Leer más" icon="pi pi-arrow-right" className="p-button-text" style={{ color: '#926941' }} />
            </div>
        </div>
    );

    return (
        <div className="surface-0 flex justify-content-center">
            <div className="landing-wrapper overflow-hidden">
                <LogoLanding />

                <div className="py-4 px-4 lg:px-8 mt-5 mx-0 lg:mx-8">
                    <div className="grid">
                        <div className="col-12 text-center mt-8 mb-4">
                            <h2 className="text-900 font-normal mb-2" style={{ color: '#926941' }}>Blog</h2>
                            <span className="text-600 text-2xl">Artículos sobre patrimonio cultural, conservación y tecnología</span>
                        </div>

                        <div className="col-12 mb-5">
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-search"></i>
                                </span>
                                <InputText
                                    placeholder="Buscar artículos..."
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

                        <div className="col-12 lg:col-8">
                            {filteredArticulos.length > 0 ? (
                                <div className="grid">
                                    {filteredArticulos.map((articulo) => (
                                        <div key={articulo.id} className="col-12 p-3">
                                            <Card
                                                title={articulo.titulo}
                                                subTitle={
                                                    <div className="flex align-items-center gap-2">
                                                        <Avatar image={articulo.avatar} shape="circle" size="small" />
                                                        <span>{articulo.autor} | {articulo.cargo}</span>
                                                    </div>
                                                }
                                                header={() => header(articulo)}
                                                footer={() => footer(articulo)}
                                                className="h-full"
                                            >
                                                <p className="line-height-3 text-700">{articulo.resumen}</p>
                                            </Card>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-column align-items-center justify-content-center py-5">
                                    <i className="pi pi-search text-5xl mb-3" style={{ color: '#926941' }}></i>
                                    <h3 className="text-900 font-medium mb-3">No se encontraron artículos</h3>
                                    <p className="text-700 text-center mb-4">No hay artículos que coincidan con su búsqueda. Intente con otros términos o explore todas las categorías.</p>
                                    <Button label="Ver Todos los Artículos" icon="pi pi-list" className="p-button-rounded" style={{ backgroundColor: '#926941', border: 'none' }} onClick={() => setSearchValue('')} />
                                </div>
                            )}
                        </div>

                        <div className="col-12 lg:col-4">
                            <div className="p-4 border-1 surface-border surface-card border-round mb-4">
                                <h3 className="text-xl font-medium text-900 mb-3" style={{ color: '#926941' }}>Categorías</h3>
                                <div className="flex flex-wrap gap-2">
                                    {categorias.map((categoria, index) => (
                                        <Chip
                                            key={index}
                                            label={`${categoria.nombre} (${categoria.articulos})`}
                                            className="mr-2 mb-2"
                                            style={{ backgroundColor: '#f5e9d9', color: '#926941' }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 border-1 surface-border surface-card border-round mb-4">
                                <h3 className="text-xl font-medium text-900 mb-3" style={{ color: '#926941' }}>Autores Destacados</h3>
                                {autores.map((autor, index) => (
                                    <div key={index} className="flex align-items-center mb-3">
                                        <Avatar image={autor.avatar} shape="circle" className="mr-2" />
                                        <div>
                                            <span className="block font-medium text-900">{autor.nombre}</span>
                                            <span className="block text-600 text-sm">{autor.cargo} | {autor.articulos} artículos</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 border-1 surface-border surface-card border-round">
                                <h3 className="text-xl font-medium text-900 mb-3" style={{ color: '#926941' }}>Suscríbete</h3>
                                <p className="text-700 mb-3">Recibe los últimos artículos directamente en tu correo electrónico</p>
                                <div className="p-inputgroup">
                                    <InputText placeholder="Tu correo electrónico" />
                                    <Button label="Suscribirse" style={{ backgroundColor: '#926941', border: 'none' }} />
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

export default BlogPage;
