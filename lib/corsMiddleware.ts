import { NextApiRequest, NextApiResponse } from 'next';

const corsMiddleware = async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }

    next();
};

export default corsMiddleware;
