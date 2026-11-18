import type { Metadata } from "next";
import { Inter, Newsreader, Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";
import { QueryProvider } from "../providers/query-provider";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
});

// Used by the public marketplace pages (landing page and /services).
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Bhutanese Marketplace — Buy, sell and find help across Australia",
  description:
    "The community marketplace for Bhutanese people living in Australia. Find trusted services in your city, or list your own for free.",
  openGraph: {
    title: "Bhutanese Marketplace",
    description: "Buy, sell and find help from the Bhutanese community across Australia.",
    type: "website",
    locale: "en_AU",
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
      className={`${newsreader.variable} ${inter.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
