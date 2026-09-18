import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ThemeProvider from "@/components/ThemeProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
    title: "LearnHub",
    description: "Online Learning Platform with GPT Integration",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
                <ThemeProvider>
                    <Navbar />
                    <main>{children}</main>
                    <Toaster position="top-right" richColors />
                </ThemeProvider>
            </body>
        </html>
    );
}