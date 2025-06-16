'use client';

import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthResponse } from '@/app/(full-page)/auth/login/interface/AuthResponse';
import { ProgressSpinner } from 'primereact/progressspinner';

interface JwtPayload {
    roles: string;
    uuid: string;
    email: string;
    name: string;
    lastName: string;
    iat: number;
    exp: number;
}

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>): React.FC<P> => {
    const ComponentWithAuth: React.FC<P> = (props: P) => {
        const router = useRouter();
        const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
        const [isLoading, setIsLoading] = useState(true);

        const checkAuth = useCallback(() => {
            try {
                const authUser = localStorage.getItem('authUser');

                if (!authUser) {
                    setIsAuthenticated(false);
                    setIsLoading(false);
                    router.replace('/auth/login');
                    return;
                }

                const parsedAuthUser: AuthResponse = JSON.parse(authUser);

                if (!parsedAuthUser.access_token) {
                    setIsAuthenticated(false);
                    setIsLoading(false);
                    localStorage.removeItem('authUser');
                    router.replace('/auth/login');
                    return;
                }

                const decodedToken: JwtPayload = jwtDecode<JwtPayload>(parsedAuthUser.access_token);

                if (decodedToken.exp < Date.now() / 1000) {
                    setIsAuthenticated(false);
                    setIsLoading(false);
                    localStorage.removeItem('authUser');
                    router.replace('/auth/login');
                    return;
                }

                setIsAuthenticated(true);
                setIsLoading(false);
            } catch (error) {
                console.error('Error al verificar autenticación:', error);
                setIsAuthenticated(false);
                setIsLoading(false);
                localStorage.removeItem('authUser');
                router.replace('/auth/login');
            }
        }, [router]);

        useEffect(() => {
            if (typeof window !== 'undefined') {
                checkAuth();
            }
        }, [checkAuth]);

        // Loading con PrimeReact
        if (isLoading || isAuthenticated === null) {
            return (
                <div className="flex justify-content-center align-items-center"
                     style={{ height: '100vh' }}>
                    <div className="text-center">
                        <ProgressSpinner
                            style={{ width: '50px', height: '50px' }}
                            strokeWidth="8"
                            fill="transparent"
                            animationDuration=".5s"
                        />
                        <p className="mt-3 text-600">Verificando autenticación...</p>
                    </div>
                </div>
            );
        }

        if (isAuthenticated) {
            return React.createElement(WrappedComponent, props);
        }

        return null;
    };

    ComponentWithAuth.displayName = `withAuth(${WrappedComponent.displayName || 'Component'})`;

    return ComponentWithAuth;
};

export default withAuth;
