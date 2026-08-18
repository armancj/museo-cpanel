import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { baseConfig } from '@/adapter/httpConfig';
import { WebEnvConst } from '@/app/webEnvConst';
import { AuthResponse } from '@/app/(full-page)/auth/login/interface/AuthResponse';

const STORAGE_KEY = 'authUser';

// Bare instance on purpose: the refresh call must not travel through the
// interceptors that trigger it, or a rejected refresh would try to refresh
// itself.
const refreshClient = axios.create(baseConfig);

export const readSession = (): AuthResponse | null => {
    if (typeof window === 'undefined') return null;

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
        return JSON.parse(raw) as AuthResponse;
    } catch {
        // A corrupted entry is dropped so the next login rewrites it.
        localStorage.removeItem(STORAGE_KEY);
        return null;
    }
};

export const writeSession = (session: AuthResponse): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

export const clearSession = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
};

/**
 * True when the JWT is missing, unreadable or past its `exp`.
 * An unreadable token counts as expired: there is nothing useful to do with it.
 */
export const isTokenExpired = (token?: string): boolean => {
    if (!token) return true;

    try {
        const { exp } = jwtDecode<{ exp?: number }>(token);
        if (!exp) return true;
        return exp < Date.now() / 1000;
    } catch {
        return true;
    }
};

let inFlightRefresh: Promise<AuthResponse | null> | null = null;

const performRefresh = async (): Promise<AuthResponse | null> => {
    const session = readSession();

    // Nothing to trade in, and an expired refresh token is a real logout.
    if (!session?.refresh_token || isTokenExpired(session.refresh_token)) {
        return null;
    }

    try {
        const { data } = await refreshClient.post<AuthResponse>(WebEnvConst.auth.refresh, {
            refreshAuthToken: session.refresh_token
        });

        if (!data?.access_token) return null;

        writeSession(data);
        return data;
    } catch {
        return null;
    }
};

/**
 * Exchanges the stored refresh token for a fresh pair and persists it.
 * Resolves to null when the session cannot be renewed, which the callers treat
 * as a logout.
 *
 * The API rotates the refresh token on every call and only keeps the hash of
 * the last one it issued, so two concurrent refreshes would leave one caller
 * holding a token the server has already replaced. Every caller therefore waits
 * on the same in-flight request.
 */
export const refreshSession = (): Promise<AuthResponse | null> => {
    if (!inFlightRefresh) {
        inFlightRefresh = performRefresh().finally(() => {
            inFlightRefresh = null;
        });
    }

    return inFlightRefresh;
};
