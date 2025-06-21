import { Request, Response } from 'express';
import { AccessError, InputError } from './error';
import logger from './logger';

/**
 * This defines a wrapper function that hides the try...catch block and the code to forward
 * the error, reducing the amount of boilerplate in the controllers.
 * 
 * This function is essentially a higher-order function that takes another function fn as 
 * an argument and returns a new asynchronous function that wraps around fn. This new
 * function is intended to handle errors that might occur during the execution of fn.
 * 
 * @param fn The function that we are wrapping. 
 */
export const catchErrors = (fn: any) => async (req: Request, res: Response) => {
  try {
    // console.log(`Authorization header is ${req.header('Authorization')}`);
    if (req.method === 'GET') {
      logger.info(`Query params are ${JSON.stringify(req.params)}`)
    } else {
      logger.info(`Body params are ${JSON.stringify(req.body)}`);
    }
    await fn(req, res);
  } catch (err: any) {
    if (err instanceof InputError) {
      logger.error(err.message);
      res.status(400).send({ error: `InputError: ${err.message}` });
    } else if (err instanceof AccessError) {
      logger.error(err.message);
      res.status(403).send({ error: `AccessError: ${err.message}` });
    } else if (err instanceof Error) {
      logger.error(err.message);
      res.status(500).send({ error: err.message });
    }
  }
};
