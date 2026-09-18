import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Online Learning Platform",
  description: "Online Learning Platform with GPT Integration",
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