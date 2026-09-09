import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BackToHomeProps {
  /**
   * Home-page section id this page belongs to — the Ongoing listing goes back
   * to the Ongoing section, the gallery to the showcase it opens from. Left
   * unset it returns to the top, for a page with no section of its own.
   */
  section?: string;
}

/**
 * "Back to Home" that lands on the section this page came from rather than at
 * the top of the page. The home page opens on a pinned walk-through that has
 * to be scrubbed all the way to its end before the page scrolls, so returning
 * to `/` means walking it again to get back to where you were reading.
 */
export function BackToHome({ section = "top" }: BackToHomeProps) {
  return (
    <Link
      href={`/#${section}`}
      className="inline-flex items-center gap-2 text-sm text-fg/60 transition-colors hover:text-fg"
    >
      <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
      Back to Home
    </Link>
  );
}
