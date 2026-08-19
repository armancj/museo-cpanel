'use client';

import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { clearSession, isTokenExpired, readSession, refreshSession } from '@/lib/session';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>): React.FC<P> => {
    const ComponentWithAuth: React.FC<P> = (props: P) => {
        const router = useRouter();
        const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
        const [isLoading, setIsLoading] = useState(true);

        const resolveAuth = useCallback(async (): Promise<boolean> => {
            const session = readSession();

            if (!session?.access_token) return false;

            // An expired access token is not the end of the session: the
            // refresh token outlives it by weeks, so renew it here rather than
            // bouncing the user back to the login form.
            if (isTokenExpired(session.access_token)) {
                return !!(await refreshSession());
            }

            return true;
        }, []);

        useEffect(() => {
            if (typeof window === 'undefined') return;

            let active = true;

            void resolveAuth().then((authenticated) => {
                if (!active) return;

                if (!authenticated) {
                    clearSession();
                    router.replace('/auth/login');
                }

                setIsAuthenticated(authenticated);
                setIsLoading(false);
            });

            return () => {
                active = false;
            };
        }, [resolveAuth, router]);

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
