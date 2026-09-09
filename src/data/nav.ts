export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: "Showcase", href: "/#project-showcase" },
  { label: "Why Us", href: "/#why" },
  { label: "Projects", href: "/projects" },
  // Blog is hidden from the nav for now — the /blogs routes still work,
  // so re-adding this entry brings it back to the header, mobile menu
  // and footer at once.
  // { label: "Blog", href: "/blogs" },
  { label: "Contact", href: "/#contact" },
];
