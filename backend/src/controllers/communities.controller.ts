import { Request, Response } from 'express';
import db from '../db';
import { InputError } from '../utils/error';

const getCommunityCategories = async (communityId: string) => {
  const result = await db.query(`
    SELECT  cat.name
    FROM    Communities c
            JOIN Community_Categories cc ON c.id = cc.community_id
            JOIN Categories cat ON cat.id = cc.category_id
    WHERE   c.id = $1;
  `, [communityId]);

  // Map each query result object to just a string.
  return result.rows.map((category) => category.name as string);
}

/**
 * Helper that returns each community along with each of their cateogories in parallel.
 */
const getCommunitiesWithCategories = async (communities: { id: string, name: string }[]) => {
  return await Promise.all(communities.map((com) => {
    // Return a promise for each community that fetches its categories.
    return getCommunityCategories(com.id)
      .then((categories) => {
        // Reurn this object which is wrapped in a promise.
        return {
          id: com.id,
          name: com.name,
          categories,
        }
      });
  }))
}

export const getAllCommunities = async (req: Request, res: Response) => {
  const allCommunities = await db.query(`
    SELECT  id, name
    FROM    Communities;
  `);

  // Grab each community's categories in parallel.
  const communities = await getCommunitiesWithCategories(allCommunities.rows);
  
  res.json({
    communities,
  })
}

export const filterCommunitiesByCategory = async (req: Request, res: Response) => {
  // This obtains the search params in the url.
  const { category } = req.query;

  if (!category) {
    throw new InputError('nice')
  }

  let categories: string[] = [];
  if (Array.isArray(category)) {
    categories = category as string[];
  } else if (typeof category === 'string') {
    categories.push(category);
  }

  let queryPlaceholderNum = 1;
  const conditions: string[] = [];
  categories.forEach(() => {
    conditions.push(`$${queryPlaceholderNum}`);
    queryPlaceholderNum += 1;
  })

  // Query explained in queries.sql
  const result = await db.query(`
    SELECT  c.id, c.name
    FROM    Communities c
            JOIN Community_Categories cc ON cc.community_id = c.id
            JOIN Categories cat ON cat.id = cc.category_id
    WHERE   cat.name IN (${conditions.join(', ')})
    GROUP BY c.id, c.name
    HAVING  count(cat.id) = $${queryPlaceholderNum};
  `, [...categories, categories.length]);

  // Grab each community's categories in parallel.
  const communities = await getCommunitiesWithCategories(result.rows);

  res.json({
    communities,
  })
}

export const getCommunityDetails = async (req: Request, res: Response) => {
  const { communityId } = req.params;

  const result = await db.query(`
    SELECT id, name, description, created_at as "createdAt"
    FROM Communities
    WHERE id = $1;
  `, [communityId]);

  if (result.rows.length === 0) {
    throw new InputError('The community does not exist.');
  }

  const details = result.rows[0];

  const categories = await getCommunityCategories(details.id);

  res.json({
    id: details.id,
    name: details.name,
    description: details.description,
    createdAt: details.createdAt,
    categories,
  })
}

export const createCommunity = async (req: Request, res: Response) => {
  const {
    name,
    description
  } = req.body;

  const result = await db.query(`
    INSERT INTO Communities (name, description)
    VALUES ($1, $2)
    RETURNING name, description;
  `, [name, description]);

  const newCommunity = result.rows[0];
  res.json({
    community: newCommunity,
  });
}

export const deleteCommunity = async (req: Request, res: Response) => {
  const { communityId } = req.params;

  const result = await db.query(`
    DELETE FROM Communities
    WHERE id = $1
    RETURNING name, description;
  `, [communityId]);

  const deletedCommunity = result.rows[0];
  res.json({
    community: deletedCommunity,
  })
}
