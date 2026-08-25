"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { clsx } from "clsx";

const AUTOPLAY_MS = 5000;

/**
 * The slides carry their message as artwork, so each one's `alt` transcribes
 * the text — otherwise the hero says nothing to a screen reader.
 */
const slides = [
  {
    src: "/images/slideshow/whoarewe.png",
    title: "Who are we?",
    alt: "Who are we? We are a nonprofit organization created to bring more light and love to this world through service. We create the projects and you get to help share that light in any way you can.",
  },
  {
    src: "/images/slideshow/whatcanido.png",
    title: "What can I do?",
    alt: "What can I do? We have created multiple opportunities for you to be able to serve. One: you can come to the service project days we post about. Two: you can leave a place and contact from anywhere in the world you personally would like help sent there. Three: you can pray for specific names and places and leave a note that we will put in the boxes being sent.",
  },
  {
    src: "/images/slideshow/donationsneeded.png",
    title: "Donations needed",
    alt: "Donations needed. Donations to help bring these projects to life are not required but greatly appreciated. More information on what is needed will be posted during projects.",
  },
];

export default function HeroSlideshow() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((next: number) => {
    setIndex((next + slides.length) % slides.length);
  }, []);

  // Depending on `index` restarts the clock whenever the visitor steps through
  // manually, so a slide they just chose always gets its full five seconds.
  useEffect(() => {
    if (paused) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const id = window.setTimeout(
      () => setIndex((i) => (i + 1) % slides.length),
      AUTOPLAY_MS
    );
    return () => window.clearTimeout(id);
  }, [index, paused]);

  const arrowClass =
    "flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface/90 text-heading shadow-sm backdrop-blur transition-colors hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

  return (
    <div
      className="group relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-border"
        aria-roledescription="carousel"
        aria-label="About Gathering Is Real"
      >
        {slides.map((slide, i) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            priority={i === 0}
            aria-hidden={i !== index}
            className={clsx(
              "object-cover transition-opacity duration-700 ease-out motion-reduce:transition-none",
              i === index ? "opacity-100" : "opacity-0"
            )}
          />
        ))}

        {/* Arrows — visible on touch, fade in on pointer devices */}
        <div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous slide"
            className={arrowClass}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M10 3 5 8l5 5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next slide"
            className={arrowClass}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M6 3l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Dots */}
      <div className="mt-5 flex items-center justify-center gap-2.5">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => go(i)}
            aria-label={`Show slide ${i + 1}: ${slide.title}`}
            aria-current={i === index}
            className="group/dot p-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
          >
            <span
              className={clsx(
                "block h-2 rounded-full transition-all duration-300",
                i === index
                  ? "w-7 bg-secondary"
                  : "w-2 bg-border group-hover/dot:bg-muted"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
