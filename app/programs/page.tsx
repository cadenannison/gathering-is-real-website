import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Explore service programs and volunteer opportunities with Gathering Is Real.",
};

const programs = [
  {
    icon: "🤝",
    title: "Community Outreach",
    category: "Ongoing",
    description:
      "Join local teams making a direct impact through hands-on service in your neighborhood. From food pantries to park cleanups, there&apos;s always something happening.",
    commitment: "Flexible — 2–4 hrs/week",
  },
  {
    icon: "✨",
    title: "Mentorship Programs",
    category: "Ongoing",
    description:
      "Guide the next generation by sharing your skills, time, and lived experience. We match mentors with youth and young adults in our partner schools and programs.",
    commitment: "1–2 hrs/week commitment",
  },
  {
    icon: "🌱",
    title: "Relief & Aid",
    category: "As Needed",
    description:
      "Respond to urgent community needs by volunteering with our relief and resource networks. Perfect for those who want to help during moments of crisis or transition.",
    commitment: "On-call or scheduled shifts",
  },
  {
    icon: "📚",
    title: "Literacy & Education",
    category: "Ongoing",
    description:
      "Help adults and children improve their reading, writing, and learning skills. Tutors and reading partners needed across all age groups.",
    commitment: "1–2 hrs/week",
  },
  {
    icon: "🏠",
    title: "Housing Support",
    category: "Ongoing",
    description:
      "Assist individuals and families transitioning to stable housing. Volunteer roles include move-in support, furniture delivery, and administrative help.",
    commitment: "Weekend availability preferred",
  },
  {
    icon: "🎨",
    title: "Arts & Expression",
    category: "Seasonal",
    description:
      "Lead creative workshops, mural projects, and community art events that uplift and connect. Artistic skills or a passion for expression welcome.",
    commitment: "Project-based",
  },
];

export default function ProgramsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-cream py-24 md:py-32">
        <Container narrow>
          <div className="text-center">
            <span className="text-xs font-semibold text-secondary uppercase tracking-widest font-sans">
              Get Involved
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-semibold text-heading mt-4 leading-tight">
              Programs &amp; Opportunities
            </h1>
            <p className="mt-6 text-lg text-muted leading-relaxed font-sans max-w-xl mx-auto">
              Whether you have an hour or a year, a specific skill or an open
              heart — there is a place for you here.
            </p>
          </div>
        </Container>
      </section>

      {/* Grid */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, i) => (
              <AnimatedSection key={program.title} delay={i * 0.08}>
              <Card hover>
                <div className="p-8 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">{program.icon}</span>
                    <span className="text-xs font-semibold text-secondary uppercase tracking-wider font-sans bg-cream px-3 py-1 rounded-full">
                      {program.category}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-heading mb-3">
                    {program.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed font-sans flex-1">
                    {program.description}
                  </p>
                  <div className="mt-6 pt-4 border-t border-border">
                    <p className="text-xs text-muted font-sans">
                      ⏱ {program.commitment}
                    </p>
                  </div>
                </div>
              </Card>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 bg-cream border-t border-border">
        <Container narrow>
          <AnimatedSection>
          <div className="text-center">
            <SectionHeading
              title="Don't see the right fit?"
              subtitle="Reach out — we'll find an opportunity that matches your passions and availability."
              center
            />
            <div className="mt-8">
              <Button href="/contact" size="lg">
                Get in Touch
              </Button>
            </div>
          </div>
          </AnimatedSection>
        </Container>
      </section>
    </>
  );
}
