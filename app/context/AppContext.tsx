'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
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

    const checkAuth = useCallback(() => {
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
    }, []);

    // Check authentication on an initial load
    useEffect(() => {
        if (typeof window !== 'undefined') {
            checkAuth();
        } else {
            setIsLoading(false);
        }
    }, [checkAuth]);

    // Re-check authentication when the user returns to the application
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                console.log('Visibility changed to visible, re-checking authentication');
                checkAuth();
            }
        };

        const handleFocus = () => {
            console.log('Window focused, re-checking authentication');
            checkAuth();
        };

        if (typeof window !== 'undefined') {
            // Add event listeners
            document.addEventListener('visibilitychange', handleVisibilityChange);
            window.addEventListener('focus', handleFocus);

            console.log('Added visibility and focus event listeners');

            // Clean up event listeners on unmount
            return () => {
                document.removeEventListener('visibilitychange', handleVisibilityChange);
                window.removeEventListener('focus', handleFocus);
                console.log('Removed visibility and focus event listeners');
            };
        }
    }, [checkAuth]);

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
