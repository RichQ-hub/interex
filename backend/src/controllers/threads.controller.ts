import { Request, Response } from 'express';
import db from '../db';
import { AccessError } from '../utils/error';

const assertThreadOwner = async (userId: string, threadId: string) => {
  const results = await db.query(`
    SELECT  t.id
    FROM    Threads t
            JOIN Users u ON u.id = t.author
    WHERE   u.id = $1 AND t.id = $2;
  `, [userId, threadId]);

  if (!results.rowCount) {
    throw new AccessError('User is not the owner of this thread.');
  }
}

export const getThreads = async (req: Request, res: Response) => {
  const { communityId } = req.params;

  const result = await db.query(`
    SELECT  t.id, u.username as author, t.title, t.content, t.created_at
    FROM    Threads t
            JOIN Users u ON u.id = t.author
    WHERE   t.community_id = $1;
  `, [communityId]);

  res.json({
    threads: result.rows,
  })
}

export const createThread = async (req: Request, res: Response) => {
  const { communityId } = req.params;

  const {
    authorId,
    title,
    content
  } = req.body;

  console.log(communityId, authorId, title, content)

  const results = await db.query(`
    INSERT INTO Threads (community_id, author, title, content)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `, [communityId, authorId, title, content]);

  const thread = results.rows[0];

  res.json({
    thread,
  });
}

export const updateThread = async (req: Request, res: Response) => {
  const { threadId } = req.params;

  const {
    userId,
    title,
    content,
  } = req.body;

  await assertThreadOwner(userId, threadId);

  const results = await db.query(`
    UPDATE Threads
    SET title = $1,
        content = $2
    WHERE id = $3
    RETURNING *;
  `, [title, content, threadId]);

  const thread = results.rows[0];

  res.json({
    thread,
  })
}

export const deleteThread = async (req: Request, res: Response) => {

}

export const upvoteThread = async (req: Request, res: Response) => {

}

export const downvoteThread = async (req: Request, res: Response) => {

}

export const pinThread = async (req: Request, res: Response) => {

}

export const unpinThread = async (req: Request, res: Response) => {

}
