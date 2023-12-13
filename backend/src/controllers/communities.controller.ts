import { Request, Response } from 'express';
import db from '../db';
import { CommunityDetails } from '../schemas/schemas';

export const getAllCommunities = async (req: Request, res: Response) => {
  const allCommunities = await db.query(`
    SELECT  id, name, description
    FROM    Communities;
  `);

  // Grab each community's categories in parallel.
  const communities = await Promise.all(allCommunities.rows.map((com) => {
    // Return a promise for each community that fetches its categories.
    return db.query(`
      SELECT  cat.name
      FROM    Communities c
              JOIN Community_Categories cc ON c.id = cc.community_id
              JOIN Categories cat ON cat.id = cc.category_id
      WHERE   c.id = $1;
    `, [com.id])
      .then((categories) => {
        // Reurn this object which is wrapped in a promise.
        return {
          id: com.id,
          name: com.name,
          categories: categories.rows.map((category) => category.name), // Map each query result object to just a string.
        }
      });
  }))
  
  res.json({
    communities,
  })
}

export const createCommunity = async (req: Request, res: Response) => {
  const {
    name,
    description
  } = req.body;

  const results = await db.query(`
    INSERT INTO Communities (name, description)
    VALUES ($1, $2)
    RETURNING name, description;
  `, [name, description]);

  const newCommunity = results.rows[0];
  res.json({
    community: newCommunity,
  });
}

export const filterCommunitiesByCategory = async (req: Request, res: Response) => {
  // This obtains the search params in the url.
  const { category } = req.query;

  if (!category) {
    return;
  }

  let categories: string[] = [];
  if (Array.isArray(category)) {
    categories = category as string[];
  } else if (typeof category === 'string') {
    categories.push(category);
  }

  let queryPlaceholderNum = 1;
  const conditions: string[] = [];
  categories.forEach((cat) => {
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

  res.json({
    communities: result.rows,
  })
}
