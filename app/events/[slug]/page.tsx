import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event",
};

export default function EventDetailPage() {
  return (
    <section className="py-24 md:py-32">
      <Container narrow>
        <Button href="/events" variant="ghost" className="mb-8 text-sm">
          ← Back to Events
        </Button>
        <span className="text-xs font-semibold text-secondary uppercase tracking-widest font-sans">
          Event
        </span>
        <h1 className="font-display text-5xl font-semibold text-heading mt-3 mb-6 leading-tight">
          Event Title
        </h1>
        <div className="flex flex-wrap gap-6 text-sm text-muted font-sans mb-10 pb-10 border-b border-border">
          <span>📅 Date</span>
          <span>🕐 Time</span>
          <span>📍 Location</span>
        </div>
        <div className="prose max-w-none text-body font-sans leading-relaxed">
          <p>Event details will appear here once connected to Sanity CMS.</p>
        </div>
        <div className="mt-12">
          <Button href="/contact" size="lg">
            Register / RSVP
          </Button>
        </div>
      </Container>
    </section>
  );
}
