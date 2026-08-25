import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface EmptyPhotoPlaceholderProps {
  shape?: "circle" | "rect";
  label?: string;
  className?: string;
}

export default function EmptyPhotoPlaceholder({
  shape = "rect",
  label,
  className,
}: EmptyPhotoPlaceholderProps) {
  if (shape === "circle") {
    return (
      <div
        className={twMerge(
          clsx(
            "flex h-16 w-16 items-center justify-center rounded-full border-2 border-border bg-cream",
            className
          )
        )}
      >
        {label && (
          <span className="px-1 text-center font-sans text-[10px] text-muted">
            {label}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={twMerge(
        clsx(
          "flex aspect-square w-full items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface",
          className
        )
      )}
    >
      {label && (
        <p className="px-6 text-center font-sans text-sm text-muted">{label}</p>
      )}
    </div>
  );
}
