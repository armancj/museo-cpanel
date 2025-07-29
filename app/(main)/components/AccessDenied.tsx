'use client';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';

export const AccessDenied = () => {
    const router = useRouter();

    return (
        <div className="flex flex-column align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
            <div className="text-center">
                <i className="pi pi-lock text-primary" style={{ fontSize: '5rem' }}></i>
                <h1 className="mt-3">Acceso Denegado</h1>
                <p className="text-700 mb-5" style={{ maxWidth: '500px' }}>
                    No tienes permisos para acceder a esta página. Esta sección está reservada para administradores con privilegios especiales.
                </p>
                <Button
                    label="Volver al Inicio"
                    icon="pi pi-home"
                    className="p-button-primary"
                    onClick={() => router.push('/')}
                />
            </div>
        </div>
    );
};
