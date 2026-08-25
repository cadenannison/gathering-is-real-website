import Image from "next/image";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import AnimatedSection from "@/components/ui/AnimatedSection";
import EmptyPhotoPlaceholder from "@/components/ui/EmptyPhotoPlaceholder";
import { founders } from "@/data/founders";
import { images } from "@/data/media";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Everyone can make a difference even in ONE minute. Learn the story behind Gathering Is Real.",
};

const story = [
  "Gathering Is Real was founded in April of 2026.",
  "Our mission is to help find service opportunities for those looking to find more purpose and bring about more light to the world.",
  "Brooklyn and Maddisyn both served 18 month missions for The Church of Jesus Christ of Latter-day Saints. Ever since returning home in 2025, they have had a burning desire to SERVE MORE. With a lot of prayers they felt inspired to start setting up service projects.",
  "People around the world share places that hold special meaning to them, and Gathering Is Real works to find meaningful ways to serve there.",
  "The idea for the first project came unexpectedly through a conversation on an airplane. A fellow traveler shared his connection to Guam and his plans to return there in May, sparking the idea to find a meaningful way to serve the community. That conversation became the beginning of Gathering Is Real's first service project.",
  "They are excited to help grow awareness to places around the world that don't get as much attention as they deserve and to give more people an outlet to serve.",
];

export default function AboutPage() {
  return (
    <>
      {/* p.6 — Hero */}
      <section className="bg-cream py-24 md:py-32">
        <Container narrow>
          <div className="text-center">
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-secondary">
              About Us
            </span>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-tight text-heading md:text-6xl">
              Who We Are
            </h1>
            <p className="mt-6 font-sans text-lg leading-relaxed text-muted">
              Everyone can make a difference even in{" "}
              <span className="font-semibold text-heading">ONE</span> minute.
              Our mission is to make serving simple by connecting people with
              meaningful opportunities that bring light to lives around the
              world.
            </p>
          </div>
        </Container>
      </section>

      {/* p.7 — Our Story */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-[0.85fr_1fr] md:gap-16">
            <AnimatedSection className="md:sticky md:top-24">
              {images.aboutStory ? (
                <Image
                  src={images.aboutStory}
                  alt="Brooklyn and Maddisyn, the founders of Gathering Is Real"
                  width={1200}
                  height={800}
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="aspect-[3/2] w-full rounded-3xl object-cover shadow-lg ring-1 ring-border"
                />
              ) : (
                <EmptyPhotoPlaceholder
                  label="Photo of Brooklyn and Maddisyn"
                  className="aspect-[3/2] w-full rounded-3xl"
                />
              )}
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <h2 className="font-display text-4xl font-semibold leading-tight text-heading md:text-5xl">
                Our Story
              </h2>
              <div className="mt-7 space-y-5 font-sans leading-relaxed text-muted">
                {story.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-9">
                <Button href="/#map" size="lg">
                  Explore Opportunities
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      {/* p.9 — The Founders */}
      <section className="bg-cream py-20 md:py-28">
        <Container>
          <AnimatedSection>
            <h2 className="text-center font-display text-4xl font-semibold leading-tight text-heading md:text-5xl">
              The Founders
            </h2>
          </AnimatedSection>

          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-2">
            {founders.map((founder, i) => (
              <AnimatedSection key={founder.id} delay={i * 0.1}>
                <figure>
                  {founder.photo ? (
                    <Image
                      src={founder.photo}
                      alt={founder.name}
                      width={720}
                      height={960}
                      sizes="(max-width: 640px) 100vw, 340px"
                      className="aspect-[3/4] w-full rounded-3xl object-cover shadow-md ring-1 ring-border"
                    />
                  ) : (
                    <EmptyPhotoPlaceholder
                      label={`Photo of ${founder.name}`}
                      className="aspect-[3/4] w-full rounded-3xl"
                    />
                  )}
                  <figcaption className="mt-5 text-center">
                    <p className="font-display text-2xl font-semibold text-heading">
                      {founder.name}
                    </p>
                    <p className="mt-1 font-sans text-xs font-semibold uppercase tracking-widest text-secondary">
                      {founder.role}
                    </p>
                  </figcaption>
                </figure>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.2}>
            <div className="mt-14 text-center">
              <Button href="/contact" size="lg">
                Contact Us
              </Button>
            </div>
          </AnimatedSection>
        </Container>
      </section>
    </>
  );
}
