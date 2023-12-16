INSERT INTO Users (username, email, password)
VALUES
  ('mike', '2@gmail.com', 'no'),
  ('sarah', 'sarah@gmail.com', 'no')
;

INSERT INTO Communities (name)
VALUES
  ('Minecraft'),
  ('Real Estate'),
  ('Cooking')
;

INSERT INTO Categories (name)
VALUES
  ('Gaming'),
  ('Sports'),
  ('News'),
  ('Politics'),
  ('Gambling'),
  ('Housing')
;

INSERT INTO Community_Categories (community_id, category_id)
VALUES
  (1, 1),
  (1, 6),
  (2, 6),
  (2, 3),
  (2, 4)
;

INSERT INTO Community_Members (community_id, member_id, role)
VALUES
  (1, 1, 'Member'),
  (1, 2, 'Moderator')
;

INSERT INTO Threads (community_id, author, title, content)
VALUES
  (1, 1, 'Is this game worth it?', 'what the title says')
;


INSERT INTO Comments (thread_id, content)
VALUES
  (1, 'This is amazing, so yes'),
  (1, 'YES THE BLOCK IS THE WAY')
;

INSERT INTO Comments (thread_id, reply_to, content)
VALUES
  (1, 1, 'Reply1'),
  (1, 1, 'Reply2'),
  (1, 2, 'Reply3'),
  (1, 3, 'Reply to Reply 1')
;

-- update threads set pinned_by = 1 where id = 1;

-- insert into thread_votes (user_id, thread_id, type) values (1, 1, 'Upvote');
