import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: any; // We'll refine this type later
        }
    }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Null token' });
    }

    try {
        // Verify the JWT signature using the shared secret
        const secret = process.env.NEXTAUTH_SECRET;

        if (!secret) {
            console.error('NEXTAUTH_SECRET is not set');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        // Verify and decode the token
        const decoded = jwt.verify(token, secret) as { email?: string };

        if (!decoded.email) {
            throw new Error('Token missing email claim');
        }

        // Check if user exists
        let user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.status(403).json({ error: 'User not found in system' });
        }

        req.user = user;
        next();
    } catch (err: any) {
        console.error('Auth error:', err.message);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(403).json({ error: 'Invalid token signature' });
        }
        return res.status(403).json({ error: 'Invalid token' });
    }
};
