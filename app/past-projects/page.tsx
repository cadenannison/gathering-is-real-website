import Link from "next/link";
import Container from "@/components/ui/Container";
import AnimatedSection from "@/components/ui/AnimatedSection";
import PastProjectsMap from "@/components/sections/PastProjectsMap";
import { pastProjects } from "@/data/pastProjects";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Past Projects",
  description:
    "Every star is a place we've served. See the stories and the impact made there.",
};

export default function PastProjectsPage() {
  return (
    <>
      {/* p.14 — The map is the page */}
      <section className="pb-12 pt-10 md:pb-16 md:pt-12">
        <Container>
          <AnimatedSection>
            <div className="mb-8 text-center">
              <span className="font-sans text-xs font-semibold uppercase tracking-widest text-secondary">
                Our Impact
              </span>
              <h1 className="mt-3 font-display text-5xl font-semibold leading-tight text-heading md:text-6xl">
                Past Projects
              </h1>
              <p className="mx-auto mt-5 max-w-lg font-sans leading-relaxed text-muted">
                Every star marks a place we&apos;ve served. Hover one to see
                where, then click through for the story.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <PastProjectsMap projects={pastProjects} />
          </AnimatedSection>
        </Container>
      </section>

      {/* p.15 — A film per place */}
      <section className="bg-cream py-16 md:py-24">
        <Container>
          <div className="space-y-16">
            {pastProjects.map((project, i) => (
              <AnimatedSection key={project.slug} delay={i * 0.08}>
                <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[0.8fr_1fr] md:gap-14">
                  {project.video ? (
                    <video
                      src={project.video}
                      controls
                      playsInline
                      preload="metadata"
                      className="aspect-[3/4] w-full rounded-3xl bg-surface object-cover shadow-lg ring-1 ring-border"
                    />
                  ) : (
                    <div className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-4 rounded-3xl bg-surface shadow-lg ring-1 ring-border">
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cream ring-1 ring-border">
                        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
                          <path
                            d="M8 5.5v13l11-6.5-11-6.5Z"
                            fill="var(--color-secondary)"
                          />
                        </svg>
                      </span>
                      <p className="px-8 text-center font-sans text-sm text-muted">
                        {project.location} video goes here.
                      </p>
                    </div>
                  )}

                  <div>
                    <h2 className="font-display text-4xl font-semibold leading-tight text-heading md:text-5xl">
                      {project.location}
                    </h2>
                    <p className="mt-4 font-sans leading-relaxed text-muted">
                      {project.description}
                    </p>
                    <div className="mt-7">
                      <Link
                        href={`/past-projects/${project.slug}`}
                        className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 font-sans text-sm font-medium text-cream transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      >
                        See the project
                      </Link>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
