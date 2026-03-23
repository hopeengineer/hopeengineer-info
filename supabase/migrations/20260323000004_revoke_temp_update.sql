-- Revoke the temporary anon update policy
DROP POLICY IF EXISTS "Temp anon update" ON blog_posts;
