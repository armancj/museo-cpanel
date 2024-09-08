import { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';

const corsMiddleware = async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    await NextCors(req, res, {
        origin: '*',
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });
    next();
};

export default corsMiddleware;
