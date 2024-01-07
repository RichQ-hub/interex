import { Request, Response } from 'express';
import db from '../db';
import { AccessError, InputError } from '../utils/error';
import { assertCommentOwner, assertCommunityMember, assertCommunityModerator } from '../utils/assert';

interface Comment {
  id: string;
  author: string;
  content: string;
  replies: Comment[];
}

/**
 * Fetches all comments and replies recursively in a nested list structure.
 * 
 * NOTE: This is experimental.
 * 
 * Example:
 * comments = [
 *  {
 *    commentId: 1
 *    text: 'nice'
 *    replies: [
 *      {
 *        commentId: 2,
 *        text: 'This is a reply',
 *        replies: []
 *      }
 *    ]
 *  }
 * ]
 */
export const getComments = async (req: Request, res: Response) => {
  /**
   * Recursive function to query replies. Takes a sort of LNR traversal in
   * a tree-like data structure.
   * 
   * HOW IT WORKS:
   * We essentially traverse downwards until we reach a leaf node (one without
   * any further replies). We then recurse back up, in which the curr node receives
   * completed reply lists of all its children/replies.
   * 
   * Essentially, the base case is a leaf node where we return an empty reply list.
   * 
   * HOW TO PICTURE IT:
   * Take a very simple structure with 2 comments, with one that replies to the other.
   */
  const getReplies = async (commentId: string) => {
    // We use left outer join since some comments may not have authors.
    const results = await db.query(`
      SELECT  c2.id, c2.content, u.username
      FROM    Comments c1
              JOIN Comments c2 ON c2.reply_to = c1.id
              LEFT OUTER JOIN Users u ON c2.author = u.id
      WHERE c1.id = $1;
    `, [commentId]);

    const replies: Comment[] = [];

    await Promise.all(results.rows.map(async (reply) => {
      // Recursively query the replies of the current reply.
      const replyReplies = await getReplies(reply.id);

      // Take each reply tuple from the query and push a comment object to the replies list.
      replies.push({
        id: reply.id,
        author: reply.username,
        content: reply.content,
        replies: replyReplies,
      });
    }));

    return replies;
  }

  const { threadId } = req.params;

  const comments: Comment[] = [];

  // Get all top level comments (no parent replies).
  const commentResults = await db.query(`
    SELECT  c.id, c.content, u.username
    FROM    Comments c
            LEFT OUTER JOIN Users u ON c.author = u.id
    WHERE   c.thread_id = $1 AND c.reply_to IS NULL;
  `, [threadId]);

  // Get each top-level comment and their replies.
  await Promise.all(commentResults.rows.map((comment) => {
    return getReplies(comment.id)
      .then((repliesList) => {
        comments.push({
          id: comment.id,
          author: comment.username,
          content: comment.content,
          replies: repliesList
        });
        return;
      })
  }));

  res.json({
    comments,
  })
}

export const createComment = async (req: Request, res: Response) => {
  const { threadId } = req.params;
  const userId = req.user || '';

  const {
    content
  } = req.body;

  // Grab the community that this thread belongs to.
  const communityResult = await db.query(`
    SELECT
      community_id
    FROM
      Threads
    WHERE
      id = $1;
  `, [threadId]);

  const communityId = communityResult.rows[0].community_id;

  // Assert if the user is a member of this community.
  await assertCommunityMember(communityId, userId);

  const result = await db.query(`
    INSERT INTO Comments (thread_id, author, content)
    VALUES ($1, $2, $3)
    RETURNING *;
  `, [threadId, userId, content]);

  const newComment = result.rows[0];

  res.json({
    comment: newComment,
  })
}

export const updateComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const userId = req.user || '';

  const { content } = req.body;

  await assertCommentOwner(commentId, userId);

  const result = await db.query(`
    UPDATE Comments
    SET content = $1
    WHERE id = $2
    RETURNING *;
  `, [content, commentId]);

  const updatedComment = result.rows[0];

  res.json({
    comment: updatedComment,
  })
}

export const deleteComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const userId = req.user || '';

  try {
    await assertCommentOwner(commentId, userId);
  } catch (error) {
    // Grab the communityId of the thread.
    const result = await db.query(`
      SELECT
        ct.id as community_id
      FROM
        Comments c
        JOIN Threads t ON t.id = c.thread_id
        JOIN Communities ct ON ct.id = t.community_id
      WHERE
        c.id = $1;
    `, [commentId]);

    if (!result.rowCount) {
      throw new InputError('Community where this thread belongs does not exist.');
    }

    const communityId = result.rows[0].community_id;

    // If the user is not the thread owner, we check if they are admins or moderators in the community.
    await assertCommunityModerator(communityId, userId);
  }

  const result = await db.query(`
    DELETE FROM Comments
    WHERE id = $1
    RETURNING *;
  `, [commentId]);

  const deletedComment = result.rows[0];

  res.json({
    comment: deletedComment,
  }) 
}

export const voteComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;

  const {
    userId,
    voteType,
  }: {
    userId: string;
    voteType: 'Upvote' | 'Downvote';
  } = req.body;

  // Check for whether the current user has already voted on this comment.
  const existingVote = await db.query(`
    SELECT type
    FROM Comment_Votes
    WHERE comment_id = $1 AND user_id = $2;
  `, [commentId, userId]);

  if (existingVote.rowCount) {
    const existingVoteType = existingVote.rows[0];

    // Case where if we upvote the same thread twice, we delete that vote.
    if (existingVoteType === voteType) {
      await db.query(`
        DELETE FROM Comment_Votes
        WHERE comment_id = $1 AND user_id = $2;
      `, [commentId, userId]);
    }

    // Case when there is an existing vote, but the vote type we passed is not the same,
    // so we just return vote the opposite vote.
    await db.query(`
      UPDATE  Comment_Votes
      SET     type = $1
      WHERE   comment_id = $2 AND user_id = $3;
    `, [voteType, commentId, userId]);
  }

  // If there was no existing vote, we create a new one.
  await db.query(`
    INSERT INTO Comment_Votes (user_id, comment_id, type)
    VALUES ($1, $2, $3);
  `, [userId, commentId, voteType]);

  // IMPORVEMENT:
  // Could cache popular posts in redis.
}

/**
 * Replies to the given commentId in req.params.
 */
export const replyComment = async (req: Request, res: Response) => {
  const { threadId, commentId } = req.params;
  const userId = req.user || '';
  const {
    content
  } = req.body;

  // Grab the community that this thread belongs to.
  const communityResult = await db.query(`
    SELECT
      community_id
    FROM
      Threads
    WHERE
      id = $1;
  `, [threadId]);

  const communityId = communityResult.rows[0].community_id;

  // Assert if the user is a member of this community.
  await assertCommunityMember(communityId, userId);

  const result = await db.query(`
    INSERT INTO Comments (thread_id, author, content, reply_to)
    VALUES ($1, $2, $3, $4)
    returning *;
  `, [threadId, userId, content, commentId]);

  const newComment = result.rows[0];

  res.json({
    comment: newComment,
  })
}
