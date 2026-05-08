import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support Gathering Is Real and help us bring more light to the world.",
};

const impact = [
  { amount: "$10", description: "Covers supplies for one volunteer shift" },
  { amount: "$25", description: "Helps host a community orientation event" },
  { amount: "$50", description: "Sponsors a volunteer for an entire month" },
  { amount: "$100", description: "Funds a community service event from start to finish" },
];

export default function DonatePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-primary py-24 md:py-32">
        <Container narrow>
          <div className="text-center">
            <span className="text-xs font-semibold text-accent uppercase tracking-widest font-sans">
              Support the Mission
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-semibold text-cream mt-4 leading-tight">
              Help Bring More<br />Light to the World
            </h1>
            <p className="mt-6 text-lg text-cream/70 leading-relaxed font-sans max-w-xl mx-auto">
              Every dollar you give helps us connect more people to meaningful
              service — and to the purpose they&apos;ve been looking for.
            </p>
          </div>
        </Container>
      </section>

      {/* Venmo */}
      <section className="py-20 md:py-28">
        <Container narrow>
          <div className="bg-cream rounded-3xl border border-border p-10 md:p-16 text-center">
            <p className="text-xs font-semibold text-secondary uppercase tracking-widest font-sans mb-4">
              Donate via Venmo
            </p>
            <h2 className="font-display text-4xl font-semibold text-heading mb-3">
              @GatheringIsReal
            </h2>
            <p className="text-muted font-sans mb-8">
              Tap below to open Venmo and send your donation directly.
              Include a note — we love hearing why you give.
            </p>

            {/* Venmo QR placeholder */}
            <div className="mx-auto w-48 h-48 bg-surface rounded-2xl border-2 border-dashed border-border flex items-center justify-center mb-8">
              <p className="text-xs text-muted font-sans text-center px-4">
                Venmo QR Code<br />(add venmo-qr.png to /public)
              </p>
            </div>

            <a
              href="https://venmo.com/GatheringIsReal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full font-sans font-medium text-base px-8 py-3 bg-primary text-cream hover:bg-primary-hover transition-colors"
            >
              Open Venmo →
            </a>

            <p className="mt-6 text-xs text-muted font-sans">
              Gathering Is Real is a registered non-profit. Donations may be
              tax-deductible — consult your tax advisor.
            </p>
          </div>
        </Container>
      </section>

      {/* Impact */}
      <section className="py-16 bg-cream border-t border-border">
        <Container>
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-semibold text-heading">
              Your Gift Makes an Impact
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {impact.map((item) => (
              <div
                key={item.amount}
                className="bg-surface rounded-2xl border border-border p-6 text-center"
              >
                <p className="font-display text-4xl font-semibold text-heading mb-2">
                  {item.amount}
                </p>
                <p className="text-sm text-muted font-sans leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Other ways */}
      <section className="py-20">
        <Container narrow>
          <div className="text-center">
            <h2 className="font-display text-3xl font-semibold text-heading mb-4">
              Other Ways to Give
            </h2>
            <p className="text-muted font-sans mb-8">
              Not a Venmo user? Reach out and we&apos;ll find another way to
              accept your support.
            </p>
            <Button href="/contact" variant="secondary">
              Contact Us
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
