import { NextFunction, Request, Response } from 'express';
import { AccessError } from '../utils/error';
import logger from '../utils/logger';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  email: string;
}

/**
 * Verifies that the incoming request contains a valid token (not expired).
 * An authorised user is able to access a specific route.
 */
const authorize = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization');

    if (!token) {
      throw new AccessError('No token found. Authorization denied.');
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;

    req.user = payload.userId;

    next();
  } catch (err) {
    if (err instanceof AccessError) {
      logger.error(err.message);
      res.status(403).send({ error: `AccessError: ${err.message}` });
    }
  }
}

export default authorize;
