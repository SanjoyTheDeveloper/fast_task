import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "FastTask — Academic & Student Task Workspace",
  description:
    "FastTask is a modern, high-performance academic workspace for university students with semester schedules, lecture routines, and Kanban workflows.",
};

export default function HomePage() {
  return <LandingPage />;
}

