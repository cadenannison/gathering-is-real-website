import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Post",
};

export default function BlogPostPage() {
  return (
    <article className="py-24 md:py-32">
      <Container narrow>
        <Button href="/blog" variant="ghost" className="mb-8 text-sm">
          ← Back to Blog
        </Button>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-semibold text-secondary uppercase tracking-widest font-sans">
            Category
          </span>
          <span className="text-xs text-muted font-sans">·</span>
          <span className="text-xs text-muted font-sans">Date</span>
          <span className="text-xs text-muted font-sans">·</span>
          <span className="text-xs text-muted font-sans">5 min read</span>
        </div>

        <h1 className="font-display text-5xl md:text-6xl font-semibold text-heading leading-tight mb-10">
          Post Title
        </h1>

        <div className="border-t border-border pt-10 space-y-6 text-body font-sans leading-relaxed text-lg">
          <p>Blog post content will appear here once connected to Sanity CMS.</p>
        </div>
      </Container>
    </article>
  );
}
