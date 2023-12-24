import { Request, Response } from 'express';
import db from '../db';
import { InputError } from '../utils/error';
import logger from '../utils/logger';
import bcrypt from 'bcrypt';

export const register = async (req: Request, res: Response) => {
  const {
    email,
    username,
    password
  } = req.body;

  const existingUser = await db.query(`
    SELECT *
    FROM Users
    WHERE email = $1;
  `, [email]);

  if (existingUser.rowCount) {
    throw new InputError(`User with the email ${email} already exists.`);
  }

  // The user does not exist, so we proceed to create a new user.

  // The salt pretty much determines how encrypted we want our password to be.
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);

  // Encrypt the password with the salt.
  const passwordHash = await bcrypt.hash(password, salt);

  // Enter the new user into the database, storing the encrypted password.
  const result = await db.query(`
    INSERT INTO Users (email, username, password)
    VALUES ($1, $2, $3)
    RETURNING *;
  `, [email, username, passwordHash]);

  const newUser = result.rows[0];

  logger.info(`New user (${username}) has been registered.`)

  // Return the new user information back to the client for use by next-auth.
  res.json({
    user: newUser,
  });
}

export const login = async (req: Request, res: Response) => {
  const {
    email,
    password
  } = req.body;

  // Check if the user is registered.
  const existingUser = await db.query(`
    SELECT id, email, password
    FROM Users
    WHERE email = $1;
  `, [email]);

  if (!existingUser.rowCount) {
    throw new Error('User details do not match a registered user.');
  }

  const user = existingUser.rows[0];

  // Hash the incoming password and compare it with the hashed password in the database.
  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new InputError('Password is incorrect.');
  }

  // Return the user information back to the client for use by next-auth.
  res.json({
    user: {
      id: user.id,
      email: user.email,
    }
  });
}

export const verifyToken = (req: Request, res: Response) => {
  res.json(true);
}