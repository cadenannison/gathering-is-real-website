import Link from "next/link";
import Image from "next/image";
import SocialIcon from "@/components/ui/SocialIcon";
import { socials } from "@/data/socials";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/current-project", label: "Current Projects" },
  { href: "/past-projects", label: "Past Projects" },
  { href: "/donate", label: "Donate" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-cream">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="group mb-4 flex w-fit items-center gap-2.5">
              <Image
                src="/images/logos/gatheringLogoCircle.JPG"
                alt="Gathering Is Real logo"
                width={40}
                height={40}
                className="rounded-full object-cover ring-1 ring-border transition-all group-hover:ring-secondary"
              />
              <span className="font-display text-xl font-semibold text-heading">
                Gathering Is Real
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              Connecting people seeking purpose with meaningful service
              opportunities around the world.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
              Navigate
            </p>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-body transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + socials */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
              Get in Touch
            </p>
            <p className="mb-3 text-sm text-muted">
              Have questions or want to get involved?
            </p>
            <Link
              href="/contact"
              className="inline-block rounded-full bg-primary px-5 py-2 text-sm text-cream transition-colors hover:bg-primary-hover"
            >
              Contact Us
            </Link>

            <ul className="mt-7 space-y-3">
              {socials.map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-sm text-body transition-colors hover:text-primary"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-primary ring-1 ring-border transition-colors group-hover:ring-secondary">
                      <SocialIcon platform={social.platform} size={16} />
                    </span>
                    <span className="truncate">{social.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 md:flex-row">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Gathering Is Real. All rights
            reserved.
          </p>
          <p className="text-xs text-muted">
            One minute. Change a life.
          </p>
        </div>
      </div>
    </footer>
  );
}
