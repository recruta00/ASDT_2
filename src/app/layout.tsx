import type { Metadata, Viewport } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/config/site";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { JsonLd } from "@/components/JsonLd";
import { localBusiness, website } from "@/lib/jsonld";

// Display — Fraunces, an expressive high-contrast serif (Solaire theme).
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

// Body & UI — Work Sans, a clean humanist sans (also carries the spec labels).
const workSans = Work_Sans({
  variable: "--font-worksans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: `${site.name} — Location moto & villas à ${site.city}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  alternates: { canonical: "/" },
  keywords: [
    `location moto ${site.city}`,
    `location scooter ${site.city}`,
    `location villa ${site.city}`,
    `location appartement courte durée ${site.city}`,
    `villa avec piscine ${site.city}`,
  ],
  robots: { index: true, follow: true },
  // og:title / og:description are intentionally omitted so each route's own
  // title/description flows into Open Graph automatically.
  openGraph: {
    type: "website",
    locale: "fr_MA",
    siteName: site.name,
    url: site.domain,
    images: [
      {
        url: "/images/brand/og.png",
        width: 1200,
        height: 630,
        alt: `${site.name} — location moto & villas à ${site.city}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/brand/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#F3EBDD",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={site.locale}
      className={`${fraunces.variable} ${workSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-abyss text-bone">
        <a href="#main" className="skip-link">
          Aller au contenu
        </a>
        <JsonLd data={[localBusiness(), website()]} />
        <Navbar />
        {children}
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
