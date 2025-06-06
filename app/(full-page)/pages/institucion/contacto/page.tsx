'use client';
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

const ContactoPage = () => {
    const router = useRouter();
    const toast = useRef(null);

    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [asunto, setAsunto] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [departamento, setDepartamento] = useState(null);

    const handleBackClick = () => {
        router.push('/landing');
    };

    const departamentos = [
        { name: 'Dirección General', code: 'DG' },
        { name: 'Departamento de Catalogación', code: 'DC' },
        { name: 'Departamento de Conservación', code: 'CO' },
        { name: 'Soporte Técnico', code: 'ST' },
        { name: 'Departamento de Investigación', code: 'DI' },
        { name: 'Relaciones Institucionales', code: 'RI' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validación básica
        if (!nombre || !email || !asunto || !mensaje || !departamento) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Por favor complete todos los campos',
                life: 3000
            });
            return;
        }

        // Simulación de envío exitoso
        toast.current.show({
            severity: 'success',
            summary: 'Mensaje Enviado',
            detail: 'Su mensaje ha sido enviado correctamente. Nos pondremos en contacto con usted pronto.',
            life: 5000
        });

        // Limpiar formulario
        setNombre('');
        setEmail('');
        setAsunto('');
        setMensaje('');
        setDepartamento(null);
    };

    return (
        <div className="surface-0 flex justify-content-center">
            <Toast ref={toast} />
            <div className="landing-wrapper overflow-hidden">
                <LogoLanding />

                <div className="py-4 px-4 lg:px-8 mt-5 mx-0 lg:mx-8">
                    <div className="grid justify-content-center">
                        <div className="col-12 text-center mt-8 mb-4">
                            <h2 className="text-900 font-normal mb-2" style={{ color: '#926941' }}>Contacto</h2>
                            <span className="text-600 text-2xl">Estamos aquí para ayudarle</span>
                        </div>

                        <div className="col-12">
                            <div className="grid">
                                <div className="col-12 md:col-6 p-4">
                                    <div className="p-4 border-1 surface-border surface-card border-round h-full">
                                        <div className="flex flex-column align-items-start mb-4">
                                            <h3 className="text-2xl font-medium text-900 mb-2" style={{ color: '#926941' }}>Información de Contacto</h3>
                                            <span className="text-600 text-xl">Cómo encontrarnos</span>
                                        </div>

                                        <div className="flex align-items-center mb-4">
                                            <i className="pi pi-map-marker text-2xl mr-3" style={{ color: '#926941' }}></i>
                                            <div>
                                                <h4 className="text-xl font-medium text-900 m-0">Dirección</h4>
                                                <p className="text-700 line-height-3 m-0">
                                                    Calle Lonja del Comercio #2<br />
                                                    La Habana Vieja, La Habana<br />
                                                    Cuba, CP 10100
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex align-items-center mb-4">
                                            <i className="pi pi-phone text-2xl mr-3" style={{ color: '#926941' }}></i>
                                            <div>
                                                <h4 className="text-xl font-medium text-900 m-0">Teléfono</h4>
                                                <p className="text-700 line-height-3 m-0">
                                                    +53 7 861 3051<br />
                                                    +53 7 861 3052
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex align-items-center mb-4">
                                            <i className="pi pi-envelope text-2xl mr-3" style={{ color: '#926941' }}></i>
                                            <div>
                                                <h4 className="text-xl font-medium text-900 m-0">Correo Electrónico</h4>
                                                <p className="text-700 line-height-3 m-0">
                                                    contacto@patrimoniocultural.cu<br />
                                                    soporte@patrimoniocultural.cu
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex align-items-center">
                                            <i className="pi pi-clock text-2xl mr-3" style={{ color: '#926941' }}></i>
                                            <div>
                                                <h4 className="text-xl font-medium text-900 m-0">Horario de Atención</h4>
                                                <p className="text-700 line-height-3 m-0">
                                                    Lunes a Viernes: 9:00 AM - 5:00 PM<br />
                                                    Sábado: 9:00 AM - 12:00 PM<br />
                                                    Domingo: Cerrado
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 md:col-6 p-4">
                                    <div className="p-4 border-1 surface-border surface-card border-round h-full">
                                        <div className="flex flex-column align-items-start mb-4">
                                            <h3 className="text-2xl font-medium text-900 mb-2" style={{ color: '#926941' }}>Envíenos un Mensaje</h3>
                                            <span className="text-600 text-xl">Estamos interesados en sus comentarios</span>
                                        </div>

                                        <form onSubmit={handleSubmit} className="p-fluid">
                                            <div className="field mb-4">
                                                <label htmlFor="nombre" className="font-medium text-900 mb-2 block">Nombre Completo</label>
                                                <InputText id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ingrese su nombre completo" />
                                            </div>

                                            <div className="field mb-4">
                                                <label htmlFor="email" className="font-medium text-900 mb-2 block">Correo Electrónico</label>
                                                <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ingrese su correo electrónico" />
                                            </div>

                                            <div className="field mb-4">
                                                <label htmlFor="departamento" className="font-medium text-900 mb-2 block">Departamento</label>
                                                <Dropdown id="departamento" value={departamento} options={departamentos} onChange={(e) => setDepartamento(e.value)}
                                                    optionLabel="name" placeholder="Seleccione un departamento" />
                                            </div>

                                            <div className="field mb-4">
                                                <label htmlFor="asunto" className="font-medium text-900 mb-2 block">Asunto</label>
                                                <InputText id="asunto" value={asunto} onChange={(e) => setAsunto(e.target.value)} placeholder="Ingrese el asunto de su mensaje" />
                                            </div>

                                            <div className="field mb-4">
                                                <label htmlFor="mensaje" className="font-medium text-900 mb-2 block">Mensaje</label>
                                                <InputTextarea id="mensaje" value={mensaje} onChange={(e) => setMensaje(e.target.value)} rows={5} placeholder="Escriba su mensaje aquí" />
                                            </div>

                                            <Button type="submit" label="Enviar Mensaje" className="p-button-rounded" style={{ backgroundColor: '#926941', border: 'none' }} />
                                        </form>
                                    </div>
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

export default ContactoPage;
