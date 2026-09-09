"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/data/nav";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileMenu } from "./MobileMenu";

interface HeaderProps {
  /**
   * The page opens with the 3D hero under the bar (only the home page does).
   * While the bar floats over that room it wears the FIXED paper/charcoal
   * chrome — the room is lit the same way in both themes, so the themed
   * near-black text read badly against it in daylight. Passed as a prop rather
   * than sniffed on mount so the server renders the right colours first time.
   */
  overHero?: boolean;
}

// The hero is one 100svh section; once the visitor has scrolled it past the
// bar (h-20) the walk-through is over and the bar is on the page's own ground,
// where the themed tokens — black text in daylight — are the right ones.
const BAR_H = 80;

export function Header({ overHero = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [onHero, setOnHero] = useState(overHero);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const hero = overHero ? document.getElementById("top") : null;
    // Cached: reading offsetHeight inside the scroll handler would measure
    // across the 3D canvas on every event.
    let heroBottom = hero ? hero.offsetHeight - BAR_H : 0;

    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      setOnHero(hero ? window.scrollY < heroBottom : false);
    };
    const onResize = () => {
      if (hero) heroBottom = hero.offsetHeight - BAR_H;
      onScroll();
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [overHero]);

  // The mobile panel is fixed dark whatever the theme, and the bar sits above
  // it — so an open menu puts the bar on a dark ground too, wherever the page
  // happens to be scrolled to.
  const onDark = onHero || menuOpen;

  const background = menuOpen
    ? "bg-charcoal"
    : onDark
      ? scrolled
        ? "bg-charcoal/85 backdrop-blur-md border-b border-paper/10"
        : "bg-gradient-to-b from-ink/55 via-ink/20 to-transparent"
      : scrolled
        ? "bg-bg/90 backdrop-blur-md border-b border-fg/10"
        : "bg-transparent";

  const button = `flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
    onDark ? "text-paper hover:bg-paper/10" : "text-fg hover:bg-fg/10"
  }`;

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-500 ${background}`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <nav
            className="flex items-center justify-between h-20"
            aria-label="Primary"
          >
            <a
              href="/#top"
              className={`font-display font-semibold tracking-[0.15em] text-sm sm:text-base transition-colors duration-500 ${
                onDark ? "text-paper" : "text-fg"
              }`}
            >
              SS&nbsp;HOLDINGS
            </a>

            <ul className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`text-sm tracking-wide transition-colors ${
                      onDark
                        ? "text-paper/80 hover:text-paper"
                        : "text-fg/80 hover:text-fg"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle className={button} />
              <button
                type="button"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
                className={`md:hidden ${button}`}
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
