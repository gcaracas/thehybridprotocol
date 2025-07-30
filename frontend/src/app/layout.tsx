import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavigationNew from "@/components/NavigationNew";
import FooterNew from "@/components/FooterNew";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "The Hybrid Protocol - Metabolic Awakening for Adults Over 40",
  description: "Reverse aging, rebuild your body, and reclaim your life with science-backed fasting, nutrition, and metabolic training protocols.",
  keywords: "metabolic health, fasting, weight loss, adults over 40, nutrition, wellness, transformation",
  authors: [{ name: "Gerardo", url: "https://thehybridprotocol.com" }],
  openGraph: {
    title: "The Hybrid Protocol - Metabolic Awakening for Adults Over 40",
    description: "Reverse aging, rebuild your body, and reclaim your life with science-backed protocols.",
    url: "https://thehybridprotocol.com",
    siteName: "The Hybrid Protocol",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Hybrid Protocol",
    description: "Metabolic awakening for adults over 40",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <NavigationNew />
        <main>
          {children}
        </main>
        <FooterNew />
      </body>
    </html>
  );
}
