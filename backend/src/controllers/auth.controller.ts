import { Request, Response } from 'express';
import db from '../db';
import { InputError } from '../utils/error';
import logger from '../utils/logger';

export const register = async (req: Request, res: Response) => {
  const clerkId = req.user;

  const {
    email,
    username
  } = req.body;

  const existingUser = await db.query(`
    SELECT *
    FROM Users
    WHERE clerk_id = $1;
  `, [clerkId]);

  if (!existingUser.rowCount) {
    throw new InputError(`User with the email ${email} already exists.`);
  }

  // Enter the new user into the database.
  const result = await db.query(`
    INSERT INTO Users (clerk_id, username, email)
    VALUES ($1, $2, $3);
  `, [clerkId, username, email]);

  const newUser = result.rows[0];

  logger.info(`New user (${username}) has been registered.`)

  res.json({
    user: newUser,
  });
}

export const verifyToken = (req: Request, res: Response) => {
  res.json(true);
}