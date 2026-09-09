// Central project data — the ONLY place project content should live. To add
// a project: drop its image into `public/images/projects/` and append an
// object below (`slug` becomes the URL at /projects/<slug>). The homepage
// sections, the /projects listing and the detail pages all read from here.
//
// Each homepage section shows the two projects flagged `featured` for its
// status; every project appears on /projects under its status heading.

export type ProjectStatus = "Completed" | "Ongoing";

export interface SpecItem {
  name: string;
  detail: string;
}

export interface SpecGroup {
  title: string;
  items: SpecItem[];
}

export interface Project {
  /** Unique URL segment — used at /projects/<slug>. Lowercase, hyphenated. */
  slug: string;
  name: string;
  location: string;
  status: ProjectStatus;
  /** Build time in months — recorded for completed projects. */
  constructionMonths?: number;
  /** Home sizes as listed by sales, e.g. "3 BHK: 1,300 sq. ft." */
  homeSizes: string[];
  /** Scale facts shown alongside the sizes, e.g. "40 Homes". */
  scale?: string[];
  /** Full description — one paragraph per entry. */
  content: string[];
  /** Path under /public — e.g. "/images/projects/project1.png". */
  image: string;
  /** One of the two projects shown for its status on the homepage. */
  featured?: boolean;
  /** The flagship project: brochure + full specification sheet. */
  specialFocus?: boolean;
  /** Path under /public to the brochure PDF. */
  brochure?: string;
  /**
   * Path under /public to the typical-floor plan drawing. Shown full width
   * above the brochure link — it is a line drawing, so the detail page plates
   * it on white rather than cropping it to the hero's 16:9.
   */
  floorPlan?: string;
  specs?: SpecGroup[];
}

