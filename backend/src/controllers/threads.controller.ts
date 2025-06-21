import { Request, Response } from 'express';
import db from '../db';
import format from 'pg-format';
import { AccessError, InputError } from '../utils/error';
import {
  assertCommunityMember,
  assertCommunityModerator,
  assertThreadOwner,
  assertValidCommunity,
  assertValidFlair
} from '../utils/assert';

// ===========================================================================
// HELPERS
// ===========================================================================

/**
 * Gets all the flairs applied to a thread.
 */
const getThreadFlairs = async (threadId: string) => {
  const result = await db.query(`
    SELECT  f.id, f.name, f.hex_color
    FROM    Threads t
            JOIN Thread_Flairs tf ON tf.thread_id = t.id
            JOIN Flairs f ON f.id = tf.flair_id
    WHERE   t.id = $1;
  `, [threadId]);

  // Map each query result object to just a string.
  return result.rows.map((flair) => {
    return {
      id: flair.id,
      name: flair.name,
      hexColor: flair.hex_color,
    }
  });
}

// ===========================================================================
// CONTROLLERS
// ===========================================================================

/**
 * Grabs all the threads posted in a specific community.
 */
export const getAllThreads = async (req: Request, res: Response) => {
  const { communityId } = req.params;

  await assertValidCommunity(communityId);

  const result = await db.query(`
    SELECT
      t.id,
      u.username as author,
      t.title,
      t.created_at,
      t.pinned_by,
      coalesce((SELECT count(c.id) FROM Comments c WHERE c.thread_id = t.id), 0) as num_comments,
      coalesce((SELECT count(v.user_id) FROM Thread_Votes v WHERE v.thread_id = t.id AND v.type = 'Upvote'), 0) as num_upvotes
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
      pinnedBy: thread.pinned_by,
      numComments: thread.num_comments,
      numUpvotes: thread.num_upvotes,
      flairs,
    }
  }));

  res.json({
    threads,
  })
}

/**
 * Gets all the details of a specific thread.
 */
export const getThreadDetails = async (req: Request, res: Response) => {
  const { threadId } = req.params;

  const result = await db.query(`
    SELECT
      t.id,
      u.username,
      m.role,
      t.pinned_by,
      t.title,
      t.content,
      t.created_at,
      coalesce((SELECT count(v.user_id) FROM Thread_Votes v WHERE v.thread_id = t.id AND v.type = 'Upvote'), 0) as num_upvotes
    FROM
      Threads t
      JOIN Users u ON u.id = t.author
      JOIN Communities c ON c.id = t.community_id
      JOIN Community_Members m ON m.member_id = t.author AND m.community_id = c.id
    WHERE
      t.id = $1;
  `, [threadId]);

  const thread = result.rows[0];

  res.json({
    id: thread.id,
    author: thread.username,
    role: thread.role,
    pinnedBy: thread.pinned_by,
    title: thread.title,
    content: thread.content,
    createdAt: thread.created_at,
    numUpvotes: thread.num_upvotes,
  });
}

/**
 * Creates a new thread within a community, using the userId for an authorised user.
 */
export const createThread = async (req: Request, res: Response) => {
  const userId = req.user || '';
  const { communityId } = req.params;

  const {
    title,
    content,
    flairs
  } = req.body;

  await assertCommunityMember(communityId, userId);

  const result = await db.query(`
    INSERT INTO Threads (community_id, author, title, content)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `, [communityId, userId, title, content]);

  const newThread = result.rows[0];

  // Add the flairs.
  const flairTuples = flairs.map((flairId: string) => {
    return [newThread.id, flairId];
  })

  await db.query(format(`
    INSERT INTO Thread_Flairs (thread_id, flair_id)
    VALUES %L;
  `, flairTuples));

  res.json({
    newThread,
  });
}

/**
 * Updates a specified thread only if the user is authorised. Only the thread owner that update the thread.
 */
export const updateThread = async (req: Request, res: Response) => {
  const userId = req.user || '';
  const { threadId } = req.params;

  const {
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

/**
 * Deletes a thread. Only the owners or moderators can delete a thread.
 */
export const deleteThread = async (req: Request, res: Response) => {
  const userId = req.user || '';
  const { threadId } = req.params;

  try {
    await assertThreadOwner(userId, threadId);
  } catch (error) {
    // Grab the communityId of the thread.
    const result = await db.query(`
      SELECT community_id
      FROM Threads
      WHERE id = $1;
    `, [threadId]);

    if (!result.rowCount) {
      throw new InputError('Community where this thread belongs does not exist.');
    }

    const communityId = result.rows[0].community_id;

    // If the user is not the thread owner, we check if they are admins or moderators in the community.
    await assertCommunityModerator(communityId, userId);
  }

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

/**
 * Upvotes/Downvotes on a specific thread.
 */
export const voteThread = async (req: Request, res: Response) => {
  const userId = req.user || '';
  const { threadId } = req.params;

  const {
    voteType,
  }: {
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

/**
 * Pin a specific thread.
 */
export const pinThread = async (req: Request, res: Response) => {
  const userId = req.user || '';
  const { threadId } = req.params;

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

/**
 * Unpin a specific thread.
 */
export const unpinThread = async (req: Request, res: Response) => {
  const userId = req.user || '';
  const { threadId, communityId } = req.params;

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

/**
 * Adds a flair to a specific thread.
 */
export const addFlair = async (req: Request, res: Response) => {
  const userId = req.user || '';
  const { communityId, threadId, flairId } = req.params;

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
