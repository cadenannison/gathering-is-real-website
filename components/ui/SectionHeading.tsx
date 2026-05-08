import { clsx } from "clsx";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = false,
  className,
}: SectionHeadingProps) {
  return (
    <div className={clsx(center && "text-center", className)}>
      {eyebrow && (
        <p className="text-xs font-semibold text-secondary uppercase tracking-widest mb-3 font-sans">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-4xl md:text-5xl font-semibold text-heading leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-muted text-lg leading-relaxed font-sans max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