export const projects: Project[] = [
  {
    slug: "ss-orchids",
    name: "SS Orchids",
    location: "Pothinamallayya Palem",
    status: "Completed",
    constructionMonths: 16,
    homeSizes: ["3 BHK: 1,300 sq. ft."],
    image: "/images/projects/project1.png",
    featured: true,
    content: [
      "SS Orchids brings together a great location, thoughtful design and comfortable living. Set close to NH-16, with a park nearby and easy access to key parts of Visakhapatnam, it offers the convenience of city living while retaining a calm residential feel.",
      "The project offers 3 BHK homes of 1,300 sq. ft., planned to make everyday living comfortable and practical. With well-proportioned rooms, balconies and thoughtfully arranged living spaces, each home is designed to feel open, bright and easy to live in.",
      "With its elegant architecture, peaceful surroundings and focus on everyday comfort, SS Orchids is designed for families looking for a warm, modern home with lasting value. It brings together the essentials of good living: a convenient location, comfortable spaces and the quality you expect from an SS Holdings home.",
    ],
  },
  {
    slug: "ss-harmony",
    name: "SS Harmony",
    location: "Yendada",
    status: "Completed",
    constructionMonths: 18,
    homeSizes: ["3 BHK: 2,110 & 2,070 sq. ft."],
    image: "/images/projects/project2.png",
    featured: true,
    content: [
      "Set between Yendada and Rushikonda, SS Harmony offers a peaceful home in one of Visakhapatnam's sought-after residential areas. With Rushikonda Beach, IT SEZ, schools, hospitals, temples (Iskcon and TTD Temples) and everyday conveniences close by, you get the best of a quiet neighbourhood without giving up connectivity.",
      "Designed for comfortable and spacious family living, SS Harmony brings together thoughtful layouts, generous balconies and well-planned spaces that let natural light and fresh air flow through the home. With Vastu-compliant planning and a calm residential setting, every home is designed to feel open, peaceful and welcoming.",
      "More than just a well-connected address, SS Harmony is designed to give you a refined and comfortable way of living. Beautiful architecture, quality construction and peaceful surroundings come together to create a home where you can slow down, relax and enjoy everyday life.",
    ],
  },
  {
    slug: "avadhani-legacy",
    name: "Avadhani Legacy",
    location: "East Point Colony",
    status: "Completed",
    constructionMonths: 18,
    homeSizes: ["3 BHK: 2,105 & 2,030 sq. ft."],
    image: "/images/projects/project3.png",
    content: [
      "Set in East Point Colony, just 2 mins from Beach Road, Avadhani Legacy brings together the calm of a peaceful residential neighbourhood and the convenience of being close to schools, hospitals, shopping and entertainment. Nestled beside a vast open space, the project is designed to offer a quiet and pleasant living experience.",
      "The homes are spacious 3 BHK residences of 2,030 and 2,105 sq. ft., thoughtfully planned for natural light, cross-ventilation and comfortable everyday living. With Vastu-compliant planning, generous balconies and well-planned interiors, every home is designed to feel open, warm and welcoming.",
    ],
  },
  {
    slug: "ss-parkview",
    name: "SS Parkview",
    location: "Midhilapuri Colony",
    status: "Completed",
    constructionMonths: 15,
    homeSizes: ["2 BHK: 1,110 sq. ft.", "3 BHK: 1,510 sq. ft."],
    image: "/images/projects/project1.png",
    content: [
      "SS Park View is designed as a peaceful family home, bringing together modern architecture, comfortable spaces and a calm residential setting. With easy access to NH-16 and Madhurawada's growing surroundings, it offers the convenience of the city while giving you a comfortable place to come home to.",
      "Thoughtfully planned for comfortable family living, the homes offer well-sized bedrooms, spacious living and dining areas, balconies and practical everyday spaces. The design focuses on natural light, ventilation and an easy flow between spaces, creating a home that feels open, bright and welcoming.",
      "With a clean, contemporary design and a strong focus on everyday comfort, SS Park View brings together quality, convenience and peaceful living. It is a home designed for families who value a calm environment, thoughtful planning and the simple pleasure of coming home to a place that feels right.",
    ],
  },
  {
    slug: "ss-pearl",
    name: "SS Pearl",
    location: "Midhilapuri Colony",
    status: "Completed",
    constructionMonths: 15,
    // TODO: home sizes and description for SS Pearl were not supplied — the
    // card and detail page fall back to location and build time until they are.
    homeSizes: [],
    image: "/images/projects/project2.png",
    content: [],
  },
  {
    slug: "ss-courtyard",
    name: "SS Courtyard",
    location: "Madhurawada",
    status: "Ongoing",
    homeSizes: [
      "2 BHK: 1,190, 1,280 & 1,210 sq. ft.",
      "3 BHK: 1,465 & 1,790 sq. ft.",
    ],
    scale: ["40 Homes", "2 Blocks"],
    image: "/images/projects/project3.png",
    featured: true,
    brochure: "/images/projects/ss-courtyard.pdf",
    floorPlan: "/images/projects/sscourtA.jpeg",
    content: [
      "SS Courtyard is designed as a comfortable family home, combining thoughtful planning with quality construction and a peaceful residential setting. Practical layouts and a warm atmosphere make it a place where everyday living feels easy, comfortable and welcoming.",
    ],
    specs: [
      {
        title: "Structure",
        items: [
          {
            name: "Earthquake-Resistant RCC Structure",
            detail: "Designed for greater structural safety and stability.",
          },
          {
            name: "Solid Red Brick Walls",
            detail: "Strong, durable walls for a solid and dependable home.",
          },
          {
            name: "Smooth Internal Plaster & Putty Finish",
            detail: "Gives walls a clean, refined finish.",
          },
        ],
      },
      {
        title: "Painting",
        items: [
          {
            name: "Premium Acrylic Interior Paint",
            detail: "Smooth finish that keeps your interiors looking fresh.",
          },
          {
            name: "Weather-Proof Exterior Paint",
            detail:
              "Better protection for the building exterior against weather conditions.",
          },
        ],
      },
      {
        title: "Flooring & Wall Finish",
        items: [
          {
            name: "Large 800 × 1600 mm GVT Tiles",
            detail:
              "Creates a spacious, modern and premium look with fewer visible joints.",
          },
          {
            name: "Anti-Skid Balcony Tiles",
            detail: "Added grip for safer everyday use.",
          },
          {
            name: "Non-Slip Bathroom Flooring",
            detail: "Helps provide better safety in wet areas.",
          },
          {
            name: "Finished Common Areas",
            detail:
              "Granite/GVT flooring gives corridors and staircases a clean, premium look.",
          },
        ],
      },
      {
        title: "Doors & Windows",
        items: [
          {
            name: "Teak-Framed Main Door",
            detail:
              "A strong and premium entrance that adds to the character of your home.",
          },
          {
            name: "Quality Door Hardware",
            detail: "Smooth, reliable and convenient everyday use.",
          },
          {
            name: "UPVC Sliding Windows with Mosquito Mesh",
            detail:
              "Easy operation, ventilation and added protection from insects.",
          },
          {
            name: "3-Track Sliding System",
            detail:
              "Allows smoother movement and better flexibility when opening windows.",
          },
        ],
      },
      {
        title: "Bathrooms",
        items: [
          {
            name: "Jaguar / Parryware Fittings",
            detail: "Trusted brands for reliable everyday performance.",
          },
          {
            name: "Hot & Cold Shower Mixers",
            detail: "Convenient temperature control in every bathroom.",
          },
          {
            name: "Jaguar / RAK / Kohler Sanitaryware",
            detail: "Quality fixtures for a refined bathroom experience.",
          },
        ],
      },
      {
        title: "Electrical",
        items: [
          {
            name: "Concealed Copper Wiring",
            detail: "Safer, cleaner wiring hidden within the walls.",
          },
          {
            name: "Branded Switches",
            detail: "Reliable switches for everyday use.",
          },
          {
            name: "Dedicated Appliance Points",
            detail:
              "Ready points for geysers, chimney, refrigerator, microwave, oven, purifier and washing machine.",
          },
          {
            name: "AC Provision in Bedrooms",
            detail:
              "Makes AC installation easier without major electrical changes.",
          },
          {
            name: "3-Phase Power Supply",
            detail: "Supports higher electrical loads efficiently.",
          },
          {
            name: "TV, Telephone & Internet Points",
            detail:
              "Convenient connectivity in the Master Bedroom and Drawing Room.",
          },
        ],
      },
      {
        title: "Power Backup",
        items: [
          {
            name: "20 KVA DG Backup Per Flat",
            detail:
              "Keeps essential services running during power interruptions.",
          },
        ],
      },
      {
        title: "Lift",
        items: [
          {
            name: "Kone Passenger Lift",
            detail: "Convenient access up to the 5th floor.",
          },
        ],
      },
      {
        title: "Security",
        items: [
          {
            name: "CCTV in Ground Floor & Corridors",
            detail: "Adds an extra layer of security and peace of mind.",
          },
        ],
      },
    ],
  },
  {
    slug: "jagannadha-signature",
    name: "Jagannadha Signature",
    location: "East Point Colony",
    status: "Ongoing",
    homeSizes: ["3 BHK: 2,320 sq. ft."],
    image: "/images/projects/project1.png",
    featured: true,
    content: [
      "Jagannadha Signature brings modern luxury to a peaceful residential setting, located close to Beach Road in East Point Colony area. With VUDA Park, the beach, schools and everyday conveniences nearby, it offers the comfort of being well connected while still giving you a calm place to come home to.",
      "The project offers spacious 3 BHK homes of 2,320 sq. ft., thoughtfully planned to give families generous living spaces and a comfortable flow between rooms. With Vastu-compliant planning, large balconies and well-designed interiors, every home is created to feel open, peaceful and welcoming.",
      "Designed around modern, luxurious living, Jagannadha Signature combines privacy, comfort and a refined sense of space. From the carefully planned homes to the peaceful surroundings and convenient location, it is a place designed not just to live in, but to slow down, feel at ease and enjoy coming home every day.",
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/** Every project with the given status, in listing order. */
export function projectsByStatus(status: ProjectStatus): Project[] {
  return projects.filter((project) => project.status === status);
}

/** The (up to two) projects shown for a status on the homepage. */
export function featuredByStatus(status: ProjectStatus): Project[] {
  return projectsByStatus(status)
    .filter((project) => project.featured)
    .slice(0, 2);
}
