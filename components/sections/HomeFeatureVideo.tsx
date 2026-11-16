import Container from "@/components/ui/Container";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { media } from "@/data/media";

/** Featured video under the hero. Renders nothing when media.homeFeature.src is null. */
export default function HomeFeatureVideo() {
  const { label, src, poster, caption } = media.homeFeature;
  if (!src) return null;

  return (
    <section className="py-14 md:py-20">
      <Container narrow>
        <AnimatedSection>
          <p className="text-center font-sans text-xs font-semibold uppercase tracking-widest text-secondary">
            {label}
          </p>
          <video
            className="mt-4 w-full rounded-3xl bg-black shadow-lg ring-1 ring-border"
            controls
            playsInline
            preload="metadata"
            poster={poster ?? undefined}
            src={src}
          />
          {caption && (
            <p className="mt-4 text-center font-sans leading-relaxed text-muted">
              {caption}
            </p>
          )}
        </AnimatedSection>
      </Container>
    </section>
  );
}
