-- Temporarily allow anon inserts for seeding
CREATE POLICY "Temp anon insert" ON blog_posts FOR INSERT TO anon WITH CHECK (true);
