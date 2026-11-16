"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Container from "@/components/ui/Container";
import AnimatedSection from "@/components/ui/AnimatedSection";
import type { Announcement } from "@/data/announcements";

function endOf(a: Announcement): number | null {
  const iso = a.kind === "event" ? a.endsAt : a.expiresAt;
  if (!iso) return null;
  const t = Date.parse(iso);
  return Number.isNaN(t) ? null : t;
}

function startOf(a: Announcement): number {
  const t = a.startsAt ? Date.parse(a.startsAt) : NaN;
  return Number.isNaN(t) ? Infinity : t;
}

export function currentAnnouncements(items: Announcement[], now: number) {
  return items
    .filter((a) => {
      const end = endOf(a);
      return end === null || end > now;
    })
    .sort((a, b) => startOf(a) - startOf(b));
}

/**
 * Pages are static, so `buildTime` is only the first guess. After the page
 * loads we re-check against the visitor's clock, which hides expired items
 * without a redeploy.
 */
export default function AnnouncementsSection({
  items,
  buildTime,
  className = "py-14 md:py-16",
}: {
  items: Announcement[];
  buildTime: number;
  className?: string;
}) {
  const [now, setNow] = useState(buildTime);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const current = currentAnnouncements(items, now);
  if (current.length === 0) return null;

  return (
    <section id="announcements" className={className}>
      <Container narrow>
        <AnimatedSection>
          <p className="text-center font-sans text-xs font-semibold uppercase tracking-widest text-secondary">
            Announcements
          </p>
          <ul className="mt-6 space-y-5">
            {current.map((a) => (
              <li
                key={a.id}
                className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm"
              >
                {a.image && (
                  <Image
                    src={a.image}
                    alt=""
                    width={960}
                    height={480}
                    sizes="(min-width: 768px) 768px, 100vw"
                    className="aspect-[2/1] w-full object-cover"
                  />
                )}
                <div className="p-6 md:p-8">
                  <p className="font-sans text-xs font-semibold uppercase tracking-widest text-secondary">
                    {a.kind === "event" ? "Event" : "News"}
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-semibold leading-tight text-heading md:text-3xl">
                    {a.title}
                  </h2>
                  {a.body && (
                    <p className="mt-3 font-sans leading-relaxed text-body">
                      {a.body}
                    </p>
                  )}
                  {a.details && a.details.length > 0 && (
                    <ul className="mt-4 space-y-1 font-sans text-sm leading-relaxed text-body">
                      {a.details.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  )}
                  {a.link && (
                    <a
                      href={a.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex rounded-full bg-primary px-5 py-2.5 font-sans text-sm font-semibold text-cream transition-colors hover:opacity-90"
                    >
                      {a.link.label}
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </AnimatedSection>
      </Container>
    </section>
  );
}
