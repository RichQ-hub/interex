import { Request, Response } from 'express';
import db from '../db';
import { AccessError } from '../utils/error';
import { assertCommunityModerator, assertThreadOwner, assertValidFlair } from '../utils/assert';

// ===========================================================================
// HELPERS
// ===========================================================================

const getThreadFlairs = async (threadId: string) => {
  const result = await db.query(`
    SELECT  f.name, f.hex_color
    FROM    Threads t
            JOIN Thread_Flairs tf ON tf.thread_id = t.id
            JOIN Flairs f ON f.id = tf.flair_id
    WHERE   t.id = $1;
  `, [threadId]);

  // Map each query result object to just a string.
  return result.rows.map((flair) => {
    return {
      name: flair.name,
      hexColor: flair.hex_color,
    }
  });
}

// ===========================================================================
// CONTROLLERS
// ===========================================================================

export const getAllThreads = async (req: Request, res: Response) => {
  const { communityId } = req.params;

  const result = await db.query(`
    SELECT
      t.id,
      u.username as author,
      t.title,
      t.created_at,
      coalesce((SELECT count(c.id) FROM Comments c WHERE c.thread_id = t.id), 0) as num_comments,
      coalesce((SELECT count(v.user_id) FROM Thread_Votes v WHERE v.thread_id = t.id), 0) as num_upvotes
    FROM
      Threads t
      JOIN Users u ON u.id = t.author
    WHERE
      t.community_id = $1;
  `, [communityId]);

  // Grab each thread's flairs in parallel.
  const threads = await Promise.all(result.rows.map(async (thread) => {
    const flairs = await getThreadFlairs(thread.id);

    return {
      id: thread.id,
      title: thread.title,
      author: thread.author,
      createdAt: thread.created_at,
      numComments: thread.num_comments,
      numUpvotes: thread.num_upvotes,
      flairs,
    }
  }));

  res.json({
    threads,
  })
}

export const createThread = async (req: Request, res: Response) => {
  const { communityId } = req.params;

  const {
    authorId,
    title,
    content
  } = req.body;

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
  const { threadId, communityId } = req.params;

  const {
    userId
  } = req.body;

  // Check if the user is a moderator or admin 
  await assertCommunityModerator(communityId, userId);

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

export const addFlair = async (req: Request, res: Response) => {
  const { communityId, threadId, flairId } = req.params;

  const {
    userId
  } = req.body;

  await assertThreadOwner(userId, threadId);
  await assertValidFlair(communityId, flairId);

  const result = await db.query(`
    INSERT INTO Thread_Flairs (thread_id, flair_id)
    VALUES ($1, $2)
    RETURNING thread_id, flair_id;
  `, [threadId, flairId]);

  const addedFlair = result.rows[0];

  res.json({
    flair: addedFlair,
  });
}
