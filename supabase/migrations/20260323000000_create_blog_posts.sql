-- Drop the old table
DROP TABLE IF EXISTS blog_posts;

-- Create the new one with all the fields our editor needs
CREATE TABLE blog_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  excerpt text,
  content text NOT NULL,
  author text DEFAULT 'HopeEngineer',
  date text NOT NULL,
  image_url text,
  image_hint text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow ANYONE to read posts (this is a public blog)
CREATE POLICY "Public can read blog posts"
  ON blog_posts FOR SELECT
  USING (true);

-- Allow authenticated users to insert/update/delete (admin check happens in app code)
CREATE POLICY "Authenticated users can insert blog posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update blog posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete blog posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (true);
