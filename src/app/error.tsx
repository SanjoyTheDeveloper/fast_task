"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log error to monitoring if configured
    console.error("Global application error captured:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xl shadow-blue-500/5 text-center space-y-6">
        {/* Error Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100 shadow-xs">
          <AlertCircle className="w-8 h-8 stroke-[2.2]" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Something went wrong
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
            {error?.message ||
              "An unexpected error occurred while loading this page. Please try refreshing or return home."}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2.5 text-xs font-semibold shadow-sm shadow-blue-500/25 gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto rounded-full px-6 py-2.5 text-xs font-semibold border-slate-200 hover:bg-slate-50 gap-2 text-slate-700 cursor-pointer"
          >
            <Link href="/dashboard">
              <Home className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
