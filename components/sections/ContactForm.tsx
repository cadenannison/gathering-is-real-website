"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-border bg-surface px-4 py-3 text-body font-sans text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary transition";

  return (
    <div className="bg-cream rounded-3xl border border-border p-8 md:p-12">
      {status === "success" ? (
        <div className="text-center py-8">
          <span className="text-4xl block mb-4">✉️</span>
          <h2 className="font-display text-3xl font-semibold text-heading mb-2">
            Message Sent!
          </h2>
          <p className="text-muted font-sans">
            Thank you for reaching out. We&apos;ll get back to you soon.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold text-muted uppercase tracking-widest font-sans mb-2"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Your name"
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-muted uppercase tracking-widest font-sans mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="your@email.com"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-xs font-semibold text-muted uppercase tracking-widest font-sans mb-2"
            >
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              required
              placeholder="What is this about?"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-xs font-semibold text-muted uppercase tracking-widest font-sans mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              required
              placeholder="Tell us what's on your mind..."
              className={inputClass}
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-red-600 font-sans">
              Something went wrong. Please try again or email us directly.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full font-sans font-medium text-sm px-8 py-3 bg-primary text-cream hover:bg-primary-hover transition-colors disabled:opacity-60"
          >
            {status === "loading" ? "Sending…" : "Send Message"}
          </button>
        </form>
      )}
    </div>
  );
}
