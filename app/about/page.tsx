import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about the mission, story, and team behind Gathering Is Real.",
};

const values = [
  {
    icon: "🌟",
    title: "Purpose",
    description:
      "We believe everyone carries a unique gift. Service is one of the most powerful ways to discover and express it.",
  },
  {
    icon: "🤝",
    title: "Community",
    description:
      "Real change happens when people come together. We exist to facilitate those connections.",
  },
  {
    icon: "💛",
    title: "Light",
    description:
      "Every act of service adds light to the world. We are committed to multiplying that light.",
  },
];

const team = [
  {
    id: "founder",
    name: "Team Member",
    role: "Founder & Executive Director",
    bio: "Passionate about connecting people to purpose-driven work in their communities.",
  },
  {
    id: "programs-director",
    name: "Team Member",
    role: "Programs Director",
    bio: "Oversees our service programs and ensures every volunteer has a meaningful experience.",
  },
  {
    id: "outreach-lead",
    name: "Team Member",
    role: "Community Outreach Lead",
    bio: "Builds relationships with partner organizations and community stakeholders.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-cream py-24 md:py-32">
        <Container narrow>
          <div className="text-center">
            <span className="text-xs font-semibold text-secondary uppercase tracking-widest font-sans">
              About Us
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-semibold text-heading mt-4 leading-tight">
              Who We Are
            </h1>
            <p className="mt-6 text-lg text-muted leading-relaxed font-sans">
              Gathering Is Real was born from a simple belief: that people who
              want to serve just need a place to begin. We make that beginning
              as easy as possible.
            </p>
          </div>
        </Container>
      </section>

      {/* Story */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="bg-cream rounded-3xl p-12 aspect-square flex items-center justify-center">
              <p className="font-display text-6xl text-center text-secondary leading-none">
                "Bringing<br />more light<br />to the world."
              </p>
            </div>
            <div>
              <SectionHeading
                eyebrow="Our Story"
                title="Built on the belief that service transforms."
              />
              <div className="mt-6 space-y-4 text-muted font-sans leading-relaxed">
                <p>
                  Gathering Is Real started as a small group of friends who
                  wanted to volunteer but didn&apos;t know where to start. The
                  opportunities were out there — they just weren&apos;t easy to
                  find.
                </p>
                <p>
                  We built Gathering Is Real to change that. Today, we connect
                  volunteers with vetted service opportunities, support partner
                  organizations, and foster a community rooted in purpose and
                  generosity.
                </p>
                <p>
                  Whether you have one hour or one day, a specialized skill or
                  just a willing heart — there&apos;s a place for you here.
                </p>
              </div>
              <div className="mt-8">
                <Button href="/programs">Explore Opportunities</Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28 bg-cream">
        <Container>
          <SectionHeading
            eyebrow="What We Stand For"
            title="Our Values"
            center
            className="mb-12"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value) => (
              <Card key={value.title}>
                <div className="p-8 text-center">
                  <span className="text-4xl block mb-4">{value.icon}</span>
                  <h3 className="font-display text-2xl font-semibold text-heading mb-3">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed font-sans">
                    {value.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Team */}
      <section className="py-20 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="The People"
            title="Our Team"
            subtitle="We are a small, dedicated team committed to making service accessible to everyone."
            center
            className="mb-12"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member) => (
              <Card key={member.id} hover>
                <div className="p-8">
                  <div className="w-16 h-16 rounded-full bg-cream border-2 border-border mb-5" />
                  <h3 className="font-display text-xl font-semibold text-heading">
                    {member.name}
                  </h3>
                  <p className="text-xs text-secondary font-semibold uppercase tracking-wider font-sans mt-1 mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-muted leading-relaxed font-sans">
                    {member.bio}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20 bg-cream border-t border-border">
        <Container narrow>
          <div className="text-center">
            <h2 className="font-display text-4xl font-semibold text-heading">
              Ready to get involved?
            </h2>
            <p className="mt-4 text-muted font-sans">
              Browse opportunities or reach out to our team.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/programs" size="lg">
                Find Opportunities
              </Button>
              <Button href="/contact" variant="secondary" size="lg">
                Contact Us
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
