// Central project data — the ONLY place project content should live. To add
// a new project: drop its image into `public/images/projects/` and append a
// new object below (`slug` becomes the URL at /projects/<slug>). Nothing
// else needs to change — the homepage section and both project pages all
// read from here.
//
// NOTE: Placeholder / dummy copy. Replace name, description, content,
// location, tags and image for each project with real SS Holdings content
// before launch.

export type ProjectStatus = "Completed" | "Ongoing" | "Upcoming";

export interface Project {
  /** Unique URL segment — used at /projects/<slug>. Keep it lowercase, hyphenated. */
  slug: string;
  name: string;
  /** One or two sentences shown on project cards. */
  description: string;
  /** Full project description — one paragraph per array entry. */
  content: string[];
  location: string;
  type: string;
  status: ProjectStatus;
  /** Display year, e.g. "2025". */
  year: string;
  area: string;
  tags: string[];
  /** Path under /public — e.g. "/images/projects/project1.png". */
  image: string;
  /** Shows this project on the homepage's Projects section (max 2 used). */
  featured?: boolean;
}

export const projects: Project[] = [
  {
    slug: "coastal-heights-residency",
    name: "Coastal Heights Residency",
    description:
      "Premium residential apartments overlooking Rushikonda beach, designed for families who want resort-style living as their everyday address.",
    location: "Rushikonda, Visakhapatnam, Andhra Pradesh",
    type: "Premium Residential Apartments",
    status: "Completed",
    year: "2025",
    area: "2.8 Acres",
    tags: ["Residential", "Luxury Living", "Completed"],
    image: "/images/projects/project1.png",
    featured: true,
    content: [
      "Coastal Heights Residency sits minutes from Rushikonda beach, built for buyers who wanted sea-facing living without leaving the conveniences of the city behind. The layout was planned around unobstructed views and cross-ventilation, so the coastal breeze reaches every apartment rather than just the units facing the water.",
      "Each home was finished with large-format vitrified flooring, modular kitchens, and premium bathroom fittings as standard rather than as an upgrade package. Common areas include a landscaped podium garden, a clubhouse, and dedicated visitor parking — details that are easy to skip on paper but matter every single day to the people living there.",
      "Construction followed a strict material and inspection protocol at every stage, from the raft foundation through to final finishing, with third-party structural checks at key milestones. The project was handed over to its first residents in 2025, on schedule and with every unit passing final quality inspection before keys were issued.",
      "Today, Coastal Heights Residency is a fully occupied community of 2.8 acres — a reference point for what SS Holdings means when it talks about building homes rather than just housing units.",
    ],
  },
  {
    slug: "harbour-view-enclave",
    name: "Harbour View Enclave",
    description:
      "A gated residential community in Madhurawada built around wide internal roads, shared green spaces, and long-term neighborhood value.",
    location: "Madhurawada, Visakhapatnam, Andhra Pradesh",
    type: "Gated Residential Community",
    status: "Ongoing",
    year: "2026",
    area: "4.2 Acres",
    tags: ["Residential", "Gated Community", "Ongoing"],
    image: "/images/projects/project2.png",
    featured: true,
    content: [
      "Harbour View Enclave is being developed across 4.2 acres in Madhurawada, one of Visakhapatnam's fastest-growing residential corridors. The master plan sets aside a significant share of the site for internal roads, landscaped open space, and community amenities rather than maximizing built-up area at the expense of everyday livability.",
      "The gated community is being built in phases, with structural work on the first phase already complete and finishing work underway. Each block is designed with generous setbacks, dedicated visitor parking, and a central clubhouse that will anchor the community once possession begins.",
      "Utilities — water, power backup, sewage treatment, and rainwater harvesting — are being planned at the community level from day one, rather than retrofitted after residents move in. This is the same planning discipline SS Holdings applies to every gated development, regardless of scale.",
      "Harbour View Enclave is on track for phased handover starting 2026, with regular construction updates shared with booked homeowners throughout the build.",
    ],
  },
  {
    slug: "green-valley-villas",
    name: "Green Valley Villas",
    description:
      "An upcoming villa community in Bheemili offering larger private plots, independent layouts, and a quieter pace than high-rise living.",
    location: "Bheemili, Visakhapatnam, Andhra Pradesh",
    type: "Luxury Villas",
    status: "Upcoming",
    year: "2027",
    area: "6.5 Acres",
    tags: ["Villas", "Luxury", "Upcoming"],
    image: "/images/projects/project3.png",
    content: [
      "Green Valley Villas is planned across 6.5 acres in Bheemili, designed for buyers who want the space and privacy of an independent home without giving up the security and shared amenities of a planned community.",
      "Each villa plot has been sized generously enough for private outdoor space, and the internal layout has been planned around wider roads, mature tree cover, and a lower overall density than typical villa developments in the area — fewer units, more room to breathe.",
      "Design work and approvals are underway, with site development and infrastructure — internal roads, drainage, landscaping — planned to begin ahead of individual villa construction. Vastu-aligned layouts will be offered across the available plot configurations.",
      "Green Valley Villas is targeted for phased development starting 2027. Early interest is already being registered by families looking to move from apartment living into a villa community without leaving Visakhapatnam.",
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
