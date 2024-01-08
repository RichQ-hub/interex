import { NextFunction, Request, Response } from 'express';
import { AccessError } from '../utils/error';
import logger from '../utils/logger';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  email: string;
  iat: number;
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

    // Verifies the token has not been modified by comparing signatures using the jwt secret in
    // our env file.
    jwt.verify(token, process.env.JWT_SECRET as string, (err, payload) => {
      if (err) {
        throw new AccessError('Token is invalid.');
      }
    });

    // We pass the above verification, so we can extract the payload.
    const payload = jwt.decode(token) as TokenPayload;

    // Add the user email into the request object to be passed onto the next function.
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

/**
 * NOTES: Purpose of JWT Tokens.
 * When a user is logged in (authenticated), their client receives a jwt token.
 * The user can then send requests which carry that same jwt token to access
 * routes that they are authorised to access (e.g. when a certain API route should 
 * only be available to admin users). 
 * 
 * Signatures:
 * While the payload and header can easily be decoded, the signature part ensures
 * that the jwt token has not been modified from the moment it was created in the
 * server. This is because the token was generated using the payload + header +
 * secret key. The secret key should be hidden in the server database so that 
 * outsiders cannot use the key to generate their own JWT token.
 * 
 * Security Con:
 * JWT can still be stolen by parties that can intercept http requests between
 * the client and the user, and can thus use that token without knowing the secret
 * key to make api requests to the user posing as the intended user. However, they
 * still wouldn't be able to modify the token since they don't know the secret key.
 * 
 *      Soln:
 *      The way to solve this is to make tokens have an expiration date (e.g. after
 *      5 minutes). This is useful because if your token has been compromised, it 
 *      will expire quickly after and that will limit the time window during which the 
 *      attacker is able to use your token and perform operations on your behalf. 
 * 
 * How the server verifies that the token is not tampered:
 * The server extracts the token from incoming requests, and reproduces the signature
 * by taking the payload and header from the token and generating a new signature using
 * the secret key stored. This newly generated signature is then COMPARED with the 
 * signature in the incoming token. If the are the same, then the token has not been
 * tampered with.
 * 
 * Final note:
 * Therefore jwt is more of an encoding method rather than encrypting (keeping secret).
 * It is not a way to send sensitive information, rather it is to ensure that the 
 * token has not been modified.
 * 
 * Rescources:
 * - https://arielweinberger.medium.com/json-web-token-jwt-the-only-explanation-youll-ever-need-cf53f0822f50
 * - https://jwt.io/introduction
 * - https://supertokens.com/blog/what-is-jwt
 * - https://www.youtube.com/watch?v=7ozQLeFJpqs
 * - https://stackoverflow.com/questions/34259248/what-if-jwt-is-stolen (What if JWT was stolen?)
 */
