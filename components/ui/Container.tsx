import { clsx } from "clsx";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
}

export default function Container({
  children,
  className,
  narrow = false,
}: ContainerProps) {
  return (
    <div
      className={clsx(
        "mx-auto px-6",
        narrow ? "max-w-3xl" : "max-w-6xl",
        className
      )}
    >
      {children}
    </div>
  );
}
