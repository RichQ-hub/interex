
CREATE OR REPLACE FUNCTION
  community_moderators(_community_id INT) RETURNS TABLE (member_id INT, member_username VARCHAR)
AS $$
BEGIN
  RETURN query
    SELECT  m.member_id, u.username
    FROM    Communities c
            JOIN Community_Members m ON m.community_id = c.id
            JOIN Users u ON u.id = m.member_id
    WHERE   c.id = _community_id AND (m.role = 'Admin' OR m.role = 'Moderator');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION
  valid_community_member() RETURNS TRIGGER
AS $$
BEGIN
  if NEW.pinned_by IS NULL THEN
    RAISE EXCEPTION 'Thread cannot be pinned by a non-existant user';
  END IF;

  IF NEW.pinned_by NOT IN (
    SELECT member_id FROM community_moderators(OLD.community_id)
  ) THEN
    RAISE EXCEPTION 'User is not a moderator';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER is_community_moderator
  AFTER UPDATE ON Threads
  FOR EACH ROW
  EXECUTE PROCEDURE valid_community_member();
