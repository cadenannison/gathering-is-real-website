import Image from "next/image";
import SocialIcon from "@/components/ui/SocialIcon";
import { socials } from "@/data/socials";

/**
 * p.20 — "Follow Along". Each row pairs the account with a scannable code, so
 * the block works on a laptop and on a phone held up to a screen.
 */
export default function SocialLinks() {
  return (
    <ul className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-surface">
      {socials.map((social) => (
        <li key={social.platform}>
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-5 px-6 py-5 transition-colors hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:px-8"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cream text-primary ring-1 ring-border">
              <SocialIcon platform={social.platform} size={22} />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block font-sans text-xs font-semibold uppercase tracking-widest text-secondary">
                {social.label}
              </span>
              <span className="mt-0.5 block truncate font-display text-xl font-semibold text-heading">
                {social.handle}
              </span>
            </span>

            <Image
              src={social.qr}
              alt={`QR code linking to ${social.label}`}
              width={72}
              height={72}
              className="hidden h-16 w-16 shrink-0 rounded-lg border border-border bg-white p-1 sm:block"
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
