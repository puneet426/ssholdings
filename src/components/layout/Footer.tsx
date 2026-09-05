import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { navLinks } from "@/data/nav";
import { siteConfig } from "@/lib/site-config";

// lucide-react dropped its brand icons a while back, so Instagram/YouTube/
// LinkedIn are drawn inline here — same approach as the WhatsApp icon.
interface IconProps {
  className?: string;
  /** Accepted so this shares a call signature with lucide icons; unused by the solid-fill marks. */
  strokeWidth?: number;
}

function InstagramIcon({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a2.999 2.999 0 0 0-2.112-2.117C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.386.524A2.999 2.999 0 0 0 .502 6.186 31.14 31.14 0 0 0 0 12a31.14 31.14 0 0 0 .502 5.814 2.999 2.999 0 0 0 2.112 2.117c1.881.524 9.386.524 9.386.524s7.505 0 9.386-.524a2.999 2.999 0 0 0 2.112-2.117A31.14 31.14 0 0 0 24 12a31.14 31.14 0 0 0-.502-5.814zM9.75 15.568V8.432L15.818 12z" />
    </svg>
  );
}

function LinkedinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const socialLinks = [
  { label: "Instagram", href: siteConfig.social.instagram, icon: InstagramIcon },
  { label: "YouTube", href: siteConfig.social.youtube, icon: YoutubeIcon },
  { label: "LinkedIn", href: siteConfig.social.linkedin, icon: LinkedinIcon },
  { label: "Email", href: `mailto:${siteConfig.contact.email}`, icon: Mail },
];

export function Footer() {
  return (
    <footer className="border-t border-paper/10 bg-charcoal text-paper">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-16">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-paper p-1.5 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.jpg"
                alt="SS Holdings"
                className="h-full w-full rounded-md object-contain"
              />
            </div>
            <p className="font-display mt-4 text-sm font-semibold tracking-[0.15em] text-paper">
              SS&nbsp;HOLDINGS
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-paper/60">
              Designed for spaces that last.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => {
                const isEmail = social.label === "Email";
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target={isEmail ? undefined : "_blank"}
                    rel={isEmail ? undefined : "noopener noreferrer"}
                    aria-label={
                      isEmail
                        ? "Email SS Holdings"
                        : `SS Holdings on ${social.label}`
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/15 text-paper/70 transition-colors hover:border-paper/30 hover:text-paper"
                  >
                    <social.icon className="h-4 w-4" strokeWidth={1.5} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3">
            <p className="text-xs uppercase tracking-[0.25em] text-paper/40">
              Explore
            </p>
            <nav aria-label="Footer" className="mt-4">
              <ul className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-paper/70 transition-colors hover:text-paper"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact + WhatsApp CTA */}
          <div className="md:col-span-4">
            <p className="text-xs uppercase tracking-[0.25em] text-paper/40">
              Get in Touch
            </p>
            <ul className="mt-4 space-y-3 text-sm text-paper/70">
              <li className="flex items-start gap-2.5">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent-soft"
                  strokeWidth={1.5}
                />
                {siteConfig.contact.address}
              </li>
              <li className="flex items-center gap-2.5">
                <Phone
                  className="h-4 w-4 shrink-0 text-accent-soft"
                  strokeWidth={1.5}
                />
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`}
                  className="transition-colors hover:text-paper"
                >
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail
                  className="h-4 w-4 shrink-0 text-accent-soft"
                  strokeWidth={1.5}
                />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="transition-colors hover:text-paper"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
            </ul>

            <a
              href={siteConfig.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 text-sm font-medium text-ink transition-transform hover:scale-[1.03]"
            >
              Enquire on WhatsApp
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-paper/10 pt-6 text-xs leading-relaxed text-paper/50">
          Copyright &copy; {new Date().getFullYear()}. SS Holdings Private
          Limited. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
