import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "News, stories, and updates from Gathering Is Real.",
};

const posts = [
  {
    slug: "why-service-changes-you",
    title: "Why Service Changes You More Than the People You Serve",
    excerpt:
      "Volunteering is often sold as an act of giving. But the people who do it know the truth: you receive far more than you give.",
    date: "April 28, 2026",
    category: "Reflection",
    readTime: "4 min read",
  },
  {
    slug: "spring-recap",
    title: "Spring Service Day Recap: 300 Volunteers, One Purpose",
    excerpt:
      "Last weekend, 300 people showed up. Here's what happened when they did.",
    date: "April 14, 2026",
    category: "News",
    readTime: "3 min read",
  },
  {
    slug: "finding-your-fit",
    title: "How to Find the Right Volunteer Opportunity for You",
    excerpt:
      "Not every opportunity is a fit. Here's a simple framework for finding the one that is.",
    date: "March 30, 2026",
    category: "Guide",
    readTime: "5 min read",
  },
  {
    slug: "partner-spotlight",
    title: "Partner Spotlight: Three Organizations Doing Remarkable Work",
    excerpt:
      "We partner with organizations across the city. Meet three of them and see what they're building.",
    date: "March 15, 2026",
    category: "Community",
    readTime: "6 min read",
  },
];

export default function BlogPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-cream py-24 md:py-32">
        <Container narrow>
          <div className="text-center">
            <span className="text-xs font-semibold text-secondary uppercase tracking-widest font-sans">
              Stories &amp; Updates
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-semibold text-heading mt-4 leading-tight">
              The Blog
            </h1>
            <p className="mt-6 text-lg text-muted leading-relaxed font-sans max-w-xl mx-auto">
              Reflections, stories, guides, and news from the Gathering Is Real
              community.
            </p>
          </div>
        </Container>
      </section>

      {/* Posts */}
      <section className="py-20 md:py-28">
        <Container>
          {/* Featured post */}
          <Link href={`/blog/${posts[0].slug}`} className="block mb-8 group">
            <Card hover>
              <div className="p-10 md:p-14">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-xs font-semibold text-secondary uppercase tracking-widest font-sans">
                    {posts[0].category}
                  </span>
                  <span className="text-xs text-muted font-sans">·</span>
                  <span className="text-xs text-muted font-sans">
                    {posts[0].date}
                  </span>
                  <span className="text-xs text-muted font-sans">·</span>
                  <span className="text-xs text-muted font-sans">
                    {posts[0].readTime}
                  </span>
                </div>
                <h2 className="font-display text-4xl md:text-5xl font-semibold text-heading leading-tight mb-4 group-hover:text-primary transition-colors">
                  {posts[0].title}
                </h2>
                <p className="text-muted font-sans leading-relaxed text-lg max-w-2xl">
                  {posts[0].excerpt}
                </p>
                <span className="inline-block mt-6 text-sm text-primary font-semibold font-sans">
                  Read More →
                </span>
              </div>
            </Card>
          </Link>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.slice(1).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <Card hover className="h-full">
                  <div className="p-7 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs font-semibold text-secondary uppercase tracking-widest font-sans">
                        {post.category}
                      </span>
                      <span className="text-xs text-muted font-sans">·</span>
                      <span className="text-xs text-muted font-sans">
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl font-semibold text-heading mb-3 group-hover:text-primary transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed font-sans flex-1">
                      {post.excerpt}
                    </p>
                    <p className="text-xs text-muted font-sans mt-5">
                      {post.date}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
