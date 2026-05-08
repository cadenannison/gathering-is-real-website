import Link from "next/link";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

const base =
  "inline-flex items-center justify-center rounded-full font-sans font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-cream hover:bg-primary-hover",
  secondary:
    "bg-transparent border border-primary text-primary hover:bg-primary hover:text-cream",
  ghost: "bg-transparent text-primary hover:underline",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-4 py-1.5",
  md: "text-sm px-6 py-2.5",
  lg: "text-base px-8 py-3",
};

export default function Button({
  variant = "primary",
  size = "md",
  href,
  children,
  className,
  onClick,
  type = "button",
  disabled,
}: ButtonProps) {
  const classes = twMerge(clsx(base, variants[variant], sizes[size], className));

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
