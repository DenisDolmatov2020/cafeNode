import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const userMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): Response<any, Record<string, any>> | void => {
    console.log('req middle', req);
    if (req.method === 'OPTIONS') {
        next();
        return; // Explicitly return here to satisfy TypeScript
    }

    try {
        let tokenArray: string[] = [];

        if (req.headers.authorization != null) {
            tokenArray = req.headers.authorization.split(' ');
        }

        const token = tokenArray?.[1];

        if (!token) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const decodedData: any = jwt.verify(token, '123');
        req.body.user = decodedData.id;

        next();
    } catch (error) {
        console.log(error);
        return res.status(403).json({ message: 'Error authorization' });
    }
};

export default userMiddleware;
