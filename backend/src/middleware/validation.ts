import { ZodSchema } from 'zod';
import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';

/**
 * Middleware wrapper function that verifies the req body or query properties matching
 * the given zod schema.
 */
const validation = (schema: ZodSchema, property: 'body' | 'query') => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Safeparse ensures an error is not thrown, instead returning a simple object
    // with an error property.
    const result = schema.safeParse(req[property]);
    if (!result.success) {
      logger.info(
        `Invalid request was made - Error: ${result.error.issues[0].message} - Data: ${JSON.stringify(req[property])}`,
      );
      res.status(400).json({
        message: `Invalid request was made - Error: ${result.error.issues[0].message}`,
        data: req.body,
      });
      return;
    }
    next();
  }
}

export default validation;
