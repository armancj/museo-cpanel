'use client';
import React from 'react';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import Link from 'next/link';
import { BackToLanding } from '@/app/common/component/BackToLanding';

const DerechosDeAutorPage = () => {
    return (
        <div className="surface-0 flex justify-content-center">
            <div className="text-900 font-bold text-6xl mb-4 text-center">Derechos de Autor</div>
            <div className="text-700 text-xl mb-6 text-center line-height-3">Sistema de Gestión de Patrimonio Cultural de Cuba</div>

            <div className="card">
                <Card className="p-4">
                    <h2 className="text-900 font-semibold text-xl mb-4" style={{ color: '#926941' }}>1. Titularidad de Derechos</h2>
                    <p className="text-700 line-height-3 mb-4">
                        El Sistema de Gestión de Patrimonio Cultural y todo su contenido, incluyendo textos, imágenes, bases de datos, software y diseño,
                        son propiedad del Ministerio de Cultura de Cuba. Los derechos de autor sobre el patrimonio cultural digitalizado se rigen por la
                        legislación cubana de propiedad intelectual y patrimonio cultural.
                    </p>

                    <Divider />

                    <h2 className="text-900 font-semibold text-xl mb-4" style={{ color: '#926941' }}>2. Uso Autorizado</h2>
                    <p className="text-700 line-height-3 mb-4">
                        Se permite el uso de la información contenida en el sistema para fines educativos, de investigación y conservación del patrimonio.
                        Cualquier reproducción o distribución debe citar adecuadamente la fuente y obtener la autorización correspondiente del Ministerio
                        de Cultura de Cuba.
                    </p>

                    <Divider />

                    <h2 className="text-900 font-semibold text-xl mb-4" style={{ color: '#926941' }}>3. Restricciones</h2>
                    <p className="text-700 line-height-3 mb-4">
                        Queda prohibida la reproducción, distribución, modificación o uso comercial del contenido del sistema sin autorización expresa.
                        Las imágenes de objetos patrimoniales están sujetas a restricciones específicas según su categoría de protección y valor cultural.
                    </p>

                    <Divider />

                    <h2 className="text-900 font-semibold text-xl mb-4" style={{ color: '#926941' }}>4. Patrimonio Cultural Inmaterial</h2>
                    <p className="text-700 line-height-3 mb-4">
                        La documentación de expresiones culturales tradicionales, conocimientos ancestrales y otras formas de patrimonio inmaterial
                        respeta los derechos de las comunidades portadoras. Su uso y difusión se realiza con el consentimiento de dichas comunidades
                        y en conformidad con las políticas de salvaguardia del patrimonio inmaterial.
                    </p>

                    <Divider />

                    <h2 className="text-900 font-semibold text-xl mb-4" style={{ color: '#926941' }}>5. Solicitud de Permisos</h2>
                    <p className="text-700 line-height-3 mb-4">
                        Para solicitar autorización de uso de contenidos protegidos por derechos de autor, debe dirigirse a la Dirección de Patrimonio
                        Cultural del Ministerio de Cultura de Cuba, especificando el material requerido y la finalidad de uso. Cada solicitud será
                        evaluada individualmente según las políticas vigentes.
                    </p>

                  <BackToLanding />
                </Card>
            </div>
        </div>
    );
};

export default DerechosDeAutorPage;
