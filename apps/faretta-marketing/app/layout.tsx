import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_FARETTA_SITE_URL ?? "https://faretta.ai";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Faretta AI — A voice for the voiceless.",
  description:
    "Stand up for yourself, pro se, with case law in your corner. Faretta AI is a chat-first legal companion for people whose rights have been violated and who don't have anyone to speak for them. Named for Faretta v. California (1975) — the right to represent yourself.",
  keywords: [
    "Faretta AI",
    "pro se",
    "self-representation",
    "Faretta v. California",
    "Sixth Amendment",
    "legal AI",
    "civil rights",
  ],
  openGraph: {
    title: "Faretta AI — A voice for the voiceless.",
    description: "Stand up for yourself, pro se, with case law in your corner.",
    type: "website",
    images: ["/brand/logo.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Faretta AI — A voice for the voiceless.",
    description: "Stand up for yourself, pro se, with case law in your corner.",
  },
  icons: { icon: "/brand/mark.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1E3A8A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
