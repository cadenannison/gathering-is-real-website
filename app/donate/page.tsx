import Image from "next/image";
import Container from "@/components/ui/Container";
import AnimatedSection from "@/components/ui/AnimatedSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Give through Venmo or Zeffy and help bring more light to the world.",
};

const methods = [
  {
    key: "venmo",
    eyebrow: "Donate via Venmo",
    handle: "@Gatheringisreal",
    blurb:
      "Scan the code or open Venmo and send your donation directly. Include a note — we love hearing why you give.",
    qr: "/images/qr/venmo.png",
    href: "https://venmo.com/code?user_id=4667423261197681885&created=1787176974.037128&printed=1",
    cta: "Open Venmo",
  },
  {
    key: "zeffy",
    eyebrow: "Donate via Zeffy",
    handle: "Donate to Change Lives",
    blurb:
      "Give by card through Zeffy. Every cent reaches the project — Zeffy takes no platform fee.",
    qr: "/images/qr/zeffy.svg",
    href: "https://www.zeffy.com/en-US/donation-form/donate-to-change-lives-20730",
    cta: "Open Zeffy",
  },
];

export default function DonatePage() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <AnimatedSection>
          <div className="text-center">
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-secondary">
              Support the Mission
            </span>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-tight text-heading md:text-6xl">
              Two ways to give
            </h1>
          </div>
        </AnimatedSection>

        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          {methods.map((method, i) => (
            <AnimatedSection key={method.key} delay={i * 0.1}>
              <div className="flex h-full flex-col items-center rounded-3xl border border-border bg-cream p-8 text-center md:p-10">
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-secondary">
                  {method.eyebrow}
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold text-heading">
                  {method.handle}
                </h2>
                <p className="mt-4 max-w-xs font-sans text-sm leading-relaxed text-muted">
                  {method.blurb}
                </p>

                <Image
                  src={method.qr}
                  alt={`QR code to donate via ${method.key}`}
                  width={180}
                  height={180}
                  className="my-8 h-44 w-44 rounded-2xl border border-border bg-white p-2"
                />

                <a
                  href={method.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 font-sans text-base font-medium text-cream transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  {method.cta} →
                </a>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-md text-center font-sans text-xs leading-relaxed text-muted">
          Gathering Is Real is a registered non-profit. Donations may be
          tax-deductible — consult your tax advisor.
        </p>
      </Container>
    </section>
  );
}
