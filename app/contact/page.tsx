import Container from "@/components/ui/Container";
import ContactForm from "@/components/sections/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Gathering Is Real team.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-cream py-24 md:py-32">
        <Container narrow>
          <div className="text-center">
            <span className="text-xs font-semibold text-secondary uppercase tracking-widest font-sans">
              Reach Out
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-semibold text-heading mt-4 leading-tight">
              Get in Touch
            </h1>
            <p className="mt-6 text-lg text-muted leading-relaxed font-sans max-w-xl mx-auto">
              Have a question, want to partner with us, or just want to say
              hello? We&apos;d love to hear from you.
            </p>
          </div>
        </Container>
      </section>

      {/* Form */}
      <section className="py-20 md:py-28">
        <Container narrow>
          <ContactForm />
        </Container>
      </section>
    </>
  );
}
