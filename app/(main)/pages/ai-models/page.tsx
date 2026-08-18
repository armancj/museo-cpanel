/* eslint-disable @next/next/no-img-element */
'use client';
import { useEffect, useState } from 'react';
import { ModelList } from './component/ModelList';
import withAuth from '@/lib/withAuth';
import { WebEnvConst } from '@/app/webEnvConst';
import { AccessDenied } from '@/app/(main)/components/AccessDenied';

const AIModels = () => {
    const [userRole, setUserRole] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get user role from localStorage
        try {
            const authUser = localStorage.getItem('authUser');
            if (authUser) {
                const parsedAuthUser = JSON.parse(authUser);
                if (parsedAuthUser.roles) {
                    setUserRole(parsedAuthUser.roles);
                }
            }
        } catch (error) {
            console.error('Error al obtener el rol del usuario:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Show loading state
    if (loading) {
        return (
            <div className="flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
            </div>
        );
    }

    // Check if user is superadmin
    if (userRole !== WebEnvConst.roles.superAdmin) {
        return <AccessDenied />;
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Configuración de Modelos de IA</h5>
                    <p className="mb-4">Gestiona los modelos de inteligencia artificial disponibles para el chat.</p>
                    <ModelList />
                </div>
            </div>
        </div>
    );
};

export default withAuth(AIModels);
