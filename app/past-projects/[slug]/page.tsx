import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import EmptyPhotoPlaceholder from "@/components/ui/EmptyPhotoPlaceholder";
import { pastProjects } from "@/data/pastProjects";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return pastProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = pastProjects.find((p) => p.slug === slug);
  return {
    title: project ? project.location : "Past Project",
    description: project?.description,
  };
}

export default async function PastProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = pastProjects.find((p) => p.slug === slug);

  if (!project) notFound();

  return (
    <section className="py-10 md:py-14">
      <Container>
        <Link
          href="/past-projects"
          className="inline-flex items-center gap-2 font-sans text-sm text-muted transition-colors hover:text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span aria-hidden>←</span> All past projects
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          {/* p.16 left — the photo collage, scrolling on its own */}
          <div className="lg:max-h-[78vh] lg:overflow-y-auto lg:pr-3">
            {project.photos.length === 0 ? (
              <EmptyPhotoPlaceholder
                label={`${project.location} photos go here`}
                className="aspect-[4/5] w-full rounded-3xl"
              />
            ) : (
              <div className="columns-2 gap-4 [column-fill:_balance]">
                {project.photos.map((photo, i) => (
                  <div
                    key={photo}
                    className="mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-border"
                  >
                    <Image
                      src={photo}
                      alt={`${project.location} — photo ${i + 1}`}
                      width={640}
                      height={800}
                      className="h-auto w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* p.16 right — the description */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-secondary">
              Description of project
            </p>
            <h1 className="mt-3 font-display text-5xl font-semibold uppercase leading-none tracking-tight text-heading md:text-6xl">
              {project.location}
            </h1>

            <ul className="mt-8 space-y-4 border-t border-border pt-8">
              <li className="flex items-baseline gap-4">
                <span className="font-display text-4xl font-semibold text-heading tabular-nums">
                  ${project.amountRaised.toLocaleString()}
                </span>
                <span className="font-sans text-sm uppercase tracking-widest text-muted">
                  Raised
                </span>
              </li>
              <li>
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-secondary">
                  Who you impacted
                </p>
                <p className="mt-1 font-sans text-lg text-body">
                  {project.impacted}
                </p>
              </li>
              <li>
                <p className="font-sans leading-relaxed text-muted">
                  {project.description}
                </p>
              </li>
            </ul>

            <p className="mt-12 font-display text-4xl font-semibold text-secondary md:text-5xl">
              Thank you!
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
