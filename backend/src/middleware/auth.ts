import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const isBlacklisted = await prisma.blacklistedToken.findUnique({
      where: { token }
    });
    if (isBlacklisted) return res.status(401).json({ error: 'Token is invalid' });

    const secret = process.env.JWT_SECRET || 'supersecret';
    const decoded = jwt.verify(token, secret);
    (req as any).user = decoded;
    next();
  } catch (err) {
    console.error('requireAuth Error:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
};
