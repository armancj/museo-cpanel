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


httpAdapter.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        console.log('🔥 === INTERCEPTOR ERROR ===');
        console.log('🔥 Status:', error.response?.status);
        console.log('🔥 URL:', error.config?.url);
        console.log('🔥 Method:', error.config?.method);
        console.log('🔥 isRedirecting:', isRedirecting);
        console.log('🔥 Current path:', window.location.pathname);

        if (error.response?.status === 401 && !isRedirecting) {
            console.log('🚨 === REDIRIGIENDO AL LOGIN ===');
            isRedirecting = true;

            if (typeof window !== 'undefined') {
                localStorage.removeItem('authUser');

                if (!window.location.pathname.includes('/auth/login')) {
                    console.log('🚨 Redirect to login...');
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

httpAdapter.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        console.log('📤 === REQUEST INTERCEPTOR ===');
        console.log('📤 URL:', config.url);
        console.log('📤 Method:', config.method);

        if (typeof window !== 'undefined') {
            try {
                const authUser = localStorage.getItem('authUser');
                console.log('📤 AuthUser existe:', !!authUser);

                if (authUser) {
                    const parsedAuthUser: AuthResponse = JSON.parse(authUser);
                    const token = parsedAuthUser.access_token;
                    console.log('📤 Token existe:', !!token);
                    console.log('📤 Token preview:', token ? `${token.substring(0, 20)}...` : 'null');

                    if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                }
            } catch (error) {
                console.error('❌ Error al parsear token desde localStorage:', error);
                localStorage.removeItem('authUser');
            }
        }
        return config;
    },
    (error: AxiosError) => {
        console.error('❌ Request interceptor error:', error);
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


export class ApiError extends Error {
    public status: number;
    public originalMessage: string;
    public userMessage: string;
    public severity: 'error' | 'warn' | 'info';

    constructor(status: number, originalMessage: string, userMessage: string, severity: 'error' | 'warn' | 'info' = 'error') {
        super(userMessage);
        this.name = 'ApiError';
        this.status = status;
        this.originalMessage = originalMessage;
        this.userMessage = userMessage;
        this.severity = severity;
    }
}

const getConflictMessage = (field: string, value: string): string => {
    const messages: Record<string, string> = {
        'email': `El correo electrónico "${value}" ya está registrado en el sistema. Por favor, utiliza una dirección diferente.`,
        'mobile': `El número de teléfono "${value}" ya está registrado. Por favor, verifica el número ingresado.`,
        'phone': `El número de teléfono "${value}" ya está registrado. Por favor, verifica el número ingresado.`,
        'name': `Ya existe un usuario con el nombre "${value}". Por favor, verifica la información.`,
        'lastName': `Ya existe un usuario con el apellido "${value}". Por favor, verifica la información.`,
    };

    return messages[field] || `El campo ${field} con valor "${value}" ya existe en el sistema.`;
};

const handleApiError = (error: any): ApiError => {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status || 500;
        const originalMessage = error.response?.data?.message || error.message || 'Error desconocido';

        console.log('=== API ERROR ===');
        console.log('Status:', status);
        console.log('Original message:', originalMessage);
        console.log('================');

        switch (status) {
            case 400:
                return new ApiError(status, originalMessage, 'Los datos enviados no son válidos. Por favor, revisa la información.');

            case 401:
                return new ApiError(status, originalMessage, 'No tienes permisos para realizar esta acción.');

            case 403:
                return new ApiError(status, originalMessage, 'Acceso denegado. No tienes los permisos necesarios.');

            case 404:
                return new ApiError(status, originalMessage, 'El recurso solicitado no se encuentra disponible.');

            case 409:
                // Manejo específico para conflictos de duplicación
                try {
                    let conflictData;

                    if (originalMessage.startsWith('Conflict: ')) {
                        const jsonPart = originalMessage.substring('Conflict: '.length);
                        console.log('JSON extraído:', jsonPart);
                        conflictData = JSON.parse(jsonPart);
                    } else if (originalMessage.includes('{') && originalMessage.includes('}')) {
                        const startIndex = originalMessage.indexOf('{');
                        const endIndex = originalMessage.lastIndexOf('}') + 1;
                        const jsonPart = originalMessage.substring(startIndex, endIndex);
                        conflictData = JSON.parse(jsonPart);
                    } else {
                        conflictData = JSON.parse(originalMessage);
                    }

                    const conflictFields = Object.keys(conflictData);

                    if (conflictFields.length === 1) {
                        const field = conflictFields[0];
                        const value = conflictData[field];
                        const userMessage = getConflictMessage(field, value);
                        return new ApiError(status, originalMessage, userMessage, 'warn');
                    } else {
                        return new ApiError(status, originalMessage,
                            'Ya existe un registro con los mismos datos. Por favor, verifica la información.',
                            'warn');
                    }

                } catch (parseError) {
                    console.error('Error al parsear conflicto:', parseError);
                    return new ApiError(status, originalMessage,
                        'Ya existe un registro con los mismos datos. Por favor, verifica la información.',
                        'warn');
                }

            case 422:
                return new ApiError(status, originalMessage, 'Los datos proporcionados no son válidos. Por favor, revisa la información.');

            case 500:
                return new ApiError(status, originalMessage, 'Ha ocurrido un error interno del servidor. Por favor, inténtalo nuevamente.');

            case 502:
            case 503:
            case 504:
                return new ApiError(status, originalMessage, 'El servidor no está disponible en este momento. Por favor, inténtalo más tarde.');

            default:
                return new ApiError(status, originalMessage, originalMessage || 'Ha ocurrido un error inesperado.');
        }
    }

    // Error que no es de Axios
    const message = error?.message || 'Error desconocido';
    return new ApiError(500, message, message);
};


export default httpAdapter;
