"use client";

import { useState } from "react";
import { clsx } from "clsx";
import NoteModal from "@/components/sections/NoteModal";

interface WriteNoteButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function WriteNoteButton({
  className,
  children = "Write a Note",
}: WriteNoteButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={clsx(
          "inline-flex items-center justify-center rounded-full font-sans font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          className ??
            "bg-primary px-8 py-3 text-base text-cream hover:bg-primary-hover"
        )}
      >
        {children}
      </button>
      <NoteModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
