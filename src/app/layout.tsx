import type { Metadata } from "next";
import { Fraunces, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["SOFT", "opsz"],
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://countdojo.com"),
  title: "Count Dojo — The serious card counter's training ground",
  description:
    "Six units. Thirty lessons. Nineteen drill types. Seven counting systems. A casino simulator calibrated to real table rules. Count Dojo teaches card counting as the craft it is — from Blue Belt to Dojo Legend.",
  openGraph: {
    type: "website",
    siteName: "Count Dojo",
    title: "Count Dojo — An education in advantage play",
    description:
      "Six units, 30+ lessons, 19 drill types, 7 counting systems, a calibrated casino simulator. A serious craft, finally taught like one.",
    url: "https://countdojo.com",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Count Dojo — An education in advantage play",
    description:
      "Six units, 30+ lessons, 19 drill types, 7 counting systems. A serious craft, finally taught like one.",
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
      className={`${fraunces.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
