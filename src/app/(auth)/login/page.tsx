"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { CheckSquare, Loader2, Lock, Mail, AlertCircle } from "@/components/ui/GoogleIcon";
import { toast, Toaster } from "sonner";

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
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const email = watch("email");

  const isEmailVerificationError =
    serverError?.toLowerCase().includes("verify your email") ||
    serverError?.toLowerCase().includes("verification") ||
    serverError?.toLowerCase().includes("email_not_verified");

  const handleResendVerification = async () => {
    if (!email || !email.trim()) {
      toast.error("Please enter your email address to resend verification.");
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
    } else if (error === "CredentialsSignin") {
      setServerError("Invalid email or password. Please try again.");
    } else if (error) {
      setServerError(decodeURIComponent(error));
    }
  }, [searchParams, setValue]);

  const onSubmit = async (values: LoginInput) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const res = await signIn("credentials", {
        email: values.email.trim(),
        password: values.password,
        redirect: false,
      });

      if (res?.error) {
        if (
          res.error.toLowerCase().includes("verify") ||
          res.error.toLowerCase().includes("email_not_verified") ||
          res.code?.toLowerCase().includes("verify")
        ) {
          setServerError("Please verify your email before logging in");
        } else {
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
    <div className="relative rounded-3xl border border-[#DCE7FC] bg-white shadow-[0_20px_50px_rgba(49,91,255,0.06)] overflow-hidden p-6 sm:p-8 space-y-6">
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#315BFF] via-[#5B63E6] to-[#8B5CF6]" />
      <div className="space-y-1">
        <h2 className="text-xl font-black text-[#172033] tracking-tight">Sign In</h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Enter your credentials to access your dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <div className="p-3.5 text-sm rounded-xl border bg-rose-50 text-rose-700 border-rose-200/80 space-y-2.5">
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
                    className="flex items-center justify-center gap-1.5 w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold py-2.5 px-3 shadow-xs transition-all text-center"
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
          <label className="text-xs font-bold text-[#172033] uppercase tracking-wider" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              id="email"
              type="email"
              placeholder="alex@example.com"
              className={`flex h-11 w-full rounded-xl border bg-[#F8FAFC] pl-10 pr-3 text-sm text-[#172033] placeholder:text-slate-400 transition-all focus:outline-none focus:bg-white focus:border-[#315BFF] focus:ring-2 focus:ring-[#315BFF]/15 ${
                errors.email ? "border-rose-500" : "border-[#E5EAF2]"
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
          <label className="text-xs font-bold text-[#172033] uppercase tracking-wider" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className={`flex h-11 w-full rounded-xl border bg-[#F8FAFC] pl-10 pr-3 text-sm text-[#172033] placeholder:text-slate-400 transition-all focus:outline-none focus:bg-white focus:border-[#315BFF] focus:ring-2 focus:ring-[#315BFF]/15 ${
                errors.password ? "border-rose-500" : "border-[#E5EAF2]"
              }`}
              {...register("password")}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-rose-500 font-medium pl-1">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 h-11 rounded-xl text-sm font-bold text-white bg-[#315BFF] hover:bg-[#254BE3] shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </Button>
      </form>

      <div className="pt-4 border-t border-[#F1F5F9] text-center">
        <p className="text-xs sm:text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-[#315BFF] font-bold hover:underline transition-colors"
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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-[#F8FAFC] p-4 text-[#172033] selection:bg-[#315BFF] selection:text-white">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-[radial-gradient(ellipse_at_top,rgba(49,91,255,0.08),rgba(99,102,241,0.04),transparent_65%)]" />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-blue-400/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-indigo-300/10 blur-[100px]" />

      <Toaster richColors position="top-right" />

      <div className="relative w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <Link
            href="/"
            className="group flex flex-col items-center space-y-2 transition-transform hover:scale-102"
          >
            {/* FastTask Logo Icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#315BFF] text-white shadow-md shadow-blue-500/25">
              <CheckSquare className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-[#172033]">
                FastTask
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-[#315BFF] bg-[#EEF3FF] border border-[#D0DFFF] px-2 py-0.5 rounded">
                PRO
              </span>
            </div>
          </Link>
          <div className="space-y-1">
            <h1 className="text-[#172033] font-black text-2xl tracking-tight">
              Welcome back to FastTask
            </h1>
            <p className="text-slate-500 text-sm">
              Enter your credentials to access your task dashboard
            </p>
          </div>
        </div>

        {/* Suspense boundary for useSearchParams */}
        <React.Suspense
          fallback={
            <div className="bg-white rounded-3xl border border-[#DCE7FC] shadow-sm p-10 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#315BFF]" />
            </div>
          }
        >
          <LoginForm />
        </React.Suspense>

        {/* Back to landing link */}
        <div className="text-center pt-1">
          <Link
            href="/"
            className="text-xs font-medium text-slate-400 hover:text-[#315BFF] transition-colors"
          >
            ← Return to Public Home
          </Link>
        </div>
      </div>
    </div>
  );
}
