'use client';
import React from 'react';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import Link from 'next/link';

const PoliticaDePrivacidadPage = () => {
    return (
        <div className="surface-0 flex justify-content-center">
            <div className="text-900 font-bold text-6xl mb-4 text-center">Política de Privacidad</div>
            <div className="text-700 text-xl mb-6 text-center line-height-3">Sistema de Gestión de Patrimonio Cultural de Cuba</div>

            <div className="card">
                <Card className="p-4">
                    <h2 className="text-900 font-semibold text-xl mb-4" style={{ color: '#926941' }}>1. Información que Recopilamos</h2>
                    <p className="text-700 line-height-3 mb-4">
                        El Sistema de Gestión de Patrimonio Cultural recopila información necesaria para la catalogación y preservación del patrimonio cultural cubano.
                        Esto incluye datos sobre objetos museables, documentos históricos, sitios patrimoniales y la información de los usuarios autorizados del sistema.
                    </p>

                    <Divider />

                    <h2 className="text-900 font-semibold text-xl mb-4" style={{ color: '#926941' }}>2. Uso de la Información</h2>
                    <p className="text-700 line-height-3 mb-4">
                        La información recopilada se utiliza exclusivamente para los fines de gestión, investigación, conservación y difusión del patrimonio cultural
                        de Cuba. Los datos personales de los usuarios se utilizan únicamente para la administración de accesos y permisos dentro del sistema.
                    </p>

                    <Divider />

                    <h2 className="text-900 font-semibold text-xl mb-4" style={{ color: '#926941' }}>3. Protección de Datos</h2>
                    <p className="text-700 line-height-3 mb-4">
                        Implementamos medidas de seguridad técnicas y organizativas para proteger la información almacenada en nuestro sistema. Esto incluye
                        encriptación de datos, controles de acceso, auditorías regulares y procedimientos de respaldo para garantizar la integridad y confidencialidad
                        de la información.
                    </p>

                    <Divider />

                    <h2 className="text-900 font-semibold text-xl mb-4" style={{ color: '#926941' }}>4. Acceso y Control</h2>
                    <p className="text-700 line-height-3 mb-4">
                        Los usuarios autorizados tienen derecho a acceder, corregir o actualizar su información personal en el sistema. El acceso a la información
                        sobre el patrimonio cultural está regulado según los niveles de autorización establecidos por el Ministerio de Cultura de Cuba.
                    </p>

                    <Divider />

                    <h2 className="text-900 font-semibold text-xl mb-4" style={{ color: '#926941' }}>5. Compartir Información</h2>
                    <p className="text-700 line-height-3 mb-4">
                        La información sobre el patrimonio cultural puede ser compartida con instituciones académicas, culturales o gubernamentales para fines
                        de investigación, educación o preservación. Cualquier intercambio de información se realiza bajo acuerdos que garantizan el uso adecuado
                        y la protección de los datos.
                    </p>

                    <div className="flex justify-content-center mt-6">
                        <Link href="/" className="p-button font-bold px-5 py-3 p-button-rounded p-button-lg" style={{ backgroundColor: '#926941', color: 'white', textDecoration: 'none' }}>
                            Volver a Inicio
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PoliticaDePrivacidadPage;
