"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
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
  Mail,
  KeyRound,
} from "@/components/ui/GoogleIcon";
import { toast, Toaster } from "sonner";

type VerificationStatus = "idle" | "loading" | "success" | "error";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tokenParam = searchParams.get("token") || searchParams.get("code") || "";
  const emailParam = searchParams.get("email") || "";

  const [code, setCode] = React.useState(tokenParam);
  const [email, setEmail] = React.useState(emailParam);
  const [status, setStatus] = React.useState<VerificationStatus>(
    tokenParam ? "loading" : "idle"
  );
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [isResending, setIsResending] = React.useState(false);
  const autoSubmittedRef = React.useRef(false);

  // Auto-verify if code/token is present in URL
  React.useEffect(() => {
    if (autoSubmittedRef.current) return;
    if (tokenParam && tokenParam.trim()) {
      autoSubmittedRef.current = true;
      executeVerification(tokenParam.trim(), emailParam.trim());
    }
  }, [tokenParam, emailParam]);

  async function executeVerification(verifyCode: string, verifyEmail?: string) {
    if (!verifyCode || !verifyCode.trim()) {
      setStatus("error");
      setErrorMessage("Please enter your 6-digit verification code.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const query = new URLSearchParams();
      query.set("code", verifyCode.trim());
      if (verifyEmail && verifyEmail.trim()) {
        query.set("email", verifyEmail.trim());
      }

      const response = await fetch(`/api/auth/verify-email?${query.toString()}`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setStatus("success");
        toast.success("Email verified successfully!");
      } else {
        setStatus("error");
        setErrorMessage(data.message || "Invalid or expired verification code.");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setStatus("error");
      setErrorMessage("Unable to connect to the verification service. Please try again.");
    }
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeVerification(code, email);
  };

  const handleResendCode = async () => {
    if (!email || !email.trim()) {
      toast.error("Please enter your email address to receive a new code.");
      return;
    }

    setIsResending(true);
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();
      if (response.ok && data.emailSent) {
        toast.success("A new 6-digit verification code has been sent to your email!");
        setStatus("idle");
        setCode("");
      } else {
        toast.error(data.message || "Failed to resend code. Please try again.");
      }
    } catch {
      toast.error("Network error while requesting new code.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <Toaster richColors position="top-right" />

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
              Verifying your code
            </CardTitle>
            <CardDescription className="text-zinc-600 max-w-xs mx-auto">
              Please wait while we validate your 6-digit verification code...
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
              Your email address has been confirmed. Your FastTask account is now fully active.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 pb-2">
            <div className="rounded-lg bg-emerald-50/70 border border-emerald-200/80 p-3.5 text-center text-sm text-emerald-800">
              You can now proceed to log in to your account with your credentials.
            </div>
          </CardContent>

          <CardFooter className="pt-4 pb-6 flex flex-col space-y-3">
            <Button
              asChild
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-all"
            >
              <Link href={email ? `/login?email=${encodeURIComponent(email)}` : "/login"}>
                Proceed to Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* State: Idle or Error (OTP Form) */}
      {(status === "idle" || status === "error") && (
        <Card className="border-zinc-200/90 shadow-md">
          <CardHeader className="text-center pb-3 pt-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-8 ring-blue-50/50 mb-2">
              <KeyRound className="h-7 w-7" />
            </div>
            <CardTitle className="text-xl font-bold text-zinc-900">
              Enter Verification Code
            </CardTitle>
            <CardDescription className="text-zinc-600 max-w-sm mx-auto text-xs sm:text-sm">
              Enter the 6-digit verification code sent to your Gmail inbox.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-2 pb-4">
            {status === "error" && errorMessage && (
              <div className="rounded-xl bg-red-50/90 border border-red-200 p-3 text-center text-xs sm:text-sm font-medium text-red-700 flex items-center justify-center gap-2">
                <XCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleManualSubmit} className="space-y-3.5">
              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700" htmlFor="verify-email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                  <input
                    id="verify-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full h-10 pl-9 pr-3 text-sm rounded-lg border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>

              {/* 6-Digit Code Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700" htmlFor="verify-code">
                  6-Digit OTP Code
                </label>
                <div className="relative">
                  <input
                    id="verify-code"
                    type="text"
                    maxLength={6}
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.trim())}
                    placeholder="123456"
                    className="w-full h-12 text-center text-2xl font-mono font-bold tracking-widest rounded-lg border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
                <p className="text-[11px] text-zinc-500 text-center">
                  ⏱️ Code expires in 10 minutes
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-all mt-2"
              >
                Verify Code
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>

          <CardFooter className="pt-0 pb-6 flex flex-col space-y-2.5 border-t border-zinc-100 px-6">
            <div className="flex items-center justify-between w-full pt-3">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isResending}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline disabled:opacity-50 cursor-pointer"
              >
                {isResending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                Resend Code
              </button>

              <Link
                href="/login"
                className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800"
              >
                <LogIn className="h-3.5 w-3.5" />
                Back to Sign In
              </Link>
            </div>
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
