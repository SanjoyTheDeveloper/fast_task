import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xl shadow-blue-500/5 text-center space-y-6">
        {/* 404 Icon */}
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100 shadow-xs">
          <FileQuestion className="w-8 h-8 stroke-[2.2]" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 inline-block">
            404 • Not Found
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Page does not exist
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
            The link you followed may be broken or the page may have been moved to another location.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-7 py-2.5 text-xs font-semibold shadow-sm shadow-blue-500/25 gap-2 cursor-pointer"
          >
            <Link href="/dashboard">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
