import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Count Dojo - Train to Beat the Casino",
  description: "The world's first gamified card counting education app. Learn to count cards from beginner to casino-ready in 90 days.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
