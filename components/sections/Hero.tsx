import Image from "next/image";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import HeroSlideshow from "@/components/sections/HeroSlideshow";

/**
 * Home hero. Logo and headline sit on the left, the slideshow on the right.
 * The headline is set in two weights on purpose — a small, quiet input
 * ("One minute.") against a large outcome ("Change a life.").
 */
export default function Hero() {
  return (
    <section className="relative bg-cream overflow-hidden">
      {/* Warm ambient wash behind the media side */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/4 h-[36rem] w-[36rem] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, #E8A820 0%, #C97B35 45%, transparent 72%)",
        }}
      />

      <Container className="relative">
        <div className="grid grid-cols-1 items-center gap-14 py-20 md:min-h-[86vh] md:grid-cols-[1.05fr_1fr] md:gap-16 md:py-24 lg:gap-24">
          {/* Left — logo, headline, single call to action */}
          <div>
            <Image
              src="/images/logos/gatheringLogoCircle.JPG"
              alt="Gathering Is Real"
              width={132}
              height={132}
              priority
              className="h-24 w-24 rounded-full object-cover shadow-lg ring-4 ring-surface md:h-32 md:w-32"
            />

            <h1 className="mt-8 font-display text-heading">
              <span className="block text-4xl font-light leading-[1.1] tracking-tight text-secondary md:text-5xl">
                One minute.
              </span>
              <span className="mt-1 block text-6xl font-bold leading-[1.02] tracking-tight md:text-7xl lg:text-8xl">
                Change a life.
              </span>
            </h1>

            <p className="mt-7 max-w-md font-sans text-lg leading-relaxed text-muted">
              Gathering Is Real connects people seeking purpose with meaningful
              service opportunities — bringing more light to the world, one act
              at a time.
            </p>

            <div className="mt-10">
              <Button href="#help" size="lg" className="px-10 py-4 text-base tracking-wide">
                Help Now
              </Button>
            </div>
          </div>

          {/* Right — the slideshow */}
          <div className="relative">
            <HeroSlideshow />
          </div>
        </div>

        {/* Scroll cue */}
        <a
          href="#map"
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 font-sans text-muted transition-colors hover:text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:flex"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M8 4v8M4 8l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </Container>
    </section>
  );
}
