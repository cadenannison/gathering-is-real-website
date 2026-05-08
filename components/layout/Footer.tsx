import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/events", label: "Events" },
  { href: "/blog", label: "Blog" },
  { href: "/donate", label: "Donate" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="bg-cream border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <Image
                src="/images/logos/gatheringLogoCircle.JPG"
                alt="Gathering Is Real logo"
                width={40}
                height={40}
                className="rounded-full object-cover ring-1 ring-border group-hover:ring-secondary transition-all"
              />
              <span className="font-display text-xl font-semibold text-heading">
                Gathering Is Real
              </span>
            </Link>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              Connecting people seeking purpose with meaningful service
              opportunities in their communities.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-4">
              Navigate
            </p>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-body hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-4">
              Get in Touch
            </p>
            <p className="text-sm text-muted mb-3">
              Have questions or want to get involved?
            </p>
            <Link
              href="/contact"
              className="inline-block text-sm bg-primary text-cream px-5 py-2 rounded-full hover:bg-primary-hover transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Gathering Is Real. All rights
            reserved.
          </p>
          <p className="text-xs text-muted">
            A non-profit committed to purpose, community, and light.
          </p>
        </div>
      </div>
    </footer>
  );
}
