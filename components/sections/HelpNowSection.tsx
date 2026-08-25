"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import NoteModal from "@/components/sections/NoteModal";
import { media } from "@/data/media";

/**
 * Glyphs drawn from the organisation's own vocabulary rather than stock icons:
 * a note, a place on a map, and a hand holding the sun from the logo.
 */
function NoteGlyph() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
      <path
        d="M8 9h20v22l-6-4-6 4-8-5V9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M13 16h10M13 21h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M27 22.5 33.5 16a2 2 0 0 0-2.8-2.8L24 19.5V23h3.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlaceGlyph() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
      <path
        d="M20 34c6-7.5 9-12.6 9-16.5a9 9 0 1 0-18 0C11 21.4 14 26.5 20 34Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="17" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M20 9.5v-2M20 26.5v2M27.5 17h2M10.5 17h-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GiveGlyph() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
      <circle cx="20" cy="14" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M20 5v-1.5M20 24.5V26M29 14h1.5M9.5 14H8M26.4 7.6l1-1M12.6 21.4l-1 1M26.4 20.4l1 1M12.6 6.6l-1-1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7 30c3.5-2.5 6.5-2 9 0h5.5a2 2 0 0 1 0 4H16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.5 32.5h5l6-3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface Option {
  key: string;
  label: string;
  blurb: string;
  glyph: React.ReactNode;
  video: string | null;
  href?: string;
}

const options: Option[] = [
  {
    key: "note",
    label: "Write a note",
    blurb: "Send encouragement to the people we're serving right now.",
    glyph: <NoteGlyph />,
    video: media.help.note,
  },
  {
    key: "current",
    label: "Learn about our current project",
    blurb: "See where we're headed next and what's needed.",
    glyph: <PlaceGlyph />,
    video: media.help.currentProject,
    href: "/current-project",
  },
  {
    key: "donate",
    label: "Donate",
    blurb: "Every dollar goes straight into the project.",
    glyph: <GiveGlyph />,
    video: media.help.donate,
    href: "/donate",
  },
];

function OptionBody({ option }: { option: Option }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  function play() {
    const el = videoRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    void el.play().catch(() => {});
  }

  function stop() {
    const el = videoRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
  }

  return (
    <div
      onMouseEnter={play}
      onMouseLeave={stop}
      onFocus={play}
      onBlur={stop}
      className="group/card relative flex h-full min-h-[22rem] flex-col justify-end overflow-hidden rounded-3xl border border-border bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:border-secondary hover:shadow-xl md:min-h-[26rem]"
    >
      {/* Resting state — warm wash plus the glyph */}
      <div
        aria-hidden
        className="absolute inset-0 transition-opacity duration-300 group-hover/card:opacity-0"
        style={{
          background:
            "linear-gradient(160deg, #FBF3E6 0%, #F5EDE0 55%, #EFE2CE 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute left-7 top-7 text-secondary transition-opacity duration-300 group-hover/card:opacity-0"
      >
        {option.glyph}
      </div>

      {/* Hover state — the film */}
      {option.video && (
        <video
          ref={videoRef}
          src={option.video}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
        />
      )}
      {option.video && (
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/25 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
        />
      )}

      <div className="relative">
        <h3
          className={
            "font-display text-3xl font-semibold leading-tight text-heading transition-colors duration-300 md:text-[2rem]" +
            (option.video ? " group-hover/card:text-cream" : "")
          }
        >
          {option.label}
        </h3>
        <p
          className={
            "mt-2 font-sans text-sm leading-relaxed text-muted transition-colors duration-300" +
            (option.video ? " group-hover/card:text-cream/80" : "")
          }
        >
          {option.blurb}
        </p>
      </div>
    </div>
  );
}

export default function HelpNowSection() {
  const [noteOpen, setNoteOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {options.map((option) =>
          option.href ? (
            <Link
              key={option.key}
              href={option.href}
              className="rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
            >
              <OptionBody option={option} />
            </Link>
          ) : (
            <button
              key={option.key}
              type="button"
              onClick={() => setNoteOpen(true)}
              className="rounded-3xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
            >
              <OptionBody option={option} />
            </button>
          )
        )}
      </div>

      <NoteModal open={noteOpen} onClose={() => setNoteOpen(false)} />
    </>
  );
}
