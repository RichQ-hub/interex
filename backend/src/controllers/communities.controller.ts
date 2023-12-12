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
          categories: categories.rows,
        }
      });
  }))
  
  res.json({
    communities,
  })
}

export const createCommunity = async (req: Request, res: Response) => {

}

export const filterCommunitiesByCategory = async (req: Request, res: Response) => {

}
