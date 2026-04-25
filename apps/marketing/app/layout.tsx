import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gideon.ai";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Gideon — Truth, tested.",
  description:
    "An AI for operators — with evidence. Gideon learns from a network of real people building real things. Built by Ryan Nichols.",
  openGraph: {
    title: "Gideon — Truth, tested.",
    description: "An AI for operators — with evidence.",
    type: "website",
    images: ["/brand/logo.svg"],
  },
  icons: { icon: "/brand/logo.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0A0E1A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
