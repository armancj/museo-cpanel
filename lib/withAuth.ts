import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthResponse } from '@/app/(full-page)/auth/login/interface/AuthResponse';

// Definimos la interfaz del payload del JWT
interface JwtPayload {
    roles:    string;
    uuid:     string;
    email:    string;
    name:     string;
    lastName: string;
    iat:      number;
    exp:      number;
}

// HOC que protege rutas con autenticación
const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>): React.FC<P> => {
    const ComponentWithAuth: React.FC<P> = (props: P) => {
        const router = useRouter();

        const checkAuth = useCallback(() => {
            const authUser = localStorage.getItem('authUser');

            if (!authUser) {
                router.replace('/auth/login');
                return;
            }

            const parsedAuthUser: AuthResponse = JSON.parse(authUser);

            try {
                const decodedToken: JwtPayload = jwtDecode<JwtPayload>(parsedAuthUser.access_token);

                if (decodedToken.exp < Date.now() / 1000) {
                    localStorage.removeItem('authUser');
                    router.replace('/auth/login');
                }
            } catch (error) {
                localStorage.removeItem('authUser');
                router.replace('/auth/login');
            }
        }, [router]);

        useEffect(() => {
            checkAuth();
        }, [checkAuth]);

        return React.createElement(WrappedComponent, props);
    };

    ComponentWithAuth.displayName = `withAuth(${WrappedComponent.displayName || 'Component'})`;

    return ComponentWithAuth;
};

export default withAuth;
