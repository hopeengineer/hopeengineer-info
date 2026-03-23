-- Revoke the temporary anon update policy v2
DROP POLICY IF EXISTS "Temp anon update v2" ON blog_posts;
