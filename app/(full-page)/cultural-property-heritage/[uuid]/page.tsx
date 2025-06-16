'use client';
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CulturalHeritageProperty } from '@/app/(main)/pages/cultural-property-heritage/types';
import { CulturalPropertyService } from '@/app/service/CulturalPropertyService';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';
import { Fieldset } from 'primereact/fieldset';
import { Button } from 'primereact/button';
import { StyleClass } from 'primereact/styleclass';
import { Ripple } from 'primereact/ripple';
import { NodeRef } from '@/types';
import { classNames } from 'primereact/utils';
import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

export default function PublicCulturalHeritagePropertyPage() {
    const { uuid } = useParams();
    const [property, setProperty] = useState<CulturalHeritageProperty | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isHidden, setIsHidden] = useState(false);
    const menuRef = useRef<HTMLElement | null>(null);
    const router = useRouter();

    const toggleMenuItemClick = () => {
        setIsHidden((prevState) => !prevState);
    };

    const handleLoginClick = () => {
        router.push('/auth/login');
    };

    const handleCollectionClick = () => {
        router.push('/');
    };

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                setLoading(true);
                setError(null);

                if (typeof uuid !== 'string') {
                    throw new Error('UUID inválido');
                }

                const data = await CulturalPropertyService.getPublicCulturalProperty(uuid);
                setProperty(data);
            } catch (err) {
                console.error('Error fetching property:', err);
                setError('No se pudo cargar la información del bien patrimonial');
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [uuid]);

    // Common header component that will be shown regardless of loading/error state
    const renderHeader = () => (
        <div className="py-4 px-4 mx-0 md:mx-6 lg:mx-8 lg:px-8 flex align-items-center justify-content-between relative lg:static"
             style={{
                 background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #f5e9d9 0%, #e6d2b5 100%)',
                 borderBottom: '1px solid #e6d2b5'
             }}>
            <Link href="/landing" className="flex align-items-center">
                <img src="/demo/images/login/logoPatrimonio.jpg" alt="Logo Patrimonio" height="60"
                     className="mr-0 lg:mr-2" />
            </Link>
            <StyleClass nodeRef={menuRef as NodeRef} selector="@next" enterClassName="hidden"
                        leaveToClassName="hidden" hideOnOutsideClick>
                <i ref={menuRef} className="pi pi-bars text-4xl cursor-pointer block lg:hidden text-700"></i>
            </StyleClass>
            <div
                className={classNames('align-items-center surface-0 flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full left-0 px-6 lg:px-0 z-2', { hidden: isHidden })}
                style={{ top: '100%' }}>
                <ul className="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row cursor-pointer">
                    <li>
                        <Link href="/landing"
                           className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                            <span>Inicio</span>
                            <Ripple />
                        </Link>
                    </li>
                    <li>
                        <Link href="/"
                           className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                            <span>Colección</span>
                            <Ripple />
                        </Link>
                    </li>
                </ul>
                <div
                    className="flex justify-content-between lg:block border-top-1 lg:border-top-none surface-border py-3 lg:py-0 mt-3 lg:mt-0">
                    <Button label="Iniciar Sesión" text rounded className="border-none font-light line-height-2"
                            style={{ color: '#926941' }} onClick={handleLoginClick}></Button>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="surface-0 flex flex-column justify-content-center">
                <div id="home" className="landing-wrapper overflow-hidden">
                    {renderHeader()}
                    <div className="flex align-items-center justify-content-center" style={{ height: '70vh' }}>
                        <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: '#926941' }}></i>
                        <span className="ml-2" style={{ color: '#926941' }}>Cargando...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="surface-0 flex flex-column justify-content-center">
                <div id="home" className="landing-wrapper overflow-hidden">
                    {renderHeader()}
                    <div className="flex align-items-center justify-content-center" style={{ height: '70vh' }}>
                        <div className="text-center">
                            <i className="pi pi-exclamation-triangle" style={{ fontSize: '2rem', color: '#926941' }}></i>
                            <div className="mt-2" style={{ color: '#926941' }}>
                                {error || 'No se encontró el bien patrimonial'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string | Date | undefined) => {
        if (!dateString) return 'No disponible';
        const date = new Date(dateString);
        return isValid(date) ? format(date, 'dd/MM/yyyy', { locale: es }) : 'Fecha inválida';
    };

    return (
        <div className="surface-0 flex flex-column justify-content-center">
            <div id="home" className="landing-wrapper overflow-hidden">
                {renderHeader()}

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
                            <span className="font-light block">Bien Patrimonial</span>
                            {property.culturalRecord?.objectTitle?.value || 'Cultural'}
                        </h1>
                        <p className="font-normal text-2xl line-height-3 md:mt-3 text-gray-700">
                            {property.culturalRecord?.objectDescription?.value || 'No disponible'}
                        </p>
                        <Tag severity="info" value={property.entryAndLocation?.heritageType?.value} style={{ fontSize: '1rem', backgroundColor: '#926941', color: 'white' }} />
                    </div>
                </div>

                <div className="py-4 px-4 lg:px-8 mt-5 mx-0 lg:mx-8">
                    <div className="grid justify-content-center">
                        <div className="col-12 text-center mt-4 mb-4">
                            <h2 className="text-900 font-normal mb-2" style={{ color: '#926941' }}>Detalles del Bien Patrimonial</h2>
                            <span className="text-600 text-2xl">Información completa del objeto</span>
                        </div>

                        <div className="col-12">
                            <div className="grid">
                                <div className="col-12 md:col-6">
                                    <div
                                        style={{
                                            height: 'auto',
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
                                                <i className="pi pi-info-circle text-2xl" style={{ color: '#926941' }}></i>
                                            </div>
                                            <h5 className="mb-2 text-900" style={{ color: '#926941' }}>Información General</h5>
                                            <p>
                                                <strong>Estado de Conservación: </strong>
                                                {property.culturalRecord?.conservationState?.value?.map(
                                                    (state, index) => (
                                                        <Tag
                                                            key={index}
                                                            value={state}
                                                            severity={state === 'Bueno' ? 'success' : state === 'Malo' ? 'danger' : 'warning'}
                                                            style={{ marginRight: '0.5rem', fontSize: '0.85rem' }}
                                                        />
                                                    )
                                                ) || 'No disponible'}
                                            </p>
                                            <p>
                                                <strong>Clasificación Genérica: </strong>
                                                {property.entryAndLocation?.genericClassification?.value || 'No disponible'}
                                            </p>
                                            <p>
                                                <strong>Fecha de Entrada: </strong>
                                                {formatDate(property.entryAndLocation?.entryDate?.value)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 md:col-6 mt-4 md:mt-0">
                                    <div
                                        style={{
                                            height: 'auto',
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
                                                <i className="pi pi-ruler text-2xl" style={{ color: '#926941' }}></i>
                                            </div>
                                            <h5 className="mb-2 text-900" style={{ color: '#926941' }}>Detalles Físicos</h5>
                                            <ul className="list-none p-0 m-0">
                                                <li className="mb-2">
                                                    <strong>Altura:</strong> {property.culturalRecord?.dimensions?.value?.heightCms || '0'} cm
                                                </li>
                                                <li className="mb-2">
                                                    <strong>Ancho:</strong> {property.culturalRecord?.dimensions?.value?.widthCms || '0'} cm
                                                </li>
                                                <li className="mb-2">
                                                    <strong>Longitud:</strong> {property.culturalRecord?.dimensions?.value?.lengthCms || '0'} cm
                                                </li>
                                                <li className="mb-2">
                                                    <strong>Peso:</strong> {property.culturalRecord?.dimensions?.value?.weightKg || '0'} kg
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <div
                                    style={{
                                        height: 'auto',
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
                                            <i className="pi pi-map-marker text-2xl" style={{ color: '#926941' }}></i>
                                        </div>
                                        <h5 className="mb-2 text-900" style={{ color: '#926941' }}>Ubicación</h5>
                                        <ul className="list-none p-0 m-0">
                                            <li className="mb-2">
                                                <strong>Sala:</strong> {property.entryAndLocation?.objectLocation?.value?.exhibitionRoom || 'N/A'}
                                            </li>
                                            <li className="mb-2">
                                                <strong>Almacén:</strong> {property.entryAndLocation?.objectLocation?.value?.storage || 'N/A'}
                                            </li>
                                            <li className="mb-2">
                                                <strong>Piso:</strong> {property.entryAndLocation?.objectLocation?.value?.floor || 'N/A'}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <div
                                    style={{
                                        height: 'auto',
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
                                            <i className="pi pi-user text-2xl" style={{ color: '#926941' }}></i>
                                        </div>
                                        <h5 className="mb-2 text-900" style={{ color: '#926941' }}>Productor/Autor</h5>
                                        <p>
                                            <strong>Nombre:</strong> {property.producerAuthor?.producerAuthorNames?.value || 'No disponible'}
                                        </p>
                                        <p>
                                            <strong>Historia Institucional:</strong> {property.producerAuthor?.institutionalHistory?.value || 'No disponible'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <div
                                    style={{
                                        height: 'auto',
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
                                            <i className="pi pi-lock text-2xl" style={{ color: '#926941' }}></i>
                                        </div>
                                        <h5 className="mb-2 text-900" style={{ color: '#926941' }}>Condiciones de Acceso y Uso</h5>
                                        <p>
                                            <strong>Condiciones de Acceso:</strong> {property.accessAndUseConditions?.accessConditions?.value || 'No disponible'}
                                        </p>
                                        <p>
                                            <strong>Condiciones de Reproducción:</strong> {property.accessAndUseConditions?.reproductionConditions?.value || 'No disponible'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="py-4 px-4 mx-0 mt-8 lg:mx-8">
                    <div className="grid justify-content-between">
                        <div className="col-12 md:col-2" style={{ marginTop: '-1.5rem' }}>
                            <Link href="/landing"
                                  className="flex flex-wrap align-items-center justify-content-center md:justify-content-start md:mb-0 mb-3 cursor-pointer">
                                <img src="/demo/images/login/logoPatrimonio.jpg" alt="Logo Patrimonio" width="200"
                                     height="100" className="mr-2" />
                            </Link>
                        </div>
                        <div className="col-12 md:col-10 lg:col-7">
                            <div className="mt-4 pt-3 border-top-1 border-300 text-500 text-sm">
                                <p>ID: {property.uuid}</p>
                                <p>Última actualización: {formatDate(property.updatedAt)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
