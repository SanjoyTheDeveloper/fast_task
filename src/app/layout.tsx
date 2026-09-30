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
  const session = await auth();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900">
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
