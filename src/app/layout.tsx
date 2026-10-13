import type { Metadata, Viewport } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
  } catch (error: any) {
    // Next.js uses internal errors to signal dynamic rendering and redirects
    if (
      error?.digest === "DYNAMIC_SERVER_USAGE" ||
      error?.message?.includes("DYNAMIC_SERVER_USAGE") ||
      error?.digest?.startsWith?.("NEXT_")
    ) {
      throw error;
    }
    console.warn("Session check in RootLayout skipped/failed:", error?.message || error);
  }

  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
