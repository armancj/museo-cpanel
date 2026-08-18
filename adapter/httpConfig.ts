// Extracted so the session module can build its own axios instance without
// importing httpAdapter, which would close an import cycle (httpAdapter needs
// the session module to refresh on 401).
export const baseConfig = {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
};
