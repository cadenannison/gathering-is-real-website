"use client";

import { clsx } from "clsx";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({
  children,
  className,
  hover = false,
}: CardProps) {
  if (hover) {
    return (
      <motion.div
        whileHover={{ scale: 1.015, y: -4 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={clsx(
          "bg-surface rounded-2xl border border-border overflow-hidden",
          "transition-shadow hover:shadow-lg hover:border-secondary",
          className
        )}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={clsx(
        "bg-surface rounded-2xl border border-border overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );
}
