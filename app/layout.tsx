import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StadiumBuddy - AI Stadium Companion for FIFA World Cup 2026",
  description: "A fast, zero-login, AI-enabled assistant helping fans navigate stadiums through intelligent recommendations for crowd management, accessibility, transportation, sustainability, and real-time operational guidance.",
  metadataBase: new URL("https://stadiumbuddy.com"), // Fallback base URL for metadata
  openGraph: {
    title: "StadiumBuddy - AI Stadium Companion for FIFA World Cup 2026",
    description: "A fast, zero-login, AI-enabled assistant helping fans navigate stadiums through intelligent recommendations.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "StadiumBuddy - AI World Cup Companion",
    description: "AI-enabled assistant helping fans navigate stadiums at FIFA World Cup 2026.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-foreground">
        {children}
      </body>
    </html>
  );
}
