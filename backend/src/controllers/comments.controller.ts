import { Request, Response } from 'express';
import db from '../db';
import { AccessError } from '../utils/error';

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

}

export const updateComment = async (req: Request, res: Response) => {

}

export const deleteComment = async (req: Request, res: Response) => {

}

export const voteComment = async (req: Request, res: Response) => {

}

export const replyComment = async (req: Request, res: Response) => {
  
}
