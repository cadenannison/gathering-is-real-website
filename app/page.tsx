import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Gathering Is Real connects people seeking purpose with meaningful service opportunities in their communities.",
};

const programs = [
  {
    title: "Community Outreach",
    description:
      "Join local teams making a direct impact through hands-on service in your neighborhood.",
    icon: "🤝",
  },
  {
    title: "Mentorship Programs",
    description:
      "Guide the next generation by sharing your skills, time, and lived experience.",
    icon: "✨",
  },
  {
    title: "Relief & Aid",
    description:
      "Respond to urgent community needs by volunteering with our relief and resource networks.",
    icon: "🌱",
  },
];

const stats = [
  { value: "200+", label: "Volunteers" },
  { value: "30+", label: "Partner Organizations" },
  { value: "50+", label: "Events Per Year" },
  { value: "5", label: "Cities Served" },
];

const events = [
  {
    title: "Spring Service Day",
    date: "May 17, 2026",
    location: "Downtown Community Center",
    description:
      "A full day of hands-on volunteering across the city — food drives, park cleanups, and more.",
  },
  {
    title: "Volunteer Orientation",
    date: "May 24, 2026",
    location: "Online (Zoom)",
    description:
      "New to Gathering Is Real? Learn how to get involved and find your first service opportunity.",
  },
  {
    title: "Neighbor Night",
    date: "June 7, 2026",
    location: "Riverside Park",
    description:
      "An evening of community, food, and shared purpose. All are welcome.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-cream overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-40 flex flex-col items-center text-center">
          <span className="text-xs font-semibold text-secondary uppercase tracking-widest mb-6 font-sans">
            Non-Profit · Community · Purpose
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-semibold text-heading leading-tight max-w-4xl">
            Find Your Way{" "}
            <span className="text-secondary">to Serve</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted max-w-2xl leading-relaxed font-sans">
            Gathering Is Real connects people seeking purpose with meaningful
            service opportunities — bringing more light to the world, one act
            at a time.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/programs" size="lg">
              Find Opportunities
            </Button>
            <Button href="/about" variant="secondary" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <SectionHeading
                eyebrow="Our Mission"
                title="Purpose is a gift meant to be shared."
                subtitle="We believe everyone has something to offer. Gathering Is Real exists to help you find where your gifts meet the world's needs."
              />
              <div className="mt-8">
                <Button href="/about">Our Story</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-cream rounded-2xl p-6 text-center border border-border"
                >
                  <p className="font-display text-4xl font-semibold text-heading">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-muted font-sans">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Programs */}
      <section className="py-20 md:py-28 bg-cream">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <SectionHeading
              eyebrow="What We Do"
              title="Programs & Opportunities"
              subtitle="Find a place to serve that aligns with your heart and schedule."
            />
            <Button href="/programs" variant="secondary" className="shrink-0">
              View All Programs
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {programs.map((program) => (
              <Card key={program.title} hover>
                <div className="p-8">
                  <span className="text-3xl block mb-4">{program.icon}</span>
                  <h3 className="font-display text-2xl font-semibold text-heading mb-3">
                    {program.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed font-sans">
                    {program.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Events */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <SectionHeading
              eyebrow="Upcoming"
              title="Events & Gatherings"
              subtitle="Join us in person and online."
            />
            <Button href="/events" variant="secondary" className="shrink-0">
              All Events
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.title} hover>
                <div className="p-6">
                  <p className="text-xs font-semibold text-secondary uppercase tracking-widest font-sans mb-3">
                    {event.date}
                  </p>
                  <h3 className="font-display text-xl font-semibold text-heading mb-2">
                    {event.title}
                  </h3>
                  <p className="text-xs text-muted font-sans mb-3">
                    📍 {event.location}
                  </p>
                  <p className="text-sm text-muted leading-relaxed font-sans">
                    {event.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Donate CTA */}
      <section className="py-20 md:py-28 bg-primary">
        <Container>
          <div className="text-center">
            <p className="text-xs font-semibold text-accent uppercase tracking-widest font-sans mb-4">
              Support the Mission
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-cream leading-tight max-w-2xl mx-auto">
              Help us bring more light to the world.
            </h2>
            <p className="mt-5 text-cream/70 max-w-xl mx-auto font-sans leading-relaxed">
              Your generosity makes it possible for us to connect people,
              organize events, and grow our reach in communities that need it
              most.
            </p>
            <div className="mt-10">
              <Button
                href="/donate"
                size="lg"
                className="bg-accent text-primary hover:bg-accent-light"
              >
                Donate via Venmo
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
