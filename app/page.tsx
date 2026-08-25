import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Hero from "@/components/sections/Hero";
import RecommendPlaceSection from "@/components/sections/RecommendPlaceSection";
import HelpNowSection from "@/components/sections/HelpNowSection";
import { pastProjects } from "@/data/pastProjects";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "One minute. Change a life. Gathering Is Real connects people seeking purpose with meaningful service opportunities around the world.",
};

export default function HomePage() {
  return (
    <>
      {/* p.1 — Hero */}
      <Hero />

      {/* p.2 — Recommend a place */}
      <section id="map" className="scroll-mt-16 py-20 md:py-28">
        <Container>
          <AnimatedSection>
            <RecommendPlaceSection pastProjects={pastProjects} />
          </AnimatedSection>
        </Container>
      </section>

      {/* p.3 — How can you help now? */}
      <section id="help" className="scroll-mt-16 bg-cream py-20 md:py-28">
        <Container>
          <AnimatedSection>
            <h2 className="text-center font-display text-4xl font-semibold leading-tight text-heading md:text-5xl">
              How can you help now?
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1} className="mt-12">
            <HelpNowSection />
          </AnimatedSection>
        </Container>
      </section>

      {/* p.3 — Mission statement */}
      <section className="py-20 md:py-24">
        <Container narrow>
          <AnimatedSection>
            <div className="text-center">
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-secondary">
                Mission Statement
              </p>
              <p className="mt-6 font-display text-2xl leading-snug text-heading md:text-3xl">
                Everyone can make a difference even in{" "}
                <span className="font-semibold">ONE</span> minute. Our mission is
                to make serving simple by connecting people with meaningful
                opportunities that bring light to lives around the world.
              </p>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* p.5 — Thank you */}
      <section className="bg-primary py-20 md:py-28">
        <Container narrow>
          <AnimatedSection>
            <div className="text-center">
              <h2 className="font-display text-4xl font-semibold leading-tight text-cream md:text-5xl">
                Thank you for your support!
              </h2>
              <p className="mt-4 font-display text-2xl text-accent md:text-3xl">
                One minute. Change a life.
              </p>
              <div className="mt-10">
                <Button
                  href="/contact"
                  size="lg"
                  className="bg-cream text-primary hover:bg-accent-light"
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>
    </>
  );
}
