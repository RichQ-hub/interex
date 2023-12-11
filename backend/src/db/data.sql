insert into users (username, email, password) values ('mike', '2@gmail.com', 'no');
insert into users (username, email, password) values ('sarah', 'sarah@gmail.com', 'no');

insert into communities (name) values ('Minecraft');

insert into community_members (community_id, member_id, role) values (1, 1, 'Member');
insert into community_members (community_id, member_id, role) values (1, 2, 'Moderator');

insert into threads (community_id, author, title) values (1, 1, 'Is this game worth it?');

-- update threads set pinned_by = 1 where id = 1;

-- insert into thread_votes (user_id, thread_id, type) values (1, 1, 'Upvote');
