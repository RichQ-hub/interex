--  Clean up tables
--  Note: The order of dropping tables is important due to referential integrity.

-- Run via: \i {absolute_path_to_sql_file}
--      Sample: \i C:/Users/rrqui/OneDrive/Desktop/Projects/interex/backend/src/db/cleanup.sql

DROP DOMAIN IF EXISTS EmailString CASCADE;
DROP TYPE IF EXISTS CommunityRole CASCADE;
DROP TYPE IF EXISTS VoteType CASCADE;

DROP TABLE IF EXISTS 
  Users,
  Communities,
  Categories,
  Threads,
  Comments,
  Community_Categories,
  Community_Members,
  Thread_Votes,
  Comment_Votes,
  Thread_Flairs,
  Flairs
CASCADE;
