import { Request, Response } from 'express';
import db from '../db';
import { AccessError } from '../utils/error';

export const getComments = async (req: Request, res: Response) => {
  const { threadId } = req.params;

}

/**
 * Fetches first level replies of the given comment.
 */
export const getReplies = async (req: Request, res: Response) => {

}

interface Comment {
  id: string;
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
export const getCommentsV2 = async (req: Request, res: Response) => {
  /**
   * Recursive function to query replies.
   */
  const getCommentWithReplies = async (commentId: string, content: string) => {
    const results = await db.query(`
      SELECT  c2.id, c2.content
      FROM    Comments c1
              JOIN Comments c2 ON c2.reply_to = c1.id
      WHERE c1.id = $1;
    `, [commentId]);

    const replies: Comment[] = [];

    await Promise.all(results.rows.map(async (reply) => {
      const replyObj = await getCommentWithReplies(reply.id, reply.content);
      replies.push(replyObj);
    }))

    return {
      id: commentId,
      content,
      replies,
    }
  }
  const { threadId } = req.params;

  const comments: Comment[] = [];

  // Get all top level comments (no parent replies).
  const commentResults = await db.query(`
    SELECT id, content
    FROM Comments
    WHERE thread_id = $1 AND reply_to IS NULL;
  `, [threadId]);

  // Get each top-level comment and their replies.
  await Promise.all(commentResults.rows.map((comment) => {
    return getCommentWithReplies(comment.id, comment.content)
      .then((obj) => {
        comments.push(obj);
        return;
      })
  }));

  res.json({
    comments,
  })
}

export const createComment = async (req: Request, res: Response) => {

}

export const updateComment = async (req: Request, res: Response) => {

}

export const deleteComment = async (req: Request, res: Response) => {

}

export const voteComment = async (req: Request, res: Response) => {

}

export const replyComment = async (req: Request, res: Response) => {
  
}
