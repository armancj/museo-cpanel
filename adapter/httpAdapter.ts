import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { AuthResponse } from '@/app/(full-page)/auth/login/interface/AuthResponse';

const httpAdapter = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 10000, // Tiempo de espera de 10 segundos
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor de pedido
httpAdapter.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const authUser = localStorage.getItem('authUser');
        if (authUser) {
            const parsedAuthUser: AuthResponse = JSON.parse(authUser);
            const token = parsedAuthUser.access_token;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Interceptor de respuesta
httpAdapter.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        if (!axios.isAxiosError(error)) {
            console.error('Error en la solicitud:', error);
        }
        console.error('Error en la respuesta:', error.response?.data);
        return Promise.reject(error);
    }
);

export const get = async <T>(url: string, config?: InternalAxiosRequestConfig): Promise<T> => {
    const response = await httpAdapter.get<T>(url, config);
    return response.data;
};

export const post = async <T>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T> => {
    const response = await httpAdapter.post<T>(url, data, config);
    return response.data;
};

export const put = async <T>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T> => {
    const response = await httpAdapter.put<T>(url, data, config);
    return response.data;
};

export const patch = async <T>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T> => {
    const response = await httpAdapter.patch<T>(url, data, config);
    return response.data;
};

export const del = async <T>(url: string, config?: InternalAxiosRequestConfig): Promise<T> => {
    const response = await httpAdapter.delete<T>(url, config);
    return response.data;
};

export default httpAdapter;
