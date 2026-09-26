import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LandingPage } from "@/components/landing/landing-page";

export const metadata: Metadata = {
  title: "FastTask — Academic & Student Task Workspace",
  description:
    "FastTask is a modern, high-performance academic workspace for university students with semester schedules, lecture routines, and Kanban workflows.",
};

export default async function HomePage() {
  // If the user is already authenticated, redirect to the dashboard
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return <LandingPage />;
}

