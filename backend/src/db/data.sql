insert into users (username, email, password) values ('mike', '2@gmail.com', 'no');
insert into communities (name) values ('Minecraft');
insert into threads (community_id, author, title) values (1, 1, 'Is this game worth it?');
insert into thread_votes (user_id, thread_id, type) values (1, 1, 'Upvote');

select * from thread_votes t join votes v on v.id = t.vote_id join users u on u.id = v.user_id;