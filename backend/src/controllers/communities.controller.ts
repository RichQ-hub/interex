import { Request, Response } from 'express';
import db from '../db';
import { InputError } from '../utils/error';
import { assertCommunityModerator, assertValidCategory } from '../utils/assert';

// ===========================================================================
// HELPERS
// ===========================================================================

/**
 * Helper that obtains a community's categories.
 */
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

// ===========================================================================
// CONTROLLERS
// ===========================================================================

/**
 * Gets all the communities.
 */
export const getAllCommunities = async (req: Request, res: Response) => {
  const allCommunities = await db.query(`
    SELECT  c.id, c.name, count(m.member_id) as num_members
    FROM    Communities c
            LEFT OUTER JOIN Community_Members m ON m.community_id = c.id
    GROUP BY c.id, c.name;
  `);

  // Grab each community's categories in parallel.
  const communities = await Promise.all(allCommunities.rows.map(async (com) => {
    // Return a promise for each community that fetches its categories.
    const categories = await getCommunityCategories(com.id);
    return {
      id: com.id,
      name: com.name,
      numMembers: com.num_members,
      categories,
    }
  }));
  
  res.json({
    communities,
  })
}

/**
 * Grabs all the categories that can be applied to ALL communities.
 */
export const getAllCategories = async (req: Request, res: Response) => {
  const result = await db.query(`
    SELECT
      id,
      name,
      description
    FROM
      Categories;
  `);

  res.json({
    categories: result.rows,
  });
}

/**
 * Gets all the communities that satisfy certain filters.
 */
export const searchCommunities = async (req: Request, res: Response) => {
  // Req.query obtains the search params in the url.
  const {
    query,
    category,
    page
  } = req.query;

  let currentPage = 1;
  if (typeof page === 'string') {
    currentPage = Number(page);
  }

  const COMMUNITIES_PER_PAGE = 20;
  const offset = (currentPage - 1) * COMMUNITIES_PER_PAGE;

  const searchQueryRegexp = `^${query || ''}.*`;

  let categories: string[] = [];
  if (Array.isArray(category)) {
    categories = category as string[];
  } else if (typeof category === 'string') {
    categories.push(category);
  }

  // Dynamically build the argument array that we pass to the query below.
  const queryArgs: any[] = [searchQueryRegexp];
  if (categories.length) {
    queryArgs.push(categories, categories.length);
  }

  // Query explained for filtering by multiple categories in queries.sql
  const result = await db.query(`
    SELECT  c.id, c.name,
            (SELECT count(*) FROM threads t WHERE t.community_id = c.id) AS num_threads
    FROM    Communities c
            LEFT OUTER JOIN Community_Categories cc ON cc.community_id = c.id
            LEFT OUTER JOIN Categories cat ON cat.id = cc.category_id
    WHERE   c.name ~* $1 ${categories.length ? 'AND cat.name = ANY ($2)' : ''}
    GROUP BY c.id, c.name
    ${categories.length ? 'HAVING  count(cat.id) = $3' : ''}
    LIMIT ${COMMUNITIES_PER_PAGE}
    OFFSET ${offset}
    ;
  `, queryArgs);

  /**
   * Can insert an array into the query.
   * Note that (= ANY (...)) is essentially the same as (IN (...)), but the ANY keyword can accept javascsript arrays in pg.
   * 
   * Resources:
   * https://stackoverflow.com/questions/10720420/node-postgres-how-to-execute-where-col-in-dynamic-value-list-query
   * https://github.com/brianc/node-postgres/wiki/FAQ#11-how-do-i-build-a-where-foo-in--query-to-find-rows-matching-an-array-of-values
   */

  /**
   * NOTE: 
   * Used pre-aggregation in a subquery in the select clause. (This is much faster than multiple joins).
   * Could use this to count the number of members so that we don't have to create a separate query
   * to fetch number the number of threads for each community, we can just do all of it in a single query.
   * 
   * How to think about it:
   * All of the JOINS and GROUP BY clauses are executed first. We then execute the subquery with 
   * uses the community id in the resulting tuples to grab the number of threads.
   * 
   * Resource:
   * https://stackoverflow.com/questions/24788715/using-sql-aggregate-functions-with-multiple-joins
   */

  /**
   * Could change LIMIT OFFSET to use keyset pagination in the future.
   */

  // Grab each community's categories in parallel.
  const communities = await Promise.all(result.rows.map(async (com) => {
    const categories = await getCommunityCategories(com.id);

    // Grab the number of community members in this particular community.
    const resultMembers = await db.query(`
      SELECT  count(m.member_id) as num_members
      FROM    Communities c
              LEFT OUTER JOIN Community_Members m ON m.community_id = c.id
      WHERE   c.id = $1;
    `, [com.id]);

    const numMembers = resultMembers.rows[0].num_members;

    return {
      id: com.id,
      name: com.name,
      numMembers,
      numThreads: com.num_threads,
      categories,
    }
  }));

  res.json({
    communities,
  })
}

/**
 * Gets all the community details.
 */
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

/**
 * Creates a community.
 */
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

/**
 * Deletes a given community.
 */
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

/**
 * Creates a category to apply to categories.
 */
export const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;

  const result = await db.query(`
    INSERT INTO Categories (name)
    VALUES ($1)
    RETURNING name;
  `, [name]);

  const newCategory = result.rows[0];
  res.json({
    category: newCategory,
  });
}

/**
 * Adds a category to a specific community.
 */
export const addCategory = async (req: Request, res: Response) => {
  const { communityId, categoryId } = req.params;
  const userId = req.user || '';

  await assertCommunityModerator(communityId, userId);
  await assertValidCategory(categoryId);

  const result = await db.query(`
    INSERT INTO Community_Categories (community_id, category_id)
    VALUES ($1, $2)
    RETURNING community_id, category_id;
  `, [communityId, categoryId]);

  const addedCategory = result.rows[0];
  res.json({
    category: addedCategory,
  });
}

/**
 * Gets all flairs available within a community.
 */
export const getAllFlairs = async (req: Request, res: Response) => {
  const { communityId } = req.params;

  const results = await db.query(`
    SELECT
      name,
      hex_color
    FROM
      Flairs
    WHERE
      community_id = $1;
  `, [communityId]);

  res.json({
    flairs: results.rows,
  })
}

/**
 * Creates a flair within a community.
 */
export const createFlair = async (req: Request, res: Response) => {
  const { communityId } = req.params;
  const userId = req.user || '';

  const {
    name,
    hexColor
  } = req.body;

  await assertCommunityModerator(communityId, userId);

  const result = await db.query(`
    INESRT INTO Flairs (community_id, name, hex_color)
    VALUES ($1, $2, $3)
    RETURNING community_id, name, hex_color;
  `, [communityId, name, hexColor]);

  const newFlair = result.rows[0];

  res.json({
    flair: newFlair,
  });
}
