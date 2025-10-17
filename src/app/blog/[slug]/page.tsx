import BlogPostContent from "./BlogPostContent";

// This is now a simple Server Component wrapper.
// Its only job is to render the Client Component that does all the work.
export default function BlogPostPage() {
  return <BlogPostContent />;
}
