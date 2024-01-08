-- Initialise database tables.
-- Run via: \i {absolute_path_to_sql_file}
--      Sample: \i C:/Users/rrqui/OneDrive/Desktop/Projects/interex/backend/src/db/schema.sql

-- Note: PostgreSQL Shell does this weird thing where the path uses '/' instead of 
-- the normal '\'.

--------------------------------------------------------------------------------------------------

-- Set the timezone of this database.
SET TIMEZONE TO 'Australia/NSW';

CREATE DOMAIN EmailString AS VARCHAR(64) CHECK (VALUE ~ '^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$');
CREATE TYPE CommunityRole AS ENUM ('Owner', 'Admin', 'Moderator', 'Member');
CREATE TYPE VoteType AS ENUM ('Upvote', 'Downvote');

CREATE TABLE Users (
  id SERIAL,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar_url VARCHAR(255),
  password VARCHAR(255) NOT NULL, -- Store the hashed password.

  PRIMARY KEY (id)
);

-- COMMUNITIES
CREATE TABLE Communities (
  id SERIAL,
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id)
);

CREATE TABLE Categories (
  id SERIAL,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,

  PRIMARY KEY (id)
);

-- This models a 1-many relationship.
-- Communities can have multiple threads, as well as users can have multiple multiple threads.
CREATE TABLE Threads (
  id SERIAL,
  community_id INT NOT NULL, -- Total participation (A thread must be associated with a community).
  author INT, -- Can be null. If a user would be deleted, this thread would not be deleted.
  pinned_by INT, -- NULL value represents this thread as not being pinned.
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (community_id) REFERENCES Communities(id) ON DELETE CASCADE,
  FOREIGN KEY (author) REFERENCES Users(id), -- No cascade. If a user would be deleted, this thread would not be deleted. 
  FOREIGN KEY (pinned_by) REFERENCES Users(id),
  PRIMARY KEY (id)
);

CREATE TABLE Comments (
  id SERIAL,
  thread_id INT NOT NULL,
  author INT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  reply_to INT, -- NULL means that this comment is not replying to any comment.

  FOREIGN KEY (thread_id) REFERENCES Threads(id) ON DELETE CASCADE,
  FOREIGN KEY (author) REFERENCES Users(id),
  FOREIGN KEY (reply_to) REFERENCES Comments(id),
  PRIMARY KEY (id)
);

-- This models a many-many relationship.
CREATE TABLE Community_Categories (
  community_id INT,
  category_id INT,

  FOREIGN KEY (community_id) REFERENCES Communities(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE CASCADE,
  PRIMARY KEY (community_id, category_id)
);

-- This models a many-many relationship.
CREATE TABLE Community_Members (
  community_id INT,
  member_id INT,
  role CommunityRole NOT NULL DEFAULT 'Member',
  joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (community_id) REFERENCES Communities(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES Users(id) ON DELETE CASCADE,
  PRIMARY KEY (community_id, member_id)
);

-- This models a many-many relationship.
CREATE TABLE Thread_Votes (
  user_id INT NOT NULL,
  thread_id INT NOT NULL,
  type VoteType NOT NULL,

  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (thread_id) REFERENCES Threads(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, thread_id)
  -- Composite key ensures a user can only upvote a specific thread only once, as
  -- the combination of user_id and thread_id is unique.

  -- This heavily relates to 'Functional Dependencies' which promotes good database design (Look at your OneNote notes).
);

-- This models a many-many relationship.
CREATE TABLE Comment_Votes (
  user_id INT NOT NULL,
  comment_id INT NOT NULL,
  type VoteType NOT NULL,

  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (comment_id) REFERENCES Comments(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, comment_id)
);

CREATE TABLE Flairs (
  id SERIAL,
  community_id INT NOT NULL,
  name VARCHAR(50) UNIQUE NOT NULL,
  hex_color VARCHAR(50) NOT NULL,

  FOREIGN KEY (community_id) REFERENCES Communities(id) ON DELETE CASCADE,
  PRIMARY KEY (id)
);

CREATE TABLE Thread_Flairs (
  thread_id INT NOT NULL,
  flair_id INT NOT NULL,

  FOREIGN KEY (thread_id) REFERENCES Threads(id) ON DELETE CASCADE,
  FOREIGN KEY (flair_id) REFERENCES Flairs(id) ON DELETE CASCADE,
  PRIMARY KEY (thread_id, flair_id)
);

--------------------------------------------------------------------------------------------------------------

-- This database is in 3NF (3rd Normal Form) I think.

-- RELATIONAL DATABASE DESIGN RESOURCES:
-- 1: https://www.youtube.com/watch?v=GFQaEYEc8_8
-- 2: https://www.youtube.com/watch?v=J-drts33N8g

--------------------------------------------------------------------------------------------------------------

-- This schema is different from the above comment_votes table since it is not a composite primary key
-- but instead has its own primary key. This enables users to vote a comment multiple times, whereas
-- the above many-many relationship does not.

-- CREATE TABLE Comment_Votes (
--   id SERIAL,
--   user_id INT NOT NULL,
--   comment_id INT NOT NULL,
--   type VoteType NOT NULL,

--   FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
--   FOREIGN KEY (comment_id) REFERENCES Comments(id) ON DELETE CASCADE,
--   PRIMARY KEY (id)
-- );

--------------------------------------------------------------------------------------------------------------

-- NOTE: Thread-Votes and Threads tables are not the same.
-- While they both are involved in 2 1-many relationships where arrows are pointing away from them, they
-- are different. Since thread_votes uses a composite key to enforce a user can only upvote a thread once.
-- Whereas a thread tuple has its own id (primary key), and thus doesn't enforce that a user can only
-- create 1 thread.

--------------------------------------------------------------------------------------------------------------

-- NOTE:
-- Inheritance is the wrong approach (as seen below) since it doesn't enforce the fact that a user can only
-- upvote or downvote a single comment only once, since the composite key (vote_id, thread_id) is not a
-- feasible key to enforce that a user can only vote once on a thread/comment. This is because we can't
-- have access to user_id attr in the parent table Votes, hence the enforcement cannot be done.

--------------------------------------------------------------------------------------------------------------

-- CREATE TABLE Votes (
--   id SERIAL,
--   user_id INT,
--   type VoteType,

--   FOREIGN KEY (user_id) REFERENCES Users(id),
--   PRIMARY KEY (id)
-- );

-- -- The 2 tables below use inheritance.
-- CREATE TABLE Thread_Votes (
--   vote_id INT,
--   thread_id INT,

--   FOREIGN KEY (thread_id) REFERENCES Threads(id),
--   FOREIGN KEY (vote_id) REFERENCES Votes(id),
--   PRIMARY KEY (vote_id, thread_id) -- Vote id is both a primary and foreign key.
-- );
