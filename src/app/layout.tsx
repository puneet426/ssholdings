import type { Metadata, Viewport } from "next";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "./globals.css";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { siteConfig } from "@/lib/site-config";

const siteUrl = siteConfig.url;

// Description copy tracks the homepage — a residential developer in
// Visakhapatnam, not a materials supplier. Keep it in step with About/WhyUs
// if those claims (25 years, 35+ projects) ever change.
const description =
  "SS Holdings builds thoughtfully designed 2 & 3 BHK apartments in Visakhapatnam. 25 years of experience and 35+ projects delivered, with uncompromised quality, on-time delivery and all-inclusive pricing.";

const shortDescription =
  "Residential apartments in Visakhapatnam from SS Holdings — 25 years of experience, 35+ projects delivered, and homes built on quality, on-time delivery and all-inclusive pricing.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SS Holdings | Residential Builders & Developers in Visakhapatnam",
    template: "%s | SS Holdings",
  },
  description,
  keywords: [
    "SS Holdings",
    "builders in Visakhapatnam",
    "real estate developers Visakhapatnam",
    "flats for sale in Visakhapatnam",
    "3 BHK apartments Visakhapatnam",
    "Vastu compliant homes",
    "residential projects Vizag",
    "ongoing projects Visakhapatnam",
  ],
  openGraph: {
    title: "SS Holdings | Residential Builders & Developers in Visakhapatnam",
    description: shortDescription,
    url: siteUrl,
    siteName: "SS Holdings",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SS Holdings | Residential Builders & Developers in Visakhapatnam",
    description: shortDescription,
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4eee4" },
    { media: "(prefers-color-scheme: dark)", color: "#171310" },
  ],
};

// Dark is the default room. This runs during HTML parsing — before first
// paint — so a returning visitor who chose light never sees a dark flash.
// See node_modules/next/dist/docs/.../preventing-flash-before-hydration.md
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-fg">
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
