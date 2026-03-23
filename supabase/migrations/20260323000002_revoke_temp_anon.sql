-- Revoke the temporary anon insert policy (no longer needed)
DROP POLICY IF EXISTS "Temp anon insert" ON blog_posts;
