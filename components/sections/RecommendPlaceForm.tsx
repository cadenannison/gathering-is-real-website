"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Status = "idle" | "loading" | "success" | "error";

interface RecommendPlaceFormProps {
  open: boolean;
  /** Pre-fills the Place field when the visitor clicked a country. */
  initialPlace?: string;
  onClose: () => void;
}

const inputClass =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 font-sans text-sm text-body placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary transition";

const labelClass =
  "block font-sans text-xs font-semibold uppercase tracking-widest text-muted mb-2";

export default function RecommendPlaceForm({
  open,
  initialPlace = "",
  onClose,
}: RecommendPlaceFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [place, setPlace] = useState(initialPlace);
  const [planningToTravel, setPlanningToTravel] = useState<"yes" | "no">("no");

  // Re-seed the Place field each time the dialog opens on a new country.
  useEffect(() => {
    if (open) setPlace(initialPlace);
  }, [open, initialPlace]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = {
      type: "recommend" as const,
      place,
      reason: (form.elements.namedItem("reason") as HTMLTextAreaElement).value,
      planningToTravel,
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone:
        (form.elements.namedItem("phone") as HTMLInputElement)?.value ||
        undefined,
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

  function handleClose() {
    setStatus("idle");
    setPlanningToTravel("no");
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-100 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-heading/40 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Recommend a place"
            className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-border bg-surface p-8 md:p-10"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="absolute right-5 top-5 text-muted transition-colors hover:text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
            >
              ✕
            </button>

            {status === "success" ? (
              <div className="py-8 text-center">
                <h2 className="mb-2 font-display text-3xl font-semibold text-heading">
                  Thank you!
                </h2>
                <p className="font-sans text-muted">
                  We&apos;ve received your recommendation and will be in touch.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 font-sans text-sm font-medium text-cream transition-colors hover:bg-primary-hover"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="font-display text-3xl font-semibold text-heading">
                    Recommend a place
                  </h2>
                  <p className="mt-1 font-sans text-sm text-muted">
                    Tell us about somewhere that matters to you.
                  </p>
                </div>

                <div>
                  <label htmlFor="place" className={labelClass}>
                    Place
                  </label>
                  <input
                    id="place"
                    name="place"
                    type="text"
                    required
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    placeholder="Country, city, or region"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="reason" className={labelClass}>
                    Reason / significance
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    rows={4}
                    required
                    placeholder="Why does this place matter?"
                    className={inputClass}
                  />
                </div>

                <fieldset>
                  <legend className={labelClass}>
                    Do you have plans to travel there within the upcoming year?
                  </legend>
                  <div className="flex gap-6">
                    {(["yes", "no"] as const).map((value) => (
                      <label
                        key={value}
                        className="flex items-center gap-2 font-sans text-sm capitalize text-body"
                      >
                        <input
                          type="radio"
                          name="planningToTravel"
                          value={value}
                          checked={planningToTravel === value}
                          onChange={() => setPlanningToTravel(value)}
                          className="accent-[var(--color-primary)]"
                        />
                        {value}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="border-t border-border pt-5">
                  <p className={labelClass}>Contact information</p>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Name"
                        aria-label="Name"
                        className={inputClass}
                      />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="Email address"
                        aria-label="Email address"
                        className={inputClass}
                      />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Phone number (optional)"
                      aria-label="Phone number"
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
                  {status === "loading" ? "Sending…" : "Send recommendation"}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
