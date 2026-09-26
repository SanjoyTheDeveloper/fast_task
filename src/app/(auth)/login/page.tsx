"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, Loader2, Lock, Mail, AlertCircle } from "lucide-react";
import { toast, Toaster } from "sonner";

import { signIn } from "next-auth/react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/dashboard";

  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const [devVerificationUrl, setDevVerificationUrl] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isEmailVerificationError =
    serverError?.toLowerCase().includes("verify your email") ||
    serverError?.toLowerCase().includes("check your inbox");

  const handleResendVerification = async () => {
    const email = getValues("email");
    if (!email || !email.trim()) {
      toast.error("Please enter your email address above first.");
      return;
    }

    setIsResending(true);
    setDevVerificationUrl(null);
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json().catch(() => ({}));

      if (data.verificationUrl) {
        setDevVerificationUrl(data.verificationUrl);
      }

      if (response.ok) {
        if (data.emailSent) {
          toast.success("Verification email sent! Check your inbox.");
        } else {
          toast.info("Generated verification link. Use the link below or terminal.");
        }
      } else {
        toast.error(data.message || "Failed to resend verification email.");
      }
    } catch {
      toast.error("Network error: Could not send verification email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  React.useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const emailParam = searchParams.get("email");

    if (emailParam) {
      setValue("email", emailParam);
    }

    if (
      code === "email_not_verified" ||
      code === "Please verify your email before logging in" ||
      code === "Please verify your email before logging in. Check your inbox." ||
      error === "email_not_verified"
    ) {
      setServerError("Please verify your email before logging in");
    }
  }, [searchParams, setValue]);

  const onSubmit = async (values: LoginInput) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (res?.error) {
        if (
          res.code === "email_not_verified" ||
          res.error === "email_not_verified" ||
          res.error?.toLowerCase().includes("verify") ||
          res.code?.toLowerCase().includes("verify")
        ) {
          setServerError("Please verify your email before logging in");
        } else {
          // Check if failure is due to unverified email
          try {
            const checkRes = await fetch("/api/auth/resend-verification", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: values.email.trim(), checkOnly: true }),
            });
            const checkData = await checkRes.json();
            if (checkData.unverified) {
              setServerError("Please verify your email before logging in");
              setIsLoading(false);
              return;
            }
          } catch {
            // Ignore check failure
          }
          setServerError("Invalid email or password. Please try again.");
        }
        setIsLoading(false);
        return;
      }

      // Successful login with Auth.js session
      router.push(from);
      router.refresh();
    } catch (err: any) {
      try {
        const checkRes = await fetch("/api/auth/resend-verification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: values.email.trim(), checkOnly: true }),
        });
        const checkData = await checkRes.json();
        if (checkData.unverified) {
          setServerError("Please verify your email before logging in");
          setIsLoading(false);
          return;
        }
      } catch {
        // Ignore check failure
      }

      const msg = err?.message || "";
      if (
        msg.toLowerCase().includes("verify") ||
        msg.toLowerCase().includes("inbox") ||
        msg.toLowerCase().includes("email_not_verified")
      ) {
        setServerError("Please verify your email before logging in");
      } else {
        setServerError("Invalid email or password. Please try again.");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-purple-100/80 shadow-[0_20px_50px_-12px_rgba(124,58,237,0.12)] p-8 sm:p-10 max-w-md w-full space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-[#1E1B4B] tracking-tight">Sign In</h2>
        <p className="text-sm text-purple-900/60">
          Stay organized and manage your projects efficiently
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <div className="p-3.5 text-sm rounded-2xl border bg-rose-50 text-rose-700 border-rose-200/80 space-y-2.5">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-rose-600" />
              <span className="leading-snug">{serverError}</span>
            </div>
            {isEmailVerificationError && (
              <div className="pt-2 border-t border-rose-200/70 space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isResending}
                  onClick={handleResendVerification}
                  className="w-full bg-white hover:bg-rose-50 text-rose-700 border-rose-300 text-xs font-medium h-9 rounded-xl shadow-xs"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      Resending verification email...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-1.5 h-3.5 w-3.5" />
                      Resend verification email
                    </>
                  )}
                </Button>

                {devVerificationUrl && (
                  <a
                    href={devVerificationUrl}
                    className="flex items-center justify-center gap-1.5 w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-semibold py-2.5 px-3 shadow-md shadow-purple-500/20 transition-all text-center"
                  >
                    <span>🚀 Verify Account Now (Instant Dev Link)</span>
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-purple-900/80 uppercase tracking-wider" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 h-4 w-4 text-purple-400" />
            <input
              id="email"
              type="email"
              placeholder="alex@example.com"
              className={`flex h-12 w-full rounded-2xl bg-[#F8F7FF] border border-[#E0E7FF] text-[#1E1B4B] placeholder-purple-300 pl-11 pr-4 text-sm transition-all focus:bg-white focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-500/15 ${
                errors.email ? "border-rose-400 bg-rose-50/30" : ""
              }`}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-rose-500 font-medium pl-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-purple-900/80 uppercase tracking-wider" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 h-4 w-4 text-purple-400" />
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className={`flex h-12 w-full rounded-2xl bg-[#F8F7FF] border border-[#E0E7FF] text-[#1E1B4B] placeholder-purple-300 pl-11 pr-4 text-sm transition-all focus:bg-white focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-500/15 ${
                errors.password ? "border-rose-400 bg-rose-50/30" : ""
              }`}
              {...register("password")}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-rose-500 font-medium pl-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 bg-gradient-to-r from-[#6366F1] via-[#7C3AED] to-[#8B5CF6] hover:from-[#4F46E5] hover:to-[#7C3AED] text-white font-semibold rounded-2xl py-3.5 shadow-md shadow-purple-500/30 hover:shadow-lg hover:shadow-purple-500/40 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>

      <div className="pt-4 border-t border-purple-100/60 text-center">
        <p className="text-sm text-purple-900/60">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-[#7C3AED] font-semibold hover:underline transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#F5F3FF] via-[#FDF2F8] to-[#EDE9FE] p-4 text-[#1E1B4B] selection:bg-purple-500 selection:text-white">
      {/* Subtle, ultra-soft ambient blurred blobs in the corners */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#DDD6FE] blur-3xl opacity-60" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#FCE7F3] blur-3xl opacity-60" />
      <div className="pointer-events-none absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-[#EDE9FE] blur-3xl opacity-50" />

      <Toaster richColors position="top-right" />

      <div className="relative w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <Link
            href="/"
            className="group flex flex-col items-center space-y-2.5 transition-transform hover:scale-102"
          >
            {/* App Icon Badge: Rounded clay-style gradient box */}
            <div className="flex h-12 w-12 items-center justify-center bg-gradient-to-tr from-purple-500 to-indigo-500 text-white rounded-2xl p-3 shadow-lg shadow-purple-500/30">
              <CheckSquare className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-[#1E1B4B]">
                Fast<span className="text-[#7C3AED]">Task</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-purple-700 bg-purple-100/80 border border-purple-200/60 px-2 py-0.5 rounded-full">
                Academic
              </span>
            </div>
          </Link>
          <div className="space-y-1">
            <h1 className="text-[#1E1B4B] font-bold text-2xl tracking-tight">
              Welcome back to FastTask
            </h1>
            <p className="text-purple-900/60 text-sm">
              Enter your credentials to access your task dashboard
            </p>
          </div>
        </div>

        {/* Suspense boundary for useSearchParams */}
        <React.Suspense
          fallback={
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-purple-100/80 shadow-[0_20px_50px_-12px_rgba(124,58,237,0.12)] p-10 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#7C3AED]" />
            </div>
          }
        >
          <LoginForm />
        </React.Suspense>

        {/* Back to landing link */}
        <div className="text-center pt-1">
          <Link
            href="/"
            className="text-xs font-medium text-purple-800/60 hover:text-purple-900 transition-colors"
          >
            ← Return to Public Home
          </Link>
        </div>
      </div>
    </div>
  );
}
