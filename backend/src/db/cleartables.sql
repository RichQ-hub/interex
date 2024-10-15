-- Clears data from the tables without deleting them.

TRUNCATE
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