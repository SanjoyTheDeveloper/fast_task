import type { Metadata, Viewport } from "next";
import { Inter, Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FastTask - Modern Task & Project Manager",
  description: "High performance task manager built with Next.js, shadcn/ui, and PostgreSQL",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

import { auth } from "@/auth";
import { SessionProvider } from "@/components/providers/SessionProvider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session = null;
  try {
    session = await auth();
  } catch (error: unknown) {
    const err = error as { digest?: string; message?: string };
    // Next.js uses internal errors to signal dynamic rendering and redirects
    if (
      err?.digest === "DYNAMIC_SERVER_USAGE" ||
      err?.message?.includes("DYNAMIC_SERVER_USAGE") ||
      err?.digest?.startsWith?.("NEXT_")
    ) {
      throw error;
    }
    console.warn("Session check in RootLayout skipped/failed:", err?.message || error);
  }

  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900">
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
