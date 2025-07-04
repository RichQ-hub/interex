import format from 'pg-format';
import db from '../db';
import { AccessError, InputError } from './error';

export const assertThreadOwner = async (userId: string, threadId: string) => {
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

export const assertValidCommunity = async (communityId: string) => {
  const results = await db.query(`
    SELECT
      name
    FROM
      Communities
    WHERE
      id = $1;
  `, [communityId]);

  if (!results.rowCount) {
    throw new InputError('Community does not exist.');
  }
}

export const assertValidCategory = async (categoryId: string) => {
  const results = await db.query(`
    SELECT
      c.id
    FROM
      Categories c
    WHERE
      c.id = $1;
  `, [categoryId]);

  if (!results.rowCount) {
    throw new InputError(`Category with id = '${categoryId}' does not exist.`);
  }
}

/**
 * Ensures that the user is a moderator or higher in terms of rank in the community.
 */
export const assertCommunityModerator = async (communityId: string, userId: string) => {
  const results = await db.query(`
    SELECT
      c.id
    FROM
      Communities c
      JOIN Community_Members m ON m.community_id = c.id
    WHERE
      c.id = $1 AND m.member_id = $2 AND (m.role NOT IN ('Member'));
  `, [communityId, userId]);

  if (!results.rowCount) {
    throw new AccessError('User is not a moderator or admin in this community.')
  }
}

export const assertCommunityMember = async (communityId: string, userId: string) => {
  const results = await db.query(`
    SELECT
      m.member_id
    FROM
      Communities c
      JOIN Community_Members m ON m.community_id = c.id
    WHERE
      c.id = $1 AND m.member_id = $2;
  `, [communityId, userId]);

  if (!results.rowCount) {
    throw new AccessError('User is not a member of this community.')
  }
}

export const assertCommentOwner = async (commentId: string, userId: string) => {
  const results = await db.query(`
    SELECT
      c.id
    FROM
      Comments
    WHERE
      id = $1 AND author = $2;
  `, [commentId, userId]);

  if (!results.rowCount) {
    throw new AccessError('User is not the owner of this comment.')
  }
}

export const assertCommunityOwner = async (communityId: string, userId: string) => {
  const results = await db.query(`
    SELECT
      community_id
    FROM
      Community_Members
    WHERE
      community_id = $1 AND member_id = $2 AND role = 'Owner';
  `, [communityId, userId]);

  if (!results.rowCount) {
    throw new AccessError('User is not the owner of this community.');
  }
}

export const assertValidFlair = async (communityId: string, flairId: string) => {
  const results = await db.query(`
    SELECT
      name
    FROM
      Flairs
    WHERE
      community_id = $1 AND id = $2;
  `, [communityId, flairId]);

  if (!results.rowCount) {
    throw new InputError('Flair does not exist in this community.');
  }
}

export const assertValidFlairs = async (communityId: string, flairIds: string[]) => {
	// If there are no flairs, we return.
	if (!flairIds.length) {
		return;
	}
	
	const q = format(`
		SELECT
			id
		FROM
			Flairs
		WHERE
			community_id = %s AND id IN (%L)
	`, communityId, flairIds);

	const results = await db.query(q);

	const flairResults = results.rows.map((flair) => {
		return String(flair.id);
	});

	// Get non-matching elements.
	const set = new Set(flairResults);
	const nonMatching = flairIds.filter((flairId) => !set.has(flairId)) as string[];
	if (nonMatching.length > 0) {
		throw new InputError(`Flairs {${nonMatching.join(', ')}} are invalid.`);
	}
}
