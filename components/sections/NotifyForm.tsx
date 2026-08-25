"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function NotifyForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "notify", email }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
      <p className="font-display text-2xl leading-snug text-heading md:text-3xl">
        Get notified on all our current and upcoming projects.
      </p>

      <div>
        {status === "success" ? (
          <p className="font-sans text-base text-heading">
            You&apos;re on the list — we&apos;ll be in touch when the next
            project is ready.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <input
              id="notify-email"
              name="email"
              type="email"
              required
              placeholder="Type your email"
              aria-label="Email address"
              className="w-full rounded-full border border-border bg-surface px-5 py-3 font-sans text-sm text-body placeholder:text-muted transition focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="shrink-0 rounded-full bg-primary px-8 py-3 font-sans text-sm font-medium text-cream transition-colors hover:bg-primary-hover disabled:opacity-60"
            >
              {status === "loading" ? "Sending…" : "Notify me"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="mt-3 font-sans text-sm text-red-700">
            That didn&apos;t send. Check your connection and try again.
          </p>
        )}
      </div>
    </div>
  );
}
