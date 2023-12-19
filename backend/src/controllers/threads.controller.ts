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

  const newThread = results.rows[0];

  res.json({
    newThread,
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

  const updatedThread = results.rows[0];

  res.json({
    updatedThread,
  })
}

export const deleteThread = async (req: Request, res: Response) => {
  const { threadId } = req.params;

  const { userId } = req.body;

  await assertThreadOwner(userId, threadId);

  const results = await db.query(`
    DELETE FROM Threads
    where id = $1
    RETURNING *;
  `, [threadId]);

  const deletedThread = results.rows[0];

  res.json({
    deletedThread,
  })
}

export const voteThread = async (req: Request, res: Response) => {
  const { threadId } = req.params;

  const {
    userId,
    voteType,
  }: {
    userId: string,
    voteType: 'Upvote' | 'Downvote',
  } = req.body;

  // Check for whether the current user has already voted on this thread.
  const existingVote = await db.query(`
    SELECT type
    FROM Thread_Votes
    WHERE thread_id = $1 AND user_id = $2;
  `, [threadId, userId]);

  if (existingVote.rowCount) {
    const existingVoteType = existingVote.rows[0];

    // Case where if we upvote the same thread twice, we delete that vote.
    if (existingVoteType === voteType) {
      await db.query(`
        DELETE FROM Thread_Votes
        WHERE thread_id = $1 AND user_id = $2;
      `, [threadId, userId]);
    }

    // Case when there is an existing vote, but the vote type we passed is not the same,
    // so we just return vote the opposite vote.
    await db.query(`
      UPDATE  Thread_Votes
      SET     type = $1
      WHERE   thread_id = $2 AND user_id = $3;
    `, [voteType, threadId, userId]);
  }

  // If there was no existing vote, we create a new one.
  await db.query(`
    INSERT INTO Thread_Votes (user_id, thread_id, type)
    VALUES ($1, $2, $3);
  `, [userId, threadId, voteType]);

  // IMPORVEMENT:
  // Could cache popular posts in redis.
}

export const pinThread = async (req: Request, res: Response) => {
  const { threadId } = req.params;

  const {
    userId
  } = req.body;

  try {
    // If our sql trigger fails, it means that the user doesn't have the authorisation
    // to pin this thread. Hence we raise an AccessError.
    const results = await db.query(`
      UPDATE  Threads
      SET     pinned_by = $1
      WHERE   id = $2
      RETURNING *;
    `, [userId, threadId]);

    const thread = results.rows[0];

    res.json({
      thread,
    })
  } catch (error) {
    if (error instanceof Error) {
      throw new AccessError(error.message);
    }
  }
}

export const unpinThread = async (req: Request, res: Response) => {
  const { threadId } = req.params;

  const {
    userId
  } = req.body;

  // Check if the user is a moderator or admin 
  const results = await db.query(`
    SELECT  t.id
    FROM    Threads t
            JOIN Communities c on c.id = t.community_id
            JOIN Community_Members m on m.member_id = c.id
    WHERE   t.id = $1 AND n.member_id = $2 AND (m.role IN ('Admin', 'Moderator'));
  `, [threadId, userId]);

  if (!results.rowCount) {
    throw new AccessError('User is not a moderator or admin to be able to unpin this thread.');
  }

  // We don't have to wrap in trycatch since setting pinned_by attr to null will not throw an
  // exception in our trigger.
  const threads = await db.query(`
    UPDATE  Threads
    SET     pinned_by = $1
    WHERE   id = $2
    RETURNING *;
  `, [null, threadId]);

  const unpinnedThread = threads.rows[0];

  res.json({
    unpinnedThread,
  })
}
