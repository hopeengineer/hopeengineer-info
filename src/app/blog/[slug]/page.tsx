import BlogPostContent from "./BlogPostContent";

// This tells Next.js to always render this page dynamically at request time.
// This is the key fix for the "404 on navigation" issue, as it prevents
// Next.js from trying to serve a non-existent static page.
export const dynamic = "force-dynamic";

// This is a simple Server Component wrapper.
// Its only job is to render the Client Component that does all the work.
export default function BlogPostPage() {
  return <BlogPostContent />;
}
