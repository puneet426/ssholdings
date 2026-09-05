"use client";

import { useEffect, useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { navLinks } from "@/data/nav";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-500 ${
          scrolled
            ? "bg-charcoal/90 backdrop-blur-md border-b border-paper/10"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <nav
            className="flex items-center justify-between h-20"
            aria-label="Primary"
          >
            <a
              href="/#top"
              className="font-display font-semibold tracking-[0.15em] text-sm sm:text-base text-paper"
            >
              SS&nbsp;HOLDINGS
            </a>

            <ul className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm tracking-wide text-paper/80 transition-colors hover:text-paper"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4">
              <button
                type="button"
                aria-label="Search"
                className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-paper transition-colors hover:bg-paper/10"
              >
                <Search className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
                className="flex md:hidden h-9 w-9 items-center justify-center rounded-full text-paper transition-colors hover:bg-paper/10"
              >
                {menuOpen ? (
                  <X className="h-5 w-5" strokeWidth={1.5} />
                ) : (
                  <Menu className="h-5 w-5" strokeWidth={1.5} />
                )}
              </button>
            </div>
          </nav>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
