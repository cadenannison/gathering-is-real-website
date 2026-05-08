import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming events and gatherings with Gathering Is Real.",
};

const upcomingEvents = [
  {
    slug: "spring-service-day",
    title: "Spring Service Day",
    date: "May 17, 2026",
    time: "9:00 AM – 4:00 PM",
    location: "Downtown Community Center",
    category: "Service",
    description:
      "A full day of hands-on volunteering across the city — food drives, park cleanups, meal packing, and more. Come for an hour or stay all day.",
  },
  {
    slug: "volunteer-orientation",
    title: "Volunteer Orientation",
    date: "May 24, 2026",
    time: "11:00 AM – 12:30 PM",
    location: "Online (Zoom)",
    category: "Orientation",
    description:
      "New to Gathering Is Real? Attend a free online orientation to learn how to get involved and find your first service opportunity.",
  },
  {
    slug: "neighbor-night",
    title: "Neighbor Night",
    date: "June 7, 2026",
    time: "6:00 PM – 9:00 PM",
    location: "Riverside Park",
    category: "Community",
    description:
      "An evening of community, food, and shared purpose. Bring your family. All are welcome.",
  },
  {
    slug: "literacy-workshop",
    title: "Literacy Volunteer Workshop",
    date: "June 14, 2026",
    time: "10:00 AM – 12:00 PM",
    location: "Central Library, Room 204",
    category: "Training",
    description:
      "Learn how to become a reading partner or adult literacy tutor. Training provided. No experience necessary.",
  },
];

const categoryColors: Record<string, string> = {
  Service: "bg-primary/10 text-primary",
  Orientation: "bg-accent/20 text-heading",
  Community: "bg-secondary/10 text-secondary",
  Training: "bg-cream text-muted border border-border",
};

export default function EventsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-cream py-24 md:py-32">
        <Container narrow>
          <div className="text-center">
            <span className="text-xs font-semibold text-secondary uppercase tracking-widest font-sans">
              Join Us
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-semibold text-heading mt-4 leading-tight">
              Events &amp; Gatherings
            </h1>
            <p className="mt-6 text-lg text-muted leading-relaxed font-sans max-w-xl mx-auto">
              From service days to community nights, there&apos;s always
              something happening. Find your next gathering below.
            </p>
          </div>
        </Container>
      </section>

      {/* Events */}
      <section className="py-20 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="Upcoming"
            title="What&apos;s Coming Up"
            className="mb-10"
          />
          <div className="space-y-5">
            {upcomingEvents.map((event, i) => (
              <AnimatedSection key={event.slug} delay={i * 0.08}>
              <Card hover>
                <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
                  {/* Date block */}
                  <div className="shrink-0 w-20 text-center">
                    <p className="font-display text-3xl font-semibold text-heading leading-none">
                      {event.date.split(" ")[1].replace(",", "")}
                    </p>
                    <p className="text-xs text-muted font-sans mt-1">
                      {event.date.split(" ")[0]}
                    </p>
                  </div>

                  <div className="w-px h-12 bg-border hidden md:block shrink-0" />

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-display text-xl font-semibold text-heading">
                        {event.title}
                      </h3>
                      <span
                        className={`text-xs font-semibold px-3 py-0.5 rounded-full font-sans ${categoryColors[event.category] ?? "bg-cream text-muted"}`}
                      >
                        {event.category}
                      </span>
                    </div>
                    <p className="text-xs text-muted font-sans mb-2">
                      🕐 {event.time} &nbsp;·&nbsp; 📍 {event.location}
                    </p>
                    <p className="text-sm text-muted leading-relaxed font-sans">
                      {event.description}
                    </p>
                  </div>
                </div>
              </Card>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
