"use client";

import { useState } from "react";
import { currentProject } from "@/data/currentProject";

type Status = "idle" | "loading" | "success" | "error";

const inputClass =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 font-sans text-sm text-body placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary transition";

const labelClass =
  "block font-sans text-xs font-semibold uppercase tracking-widest text-muted mb-2";

/** Where the note is headed — the place the current project is running. */
function destination() {
  const { location } = currentProject;
  if (!location || /^to be announced$/i.test(location)) {
    return "Our next project";
  }
  return location;
}

interface NoteFormProps {
  onDone?: () => void;
}

export default function NoteForm({ onDone }: NoteFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const to = destination();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = {
      type: "note" as const,
      to,
      note: (form.elements.namedItem("note") as HTMLTextAreaElement).value,
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      fromPlace: (form.elements.namedItem("fromPlace") as HTMLInputElement)
        .value,
    };

    try {
      const res = await fetch("/api/submit", {
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

  if (status === "success") {
    return (
      <div className="py-8 text-center">
        <h3 className="mb-2 font-display text-3xl font-semibold text-heading">
          Your note is on its way.
        </h3>
        <p className="font-sans text-muted">
          We&apos;ll carry it with us to {to.toLowerCase()}.
        </p>
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 font-sans text-sm font-medium text-cream transition-colors hover:bg-primary-hover"
          >
            Close
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="font-display text-3xl font-semibold text-heading">
          Write a note
        </h2>
        <p className="mt-1 font-sans text-sm leading-relaxed text-muted">
          Leave a sweet note you&apos;d like to give to those we help.
        </p>
      </div>

      {/* To — set by the project, shown so the writer knows their audience */}
      <div className="flex items-center gap-3 rounded-xl bg-cream px-4 py-3">
        <span className="font-sans text-xs font-semibold uppercase tracking-widest text-muted">
          To
        </span>
        <span className="font-display text-lg font-semibold text-heading">
          {to}
        </span>
      </div>

      <div>
        <label htmlFor="note" className={labelClass}>
          Your note
        </label>
        <textarea
          id="note"
          name="note"
          rows={5}
          required
          placeholder="Write something kind…"
          className={inputClass}
        />
      </div>

      <div className="border-t border-border pt-5">
        <p className={labelClass}>From</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Your name"
            aria-label="Your name"
            className={inputClass}
          />
          <input
            id="fromPlace"
            name="fromPlace"
            type="text"
            required
            placeholder="Where you live"
            aria-label="Where you live"
            className={inputClass}
          />
        </div>
      </div>

      {status === "error" && (
        <p className="font-sans text-sm text-red-700">
          That didn&apos;t send. Check your connection and try again.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center rounded-full bg-primary px-8 py-3 font-sans text-sm font-medium text-cream transition-colors hover:bg-primary-hover disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Send note"}
      </button>
    </form>
  );
}
