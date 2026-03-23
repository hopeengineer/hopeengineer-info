-- Temporarily allow anon updates for content fix
CREATE POLICY "Temp anon update" ON blog_posts FOR UPDATE TO anon USING (true) WITH CHECK (true);
