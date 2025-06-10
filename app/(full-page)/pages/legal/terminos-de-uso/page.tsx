'use client';
import React from 'react';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { BackToLanding } from '@/app/common/component/BackToLanding';


const TerminosDeUsoPage = () => {
    return (
        <div className="surface-0 flex justify-content-center">
            <div className="text-900 font-bold text-6xl mb-4 text-center">Términos de Uso</div>
            <div className="text-700 text-xl mb-6 text-center line-height-3">Sistema de Gestión de Patrimonio Cultural
                de Cuba
            </div>

            <div className="card">
                <Card className="p-4">
                    <h2 className="text-900 font-semibold text-xl mb-4" style={{ color: '#926941' }}>1. Aceptación de
                        los Términos</h2>
                    <p className="text-700 line-height-3 mb-4">
                        Al acceder y utilizar el Sistema de Gestión de Patrimonio Cultural de Cuba, usted acepta cumplir
                        con estos términos y condiciones de uso.
                        Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al servicio.
                    </p>

                    <Divider />

                    <h2 className="text-900 font-semibold text-xl mb-4" style={{ color: '#926941' }}>2. Uso del
                        Sistema</h2>
                    <p className="text-700 line-height-3 mb-4">
                        El Sistema de Gestión de Patrimonio Cultural está destinado exclusivamente para el uso de
                        instituciones culturales autorizadas,
                        investigadores acreditados y personal del Ministerio de Cultura de Cuba. El acceso requiere
                        autenticación y está sujeto a los
                        permisos asignados por los administradores del sistema.
                    </p>

                    <Divider />

                    <h2 className="text-900 font-semibold text-xl mb-4" style={{ color: '#926941' }}>3. Propiedad
                        Intelectual</h2>
                    <p className="text-700 line-height-3 mb-4">
                        Todo el contenido del sistema, incluyendo textos, gráficos, logotipos, imágenes y software, es
                        propiedad del Ministerio de Cultura
                        de Cuba y está protegido por las leyes de propiedad intelectual. Los datos e información sobre
                        el patrimonio cultural están sujetos
                        a restricciones específicas de uso y reproducción.
                    </p>

                    <Divider />

                    <h2 className="text-900 font-semibold text-xl mb-4" style={{ color: '#926941' }}>4.
                        Responsabilidades del Usuario</h2>
                    <p className="text-700 line-height-3 mb-4">
                        Los usuarios son responsables de mantener la confidencialidad de sus credenciales de acceso y de
                        todas las actividades realizadas
                        bajo su cuenta. Cualquier uso no autorizado o sospecha de violación de seguridad debe ser
                        reportada inmediatamente a los administradores
                        del sistema.
                    </p>

                    <Divider />

                    <h2 className="text-900 font-semibold text-xl mb-4" style={{ color: '#926941' }}>5.
                        Modificaciones</h2>
                    <p className="text-700 line-height-3 mb-4">
                        El Ministerio de Cultura de Cuba se reserva el derecho de modificar estos términos de uso en
                        cualquier momento. Los cambios entrarán
                        en vigor inmediatamente después de su publicación en el sistema. El uso continuado del servicio
                        después de dichos cambios constituirá
                        su aceptación de los nuevos términos.
                    </p>

                    <BackToLanding />
                </Card>
            </div>
        </div>
    );
};

export default TerminosDeUsoPage;
