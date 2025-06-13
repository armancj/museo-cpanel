'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthResponse } from '@/app/(full-page)/auth/login/interface/AuthResponse';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
    roles: string;
    uuid: string;
    email: string;
    name: string;
    lastName: string;
    iat: number;
    exp: number;
}

interface AppContextType {
    user: JwtPayload | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (authResponse: AuthResponse) => void;
    logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [user, setUser] = useState<JwtPayload | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const login = (authResponse: AuthResponse) => {
        try {
            localStorage.setItem('authUser', JSON.stringify(authResponse));
            const decodedToken: JwtPayload = jwtDecode<JwtPayload>(authResponse.access_token);
            setUser(decodedToken);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Error al procesar login:', error);
            logout();
        }
    };

    const logout = () => {
        localStorage.removeItem('authUser');
        setUser(null);
        setIsAuthenticated(false);
    };

    useEffect(() => {
        const checkAuth = () => {
            try {
                const authUser = localStorage.getItem('authUser');

                if (!authUser) {
                    setIsLoading(false);
                    return;
                }

                const parsedAuthUser: AuthResponse = JSON.parse(authUser);
                const decodedToken: JwtPayload = jwtDecode<JwtPayload>(parsedAuthUser.access_token);

                if (decodedToken.exp < Date.now() / 1000) {
                    logout();
                } else {
                    setUser(decodedToken);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Error al verificar autenticación:', error);
                logout();
            } finally {
                setIsLoading(false);
            }
        };

        if (typeof window !== 'undefined') {
            checkAuth();
        } else {
            setIsLoading(false);
        }
    }, []);

    return (
        <AppContext.Provider value={{
            user,
            isAuthenticated,
            isLoading,
            login,
            logout
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext debe ser usado dentro de un AppProvider');
    }
    return context;
};
