"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";

const EVENT = "themechange";

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

// The <html data-theme> attribute is the source of truth on the client — the
// inline script in the layout <head> has already set it from localStorage
// before this component ever renders.
function readDom(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}

// SSR (and the first client render, to match it) assumes the documented
// default. React swaps in the real value right after hydration.
function readDefault(): Theme {
  return "dark";
}

function stored(): Theme {
  try {
    const t = localStorage.getItem("theme");
    if (t === "light" || t === "dark") return t;
  } catch {
    /* private mode / blocked storage */
  }
  return "dark";
}

function apply(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  window.dispatchEvent(new Event(EVENT));
}

/**
 * Dark / light switch. Flash avoidance is handled by the inline script in the
 * root layout's <head>; this only mirrors the current choice and writes the
 * next one back.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, readDom, readDefault);

  // In dev, React's Strict Mode remounts once and resets <html> to the
  // attributes it manages from JSX — wiping what the inline script set. Put
  // the stored choice back. No-op in production, and never a state update.
  useEffect(() => {
    const want = stored();
    if (document.documentElement.getAttribute("data-theme") !== want) {
      apply(want);
    }
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    apply(next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* preference just won't persist */
    }
  }

  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      }
      className={
        className ??
        "flex h-9 w-9 items-center justify-center rounded-full text-fg transition-colors hover:bg-fg/10"
      }
    >
      <Icon className="h-4 w-4" strokeWidth={1.5} />
    </button>
  );
}
