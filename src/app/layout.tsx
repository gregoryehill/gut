import type { Metadata } from "next";
import { Poppins, Roboto_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "GUT - Grand Unified Theory of Cooking",
  description: "Generate recipes using the five fundamental components of cooking. For people who ship code, and want to ship dinner too.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://gut.cooking'),
  openGraph: {
    title: "GUT - Grand Unified Theory of Cooking",
    description: "Generate recipes using the five fundamental components of cooking. For people who ship code, and want to ship dinner too.",
    siteName: "GUT",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GUT - Grand Unified Theory of Cooking",
    description: "Generate recipes using the five fundamental components of cooking. For people who ship code, and want to ship dinner too.",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Cormorant+Garamond:ital,wght@1,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${poppins.variable} ${robotoMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
