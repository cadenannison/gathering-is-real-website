import Image from "next/image";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import AnimatedSection from "@/components/ui/AnimatedSection";
import EmptyPhotoPlaceholder from "@/components/ui/EmptyPhotoPlaceholder";
import WriteNoteButton from "@/components/sections/WriteNoteButton";
import NotifyForm from "@/components/sections/NotifyForm";
import { currentProject } from "@/data/currentProject";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Current Project",
  description:
    "See the project we're working on right now and the ways you can help.",
};

export default function CurrentProjectPage() {
  const { active, name, location, image, need, who, when } = currentProject;
  const details = [
    { label: "Need", value: need },
    { label: "Who", value: who },
    { label: "When", value: when },
  ];

  return (
    <>
      {/* p.11 — Get involved */}
      <section className="bg-cream py-20 md:py-24">
        <Container narrow>
          <div className="text-center">
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-secondary">
              Current Project
            </span>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-tight text-heading md:text-6xl">
              Get involved
            </h1>
          </div>
        </Container>
      </section>

      {active ? (
        /* p.13 — Project details */
        <section className="py-16 md:py-24">
          <Container>
            <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-14">
              <AnimatedSection>
                {image ? (
                  <Image
                    src={image}
                    alt={location}
                    width={720}
                    height={720}
                    className="aspect-square w-full rounded-3xl object-cover shadow-lg ring-1 ring-border"
                  />
                ) : (
                  <EmptyPhotoPlaceholder
                    label={`Image of ${location}`}
                    className="aspect-square w-full rounded-3xl"
                  />
                )}
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-secondary">
                  {location}
                </p>
                <h2 className="mt-3 font-display text-4xl font-semibold leading-tight text-heading">
                  {name}
                </h2>

                <dl className="mt-8 divide-y divide-border border-y border-border">
                  {details.map((detail) => (
                    <div key={detail.label} className="py-5">
                      <dt className="font-sans text-xs font-semibold uppercase tracking-widest text-secondary">
                        {detail.label}
                      </dt>
                      <dd className="mt-2 font-sans leading-relaxed text-body">
                        {detail.value || (
                          <span className="text-muted">To be announced</span>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-9 flex flex-wrap gap-3">
                  <WriteNoteButton />
                  <Button href="/donate" size="lg">
                    Donate
                  </Button>
                  <Button href="/#map" variant="secondary" size="lg">
                    Go to map
                  </Button>
                </div>
              </AnimatedSection>
            </div>
          </Container>
        </section>
      ) : (
        /* p.11 — Coming soon */
        <section className="py-16 md:py-24">
          <Container narrow>
            <AnimatedSection>
              <div className="rounded-3xl border border-border bg-surface px-8 py-14 text-center md:py-16">
                {image && (
                  <Image
                    src={image}
                    alt=""
                    width={512}
                    height={512}
                    sizes="200px"
                    className="mx-auto mb-8 h-40 w-40 md:h-48 md:w-48"
                  />
                )}
                <p className="font-display text-3xl text-heading md:text-4xl">
                  {name}:
                </p>
                <p className="mt-3 font-display text-4xl font-semibold uppercase tracking-wide text-secondary md:text-5xl">
                  Coming Soon
                </p>
                <p className="mx-auto mt-6 max-w-md font-sans leading-relaxed text-muted">
                  We&apos;re lining up where we serve next. Recommend a place,
                  or leave a note for the people we&apos;ll be helping.
                </p>
                <div className="mt-9 flex flex-wrap justify-center gap-3">
                  <WriteNoteButton />
                  <Button href="/#map" variant="secondary" size="lg">
                    Go to map
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          </Container>
        </section>
      )}

      {/* p.11 — Notify signup */}
      <section className="bg-cream py-16 md:py-20">
        <Container>
          <AnimatedSection>
            <NotifyForm />
          </AnimatedSection>
        </Container>
      </section>
    </>
  );
}
