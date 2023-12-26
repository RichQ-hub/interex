SELECT  c.name as community_name
FROM    Communities c
        LEFT OUTER JOIN Community_Categories cc ON cc.community_id = c.id
        LEFT OUTER JOIN Categories cat ON cat.id = cc.category_id
WHERE   cat.name IN ('Gaming', 'Housing')
GROUP BY c.name
HAVING  count(cat.id) = 2;


-- HOW THIS WORKS
-- First obtain all communities and join each of them with all the categories that they are tagged with.
-- Then, we only choose those tuples that contain the categories given, which should leave us with
-- community tuples that match any of the categories given (this where condition doesn't stricly
-- enforce that a community must have ALL the cateogries in that set).

-- Sample Tuples:
-- | c.name | cat.name |
-- | Minecraft | Gaming |
-- | Minecraft | Housing |
-- | Real Estate | Housing |

-- Notice that Real Estate still appears even though it doesn't match 'Gaming' category. Remember a
-- community doesn't have to match ALL the categories, it just has to match at least 1.

-- Next we use GROUP BY c.name to reduce all communities by their name into ONE tuple. 

-- We use the HAVING clause to filter groups, we do this by using count(cat.id) on each group (which we
-- group by the community name). We essentially count the number of UNIQUE categories that each community
-- has. Since we filtered the tuples to only contain communities that have the given categories using WHERE,
-- if we use count(cat.id) on each group, then it should be less than or equal to 2 (which is the length of
-- the categories set that we want). If count(cat.id) = 2, then that means the current community matches
-- EVERY category in that ('Gaming', 'Housing') set. 

-- ALTERNATIVE:
-- Why not change to count(cat.id) > 2? You might think this because we might want to match AT LEAST all the
-- categories. E.g. the community 'PS4' has the matches the following categories ('Gaming', 'Hardware', 'News').
-- Say we want to filter communities that have the following categories ('Gaming'). In our app, this should
-- still display 'PS4' since it matches that 'Gaming' category.

-- You would think that count(cat.id) = 1 would be insufficient because the community clearly has 3 categories,
-- but having count(cat.id) = 1 would not return 'PS4' since it count(cat.id) should = 3. However, this is
-- not the case, as we filtered the tuple so that we should be left with only the tuple ('PS4', 'Gaming').
-- It doesn't return the tuples where 'PS4' match with its other categories 'Hardware' and 'News', only
-- 'Gaming' as seen above with the WHERE statement. Hence, count(cat.id) = 1 is TRUE.

----------------------------------------------------------------------------------------------------
-- This is a 'Relational Division' Problem: (Resources)
-- Look at your notes.
-- https://stackoverflow.com/questions/15977126/select-group-of-rows-that-match-all-items-in-a-list
-- https://www.red-gate.com/simple-talk/databases/sql-server/t-sql-programming-sql-server/divided-we-stand-the-sql-of-relational-division/
----------------------------------------------------------------------------------------------------
