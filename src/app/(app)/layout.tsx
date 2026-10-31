import * as React from "react";
import { auth } from "@/auth";
import { AppShell } from "@/components/layout";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session = null;
  try {
    session = await auth();
  } catch (error: unknown) {
    const err = error as { digest?: string; message?: string };
    if (
      err?.digest === "DYNAMIC_SERVER_USAGE" ||
      err?.message?.includes("DYNAMIC_SERVER_USAGE") ||
      err?.digest?.startsWith?.("NEXT_")
    ) {
      throw error;
    }
  }

  return <AppShell user={session?.user}>{children}</AppShell>;
}
