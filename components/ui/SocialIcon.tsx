import type { SocialPlatform } from "@/data/socials";

const paths: Record<SocialPlatform, React.ReactNode> = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  facebook: (
    <>
      <circle cx="12" cy="12" r="9.25" />
      <path d="M14.6 8.2h-1.4c-.9 0-1.4.5-1.4 1.4v1.6h2.6l-.4 2.6h-2.2v6" />
      <path d="M9.6 11.2h2" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.3 9.4v5.2l4.6-2.6-4.6-2.6Z" fill="currentColor" stroke="none" />
    </>
  ),
};

interface SocialIconProps {
  platform: SocialPlatform;
  size?: number;
  className?: string;
}

export default function SocialIcon({
  platform,
  size = 24,
  className,
}: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {paths[platform]}
    </svg>
  );
}
