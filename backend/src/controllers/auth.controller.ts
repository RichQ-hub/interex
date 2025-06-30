import { Request, Response } from 'express';
import db from '../db';
import { AccessError, InputError } from '../utils/error';
import logger from '../utils/logger';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * Registers a user into the database.
 */
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
    RETURNING id, username, email;
  `, [email, username, passwordHash]);

  const newUser = result.rows[0];

  logger.info(`New user (${username}) has been registered.`)

  // Return the new user information back to the client for use by next-auth.
  res.json({
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
  });
}

/**
 * Logs a user in and returns a JWT token.
 */
export const login = async (req: Request, res: Response) => {
  const {
    email,
    password
  } = req.body;

  // Check if the user is registered.
  const existingUser = await db.query(`
    SELECT id, email, password, username
    FROM Users
    WHERE email = $1;
  `, [email]);

  if (!existingUser.rowCount) {
    throw new AccessError('User details do not match a registered user.');
  }

  const user = existingUser.rows[0];

  // Hash the incoming password and compare it with the hashed password in the database.
  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new InputError('Password is incorrect.');
  }

  const tokenPayload = {
    userId: user.id,
    email: user.email
  }

  const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET as string);

  // Return the user information back to the client for use by next-auth.
  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    accessToken,
  });
}

/**
 * (TEST) Returns true of the user is has a valid token.
 */
export const verifyToken = (req: Request, res: Response) => {
  res.json(true);
}

/**
 * Grabs all registered users.
 */
export const getAllUsers = async (req: Request, res: Response) => {
  const result = await db.query(`
    SELECT *
    FROM Users;
  `);

  res.json({
    users: result.rows,
  });
}

/**
 * Delete a user.
 */
export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.user || '';

  const result = await db.query(`
    DELETE FROM Users
    WHERE id = $1
    RETURNING *;
  `, [userId]);
  
  const deletedUser = result.rows[0];
  res.json({
    user: deletedUser,
  })
}