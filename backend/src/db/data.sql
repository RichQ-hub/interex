insert into users (username, email, password) values ('mike', '2@gmail.com', 'no');
insert into users (username, email, password) values ('sarah', 'sarah@gmail.com', 'no');

insert into communities (name) values ('Minecraft');
insert into communities (name) values ('Real Estate');
insert into communities (name) values ('Cooking');

insert into categories (name) values ('Gaming');
insert into categories (name) values ('Sports');
insert into categories (name) values ('News');
insert into categories (name) values ('Politics');
insert into categories (name) values ('Gambling');
insert into categories (name) values ('Housing');

insert into community_categories (community_id, category_id) values (1, 1);
insert into community_categories (community_id, category_id) values (1, 6);
insert into community_categories (community_id, category_id) values (2, 6);
insert into community_categories (community_id, category_id) values (2, 3);
insert into community_categories (community_id, category_id) values (2, 4);

insert into community_members (community_id, member_id, role) values (1, 1, 'Member');
insert into community_members (community_id, member_id, role) values (1, 2, 'Moderator');

insert into threads (community_id, author, title) values (1, 1, 'Is this game worth it?');

-- update threads set pinned_by = 1 where id = 1;

-- insert into thread_votes (user_id, thread_id, type) values (1, 1, 'Upvote');
