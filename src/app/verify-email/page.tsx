"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  RefreshCw,
  LogIn,
} from "@/components/ui/GoogleIcon";

type VerificationStatus = "loading" | "success" | "error";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = React.useState<VerificationStatus>("loading");
  const [errorMessage, setErrorMessage] = React.useState<string>(
    "Invalid or expired token"
  );
  const requestSentRef = React.useRef(false);

  React.useEffect(() => {
    // Prevent duplicate calls in React Strict Mode
    if (requestSentRef.current) return;
    requestSentRef.current = true;

    if (!token || !token.trim()) {
      setStatus("error");
      setErrorMessage("Invalid or expired token. No verification token was provided.");
      return;
    }

    async function verify() {
      try {
        const response = await fetch(
          `/api/auth/verify-email?token=${encodeURIComponent(token!.trim())}`,
          {
            method: "GET",
            headers: {
              "Accept": "application/json",
            },
          }
        );

        const data = await response.json().catch(() => ({}));

        if (response.ok) {
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMessage(data.message || "Invalid or expired token");
        }
      } catch (err) {
        console.error("Verification request error:", err);
        setStatus("error");
        setErrorMessage("Unable to connect to the verification service. Please try again.");
      }
    }

    verify();
  }, [token]);

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Brand header */}
      <div className="flex flex-col items-center text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
            <CheckSquare className="h-7 w-7 stroke-[2.5]" />
          </div>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          FastTask Verification
        </h1>
        <p className="text-sm text-zinc-500">
          Account activation and security verification
        </p>
      </div>

      {/* State: Loading */}
      {status === "loading" && (
        <Card className="border-zinc-200/90 shadow-md">
          <CardHeader className="text-center pb-4 pt-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 ring-8 ring-blue-50/50 mb-3">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <CardTitle className="text-xl font-bold text-zinc-900">
              Verifying your email
            </CardTitle>
            <CardDescription className="text-zinc-600 max-w-xs mx-auto">
              Please wait a moment while we validate your verification token...
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-blue-600 h-1.5 rounded-full w-2/3 animate-pulse" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* State: Success */}
      {status === "success" && (
        <Card className="border-zinc-200/90 shadow-md">
          <CardHeader className="text-center pb-2 pt-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/60 mb-3">
              <CheckCircle2 className="h-9 w-9 text-emerald-600 stroke-[2.2]" />
            </div>
            <CardTitle className="text-xl font-bold text-zinc-900">
              Email verified successfully!
            </CardTitle>
            <CardDescription className="text-zinc-600 max-w-sm mx-auto pt-1">
              Your email address has been confirmed. Your FastTask account is now fully active and ready to use.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 pb-2">
            <div className="rounded-lg bg-emerald-50/70 border border-emerald-200/80 p-3.5 text-center text-sm text-emerald-800">
              You can now proceed to log in to your account with your credentials.
            </div>
          </CardContent>

          <CardFooter className="pt-4 pb-6 flex flex-col space-y-3">
            <Button asChild className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-all">
              <Link href="/login">
                Proceed to Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* State: Error */}
      {status === "error" && (
        <Card className="border-zinc-200/90 shadow-md">
          <CardHeader className="text-center pb-2 pt-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/60 mb-3">
              <XCircle className="h-9 w-9 text-red-600 stroke-[2.2]" />
            </div>
            <CardTitle className="text-xl font-bold text-zinc-900">
              Verification Failed
            </CardTitle>
            <CardDescription className="text-zinc-600 max-w-sm mx-auto pt-1">
              We couldn&apos;t verify your email with the provided link.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 pb-2">
            <div className="rounded-lg bg-red-50/80 border border-red-200 p-4 text-center text-sm font-medium text-red-700">
              {errorMessage}
            </div>
            <p className="text-xs text-zinc-500 text-center mt-3">
              The link might have already been used, expired, or was entered incorrectly.
            </p>
          </CardContent>

          <CardFooter className="pt-4 pb-6 flex flex-col space-y-2.5">
            <Button asChild className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Go to Sign In
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full h-10 border-zinc-200 text-zinc-700 hover:bg-zinc-50">
              <Link href="/register">
                Create a New Account
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Footer support text */}
      <p className="text-center text-xs text-zinc-500">
        Having trouble? Back to{" "}
        <Link href="/" className="font-medium text-blue-600 hover:underline">
          Home
        </Link>
      </p>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="w-full max-w-md">
      <Card className="border-zinc-200/90 shadow-md p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 ring-8 ring-blue-50/50 mb-3">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
        <h2 className="text-lg font-semibold text-zinc-900 mb-1">
          Loading verification...
        </h2>
        <p className="text-sm text-zinc-500">
          Preparing email verification request...
        </p>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-blue-50/40 p-3.5 sm:p-6">
      <React.Suspense fallback={<LoadingFallback />}>
        <VerifyEmailContent />
      </React.Suspense>
    </div>
  );
}
