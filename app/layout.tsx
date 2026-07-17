import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sagniksengupta24.github.io/Portfolio";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Sagnik Sengupta — AI Systems That Earn Trust", template: "%s — Sagnik Sengupta" },
  description: "Portfolio of Sagnik Sengupta: local-first AI systems, machine-learning research, simulation and expressive software built with visible evidence.",
  applicationName: "Sagnik Sengupta Portfolio",
  authors: [{ name: "Sagnik Sengupta", url: siteUrl }],
  creator: "Sagnik Sengupta",
  keywords: ["Sagnik Sengupta", "AI systems", "machine learning research", "reinforcement learning", "creative developer", "IIT Madras"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: "Sagnik Sengupta — AI systems that earn trust.",
    description: "Local-first AI systems, research software, simulation and expressive technical experiences.",
    siteName: "Sagnik Sengupta",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Sagnik Sengupta — AI systems that earn trust." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sagnik Sengupta — AI Systems That Earn Trust",
    description: "AI systems, research software, simulation and expressive technical experiences.",
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/icon.svg", apple: "/apple-icon.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#05070f",
  colorScheme: "dark",
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Sagnik Sengupta",
  url: siteUrl,
  email: "mailto:sagniksengupta24@gmail.com",
  sameAs: ["https://github.com/sagniksengupta24", "https://www.linkedin.com/in/sagnik-sengupta-3286681b6/"],
  jobTitle: "AI Systems Engineer and Machine Learning Research Builder",
  alumniOf: { "@type": "CollegeOrUniversity", name: "Indian Institute of Technology Madras" },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
