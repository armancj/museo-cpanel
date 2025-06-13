import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { AuthResponse } from '@/app/(full-page)/auth/login/interface/AuthResponse';

const httpAdapter = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

let isRedirecting = false;


httpAdapter.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (typeof window !== 'undefined') {
            try {
                const authUser = localStorage.getItem('authUser');
                if (authUser) {
                    const parsedAuthUser: AuthResponse = JSON.parse(authUser);
                    const token = parsedAuthUser.access_token;
                    if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                }
            } catch (error) {
                console.error('Error al parsear token desde localStorage:', error);
                localStorage.removeItem('authUser');
            }
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Interceptor de response
httpAdapter.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        if (error.response?.status === 401 && !isRedirecting) {
            isRedirecting = true;

            if (typeof window !== 'undefined') {
                localStorage.removeItem('authUser');

                if (!window.location.pathname.includes('/auth/login')) {
                    window.location.href = '/auth/login';
                }
            }

            setTimeout(() => {
                isRedirecting = false;
            }, 1000);
        }

        if (error.response?.status && error.response.status >= 500) {
            console.error('Error del servidor:', error.response?.data);
        }

        if (!error.response) {
            console.error('Error de red:', error.message);
        }

        return Promise.reject(error);
    }
);

export const get = async <T>(url: string, config?: InternalAxiosRequestConfig): Promise<T> => {
    try {
        const response = await httpAdapter.get<T>(url, config);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const post = async <T>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T> => {
    try {
        const response = await httpAdapter.post<T>(url, data, config);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const put = async <T>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T> => {
    try {
        const response = await httpAdapter.put<T>(url, data, config);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const patch = async <T>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T> => {
    try {
        const response = await httpAdapter.patch<T>(url, data, config);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const del = async <T>(url: string, config?: InternalAxiosRequestConfig): Promise<T> => {
    try {
        const response = await httpAdapter.delete<T>(url, config);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

const handleApiError = (error: any): Error => {
    if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            'Error en la solicitud';

        return new Error(message);
    }

    return error instanceof Error ? error : new Error('Error desconocido');
};

export const postWithoutAuth = async <T>(url: string, data?: any): Promise<T> => {
    try {
        const response = await axios.post<T>(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, data, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export default httpAdapter;
