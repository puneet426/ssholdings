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

const siteUrl = "https://ssholdings.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SS Holdings | Premium Tiles, Surfaces & Interior Spaces",
    template: "%s | SS Holdings",
  },
  description:
    "SS Holdings crafts premium tiles, flooring and interior surfaces for architects and designers. Explore our interactive space and discover materials built for spaces that last.",
  keywords: [
    "premium tiles",
    "flooring",
    "interior surfaces",
    "SS Holdings",
    "architectural materials",
    "marble tiles",
    "porcelain tiles",
  ],
  openGraph: {
    title: "SS Holdings | Premium Tiles, Surfaces & Interior Spaces",
    description:
      "Explore an interactive space and discover premium tile collections crafted for architects and designers.",
    url: siteUrl,
    siteName: "SS Holdings",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SS Holdings | Premium Tiles, Surfaces & Interior Spaces",
    description:
      "Explore an interactive space and discover premium tile collections crafted for architects and designers.",
  },
  alternates: {
    canonical: siteUrl,
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
