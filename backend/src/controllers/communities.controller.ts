import { Request, Response } from 'express';
import db from '../db';
import { InputError } from '../utils/error';
import format from 'pg-format';
import {
  assertCommunityModerator,
  assertCommunityOwner,
  assertValidCategory,
  assertValidCommunity
} from '../utils/assert';

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

/**
 * Gets all the members of a given community.
 */
const getCommunityMembers = async (communityId: string) => {
  const result = await db.query(`
    SELECT
      u.id, u.username, m.role
    FROM
      Communities c
      JOIN Community_Members m ON m.community_id = c.id
      JOIN Users u ON u.id = m.member_id
    WHERE
      c.id = $1;
  `, [communityId]);

  return result.rows.map((member) => {
    return {
      id: member.id as string,
      username: member.username as string,
      role: member.role as string,
    }
  });
}

/**
 * Get all the flairs in a given community.
 */
const getCommunityFlairs = async (communityId: string) => {
  const result = await db.query(`
  SELECT
    id,
    name,
    hex_color
  FROM
    Flairs
  WHERE
    community_id = $1;
  `, [communityId]);

  return result.rows.map((flair) => {
    return {
      id: flair.id as string,
      name: flair.name as string,
      hexColor: flair.hex_color as string,
    }
  });
}

// ===========================================================================
// CONTROLLERS
// ===========================================================================

/**
 * Gets all the communities.
 */
export const getAllCommunities = async (req: Request, res: Response) => {
  const allCommunities = await db.query(`
    SELECT  c.id, c.name, count(t.id) as num_threads
    FROM    Communities c
            LEFT OUTER JOIN Threads t ON t.community_id = c.id
    GROUP BY c.id, c.name;
  `);

  // Grab each community's categories in parallel.
  const communities = await Promise.all(allCommunities.rows.map(async (com) => {
    // Return a promise for each community that fetches its categories.
    const categories = await getCommunityCategories(com.id);
    return {
      id: com.id,
      name: com.name,
      numThreads: com.num_threads,
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
    sortBy,
    pageSize,
    page
  } = req.query;

  const sortOptions = [
    'c.name ASC',
    'num_threads DESC, c.name ASC',
    'num_threads ASC, c.name ASC',
  ];

  let selectedSortOpt = sortOptions[0];
  if (typeof sortBy === 'string') {
    selectedSortOpt = sortOptions[Number(sortBy)];
  }

  let currentPage = 1;
  if (typeof page === 'string') {
    currentPage = Number(page);
  }

  let currPageSize = 10;
  if (pageSize && typeof pageSize === 'string') {
    currPageSize = Number(pageSize);
  }
  const offset = (currentPage - 1) * currPageSize;

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
    ${categories.length ? 'HAVING count(cat.id) = $3' : ''}
    ORDER BY ${selectedSortOpt}
    LIMIT ${currPageSize}
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

  const categories = await getCommunityCategories(communityId);
  const members = await getCommunityMembers(communityId);
  const flairs = await getCommunityFlairs(communityId);

  res.json({
    id: details.id,
    name: details.name,
    description: details.description,
    createdAt: details.createdAt,
    categories,
    members,
    flairs,
  });
}

/**
 * Creates a community.
 */
export const createCommunity = async (req: Request, res: Response) => {
  const userId = req.user || '';
  const {
    name,
    description,
    categories,
  } = req.body;

  console.log(req.body)

  // Assert all categories are valid.
  await Promise.all(categories.map(async (categoryId: string) => {
    await assertValidCategory(categoryId);
  }))

  const result = await db.query(`
    INSERT INTO Communities (name, description)
    VALUES ($1, $2)
    RETURNING id, name, description;
  `, [name, description]);

  const newCommunity = result.rows[0];

  // The user who created the community automatically becomes a member with the role of 'Owner'.
  await db.query(`
    INSERT INTO Community_Members (community_id, member_id, role)
    VALUES ($1, $2, $3);
  `, [newCommunity.id, userId, 'Owner']);

  const categoryTuples = categories.map((categoryId: string) => {
    return [newCommunity.id, categoryId]
  });

  // Add the categories.
  await db.query(format(`
    INSERT INTO Community_Categories (community_id, category_id)
    VALUES %L;
  `, categoryTuples));

  res.json({
    community: newCommunity,
  });
}

/**
 * Edits a community.
 */
export const editCommunity = async (req: Request, res: Response) => {
  const userId = req.user || '';
  const { communityId } = req.params;
  const {
    name,
    description,
    categories,
  } = req.body;

  // Assert all categories are valid.
  await Promise.all(categories.map(async (category: string) => {
    return await assertValidCategory(category);
  }))

  // Assert the user is authorised to edit this community.
  await assertCommunityModerator(communityId, userId);

  // Update the name and description of this community.
  const result = await db.query(`
    UPDATE Communities
    SET
      name = $1,
      description = $2
    WHERE
      id = $3
    RETURNING id, name, description;
  `, [name, description, communityId]);

  const editedCommunity = result.rows[0];

  // Delete all categories of this community.
  await db.query(`
    DELETE FROM Community_Categories
    WHERE community_id = $1;
  `, [communityId]);

  // Add all the new categories to this community.
  const categoryTuples = categories.map((categoryId: string) => {
    return [communityId, categoryId]
  });

  await db.query(format(`
    INSERT INTO Community_Categories (community_id, category_id)
    VALUES %L;
  `, categoryTuples)); 

  res.json({
    editedCommunity,
  })
}

/**
 * Deletes a given community.
 */
export const deleteCommunity = async (req: Request, res: Response) => {
  const userId = req.user || '';
  const { communityId } = req.params;

  await assertCommunityOwner(communityId, userId);

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
 * Creates a category to apply to ALL communities.
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
      id,
      name,
      hex_color as hexColor
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

  await assertValidCommunity(communityId);
  await assertCommunityModerator(communityId, userId);

  const result = await db.query(`
    INSERT INTO Flairs (community_id, name, hex_color)
    VALUES ($1, $2, $3)
    RETURNING *;
  `, [communityId, name, hexColor]);

  const newFlair = result.rows[0];

  res.json({
    flair: newFlair,
  });
}

/**
 * Join a community with a default role of 'Member'.
 */
export const joinCommunity = async (req: Request, res: Response) => {
  const userId = req.user || '';
  const { communityId } = req.params;

  const result = await db.query(`
    INSERT INTO Community_Members (community_id, member_id)
    VALUES ($1, $2)
    RETURNING community_id, member_id;
  `, [communityId, userId]);

  const newMember = result.rows[0];

  res.json({
    communityMember: newMember,
  });
}
