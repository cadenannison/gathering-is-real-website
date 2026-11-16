import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import InstagramEmbeds from "@/components/sections/InstagramEmbeds";
import { getEmbeds } from "@/lib/instagram";
import { instagram } from "@/data/instagram";
import { socials } from "@/data/socials";
import { trendingItems } from "@/data/trendingItems";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Trending",
  description: "Hand-picked posts from the Gathering Is Real Instagram.",
};

// Rebuild at most hourly; each post's oEmbed fetch is cached for the same period.
export const revalidate = 3600;

export default async function TrendingPage() {
  const embeds = await getEmbeds();
  const now = Date.now();
  const live = trendingItems.filter((t) => Date.parse(t.expiresAt) > now);
  const past = trendingItems
    .filter((t) => Date.parse(t.expiresAt) <= now)
    .sort((a, b) => Date.parse(b.expiresAt) - Date.parse(a.expiresAt));
  const ig = socials.find((s) => s.platform === "instagram");

  return (
    <>
      <section className="bg-cream py-24 md:py-32">
        <Container narrow>
          <div className="text-center">
            <span className="text-xs font-semibold text-secondary uppercase tracking-widest font-sans">
              On Instagram
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-semibold text-heading mt-4 leading-tight">
              Trending
            </h1>
            <p className="mt-6 text-lg text-muted leading-relaxed font-sans max-w-xl mx-auto">
              A few of our favorite moments, straight from @{instagram.handle}.
            </p>
          </div>
        </Container>
      </section>

      {live.length > 0 && (
        <section className="pt-20 md:pt-24">
          <Container>
            <div className="flex flex-wrap justify-center gap-10">
              {live.map((t) => (
                <figure key={t.id} className="w-full max-w-md">
                  <Image
                    src={t.image}
                    alt={t.alt}
                    width={1086}
                    height={1448}
                    sizes="(min-width: 768px) 448px, 100vw"
                    priority
                    className="h-auto w-full rounded-2xl border border-border shadow-sm"
                  />
                  {t.link && (
                    <figcaption className="mt-4 text-center">
                      <a
                        href={t.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-primary text-cream px-6 py-2.5 rounded-full text-sm font-sans hover:bg-primary-hover transition-colors"
                      >
                        {t.link.label}
                      </a>
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="py-20 md:py-24">
        <Container>
          {embeds.length > 0 ? (
            <InstagramEmbeds items={embeds} />
          ) : (
            <div className="mx-auto max-w-xl rounded-2xl border border-border bg-cream p-10 text-center">
              <h2 className="font-display text-3xl font-semibold text-heading">
                Follow us on Instagram
              </h2>
              <p className="mt-4 text-muted font-sans">
                See what we&apos;re up to at @{instagram.handle}.
              </p>
              {ig && (
                <a
                  href={ig.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-block bg-primary text-cream px-6 py-2.5 rounded-full text-sm font-sans hover:bg-primary-hover transition-colors"
                >
                  Follow {ig.handle}
                </a>
              )}
            </div>
          )}
        </Container>
      </section>

      {past.length > 0 && (
        <section className="border-t border-border bg-cream py-16">
          <Container>
            <h2 className="font-display text-3xl font-semibold text-heading">Past events</h2>
            <p className="mt-2 text-sm text-muted font-sans">Scroll sideways to look back.</p>
            <ul
              className="mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4"
              aria-label="Past events"
              tabIndex={0}
            >
              {past.map((t) => (
                <li key={t.id} className="w-56 shrink-0 snap-start">
                  <Image
                    src={t.image}
                    alt={t.alt}
                    width={1086}
                    height={1448}
                    sizes="224px"
                    className="h-auto w-full rounded-xl border border-border opacity-90"
                  />
                  <p className="mt-3 text-sm font-semibold text-heading font-sans">{t.title}</p>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </>
  );
}
