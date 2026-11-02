export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: "Gallery", href: "/#project-showcase" },
  { label: "Why Us", href: "/#why" },
  // Goes straight to the flagship project rather than the Completed listing.
  { label: "Projects", href: "/projects/ss-courtyard" },
  // Blog is hidden from the nav for now — the /blogs routes still work,
  // so re-adding this entry brings it back to the header, mobile menu
  // and footer at once.
  // { label: "Blog", href: "/blogs" },
  { label: "Contact", href: "/#contact" },
];
