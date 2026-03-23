-- Temporarily allow anon updates for content fix v2
CREATE POLICY "Temp anon update v2" ON blog_posts FOR UPDATE TO anon USING (true) WITH CHECK (true);
