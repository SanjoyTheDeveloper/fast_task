"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, Loader2, Lock, Mail, User } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function RegisterPage() {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [registeredEmail, setRegisteredEmail] = React.useState<string | null>(null);
  const [devVerificationUrl, setDevVerificationUrl] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterInput) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.message || "Failed to create account. Please try again.");
        setIsLoading(false);
        return;
      }

      // Do NOT log the user in automatically. Show confirmation screen & notification!
      setRegisteredEmail(values.email);
      if (data.verificationUrl) {
        setDevVerificationUrl(data.verificationUrl);
      }
      toast.success("Account created successfully! Please check your email and click the verification link.");
      setIsLoading(false);
    } catch (err: any) {
      setServerError(err.message || "An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-[#070A10] p-4 text-white selection:bg-cyan-500 selection:text-black">
      {/* 3D Ambient Studio Spotlights & Flares */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.28),rgba(6,182,212,0.18),transparent_65%)]" />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-blue-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-amber-500/8 blur-[100px]" />
      <div className="pointer-events-none absolute left-1/3 -bottom-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-[90px]" />

      <Toaster richColors position="top-right" />

      <div className="relative w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <Link
            href="/"
            className="group flex flex-col items-center space-y-2 transition-transform hover:scale-102"
          >
            {/* Glowing abstract geometric icon */}
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-[0_0_25px_rgba(37,99,235,0.5)]">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#0B0F17]">
                <div className="relative">
                  <CheckSquare className="h-6 w-6 text-cyan-400 stroke-[2.3]" />
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                  </span>
                </div>
              </div>
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white">
                Fast<span className="text-cyan-400">Task</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2 px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08]">
                Academic
              </span>
            </div>
          </Link>
          <p className="text-xs sm:text-sm text-slate-400">
            Create account • Next-Gen Student & Task Workspace
          </p>
        </div>

        {/* Success confirmation card or Register Card */}
        {registeredEmail ? (
          <div className="relative rounded-2xl border border-white/[0.12] bg-slate-900/75 backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-cyan-400 via-emerald-500 to-blue-500" />
            <div className="p-6 sm:p-8 space-y-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <Mail className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Account Created Successfully!
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
                  Please check your inbox and click the verification link to activate your workspace.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950/60 border border-slate-700/60 rounded-xl text-center">
                <span className="text-xs text-slate-400 block mb-1">
                  Verification email sent to:
                </span>
                <span className="text-sm font-semibold text-cyan-300 break-all">
                  {registeredEmail}
                </span>
              </div>

              <Button
                asChild
                className="w-full h-11 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] border border-cyan-400/30"
              >
                <Link href={`/login?email=${encodeURIComponent(registeredEmail)}`}>
                  Proceed to Sign In
                </Link>
              </Button>

              {devVerificationUrl && (
                <a
                  href={devVerificationUrl}
                  className="flex items-center justify-center gap-1.5 w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold py-2.5 px-3 shadow transition-colors text-center"
                >
                  <span>🚀 Verify Account Now (Instant Dev Link)</span>
                </a>
              )}

              <div className="pt-4 border-t border-white/[0.08] text-center">
                <p className="text-xs text-slate-500">
                  Didn't receive the email? Request a new link on the{" "}
                  <Link
                    href={`/login?email=${encodeURIComponent(registeredEmail)}`}
                    className="text-cyan-400 hover:underline font-semibold"
                  >
                    Sign In
                  </Link>{" "}
                  page.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative rounded-2xl border border-white/[0.12] bg-slate-900/75 backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden">
            {/* Top glowing accent gradient */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500" />

            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white tracking-tight">Create Free Account</h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Join FastTask to orchestrate your semester goals and tasks
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {serverError && (
                  <div className="p-3.5 text-sm rounded-xl border bg-rose-500/10 text-rose-300 border-rose-500/30 backdrop-blur-md">
                    {serverError}
                  </div>
                )}

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider" htmlFor="name">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      id="name"
                      placeholder="Alex Morgan"
                      className={`flex h-11 w-full rounded-xl border bg-slate-950/60 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 transition-all focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 ${
                        errors.name ? "border-rose-500" : "border-slate-700/60"
                      }`}
                      {...register("name")}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-rose-400">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider" htmlFor="reg-email">
                    University / Personal Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      id="reg-email"
                      type="email"
                      placeholder="alex@university.edu"
                      className={`flex h-11 w-full rounded-xl border bg-slate-950/60 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 transition-all focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 ${
                        errors.email ? "border-rose-500" : "border-slate-700/60"
                      }`}
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-rose-400">{errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider" htmlFor="reg-password">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      id="reg-password"
                      type="password"
                      placeholder="At least 6 characters"
                      className={`flex h-11 w-full rounded-xl border bg-slate-950/60 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 transition-all focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 ${
                        errors.password ? "border-rose-500" : "border-slate-700/60"
                      }`}
                      {...register("password")}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-xs text-rose-400">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      id="confirmPassword"
                      type="password"
                      placeholder="Re-enter password"
                      className={`flex h-11 w-full rounded-xl border bg-slate-950/60 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 transition-all focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 ${
                        errors.confirmPassword ? "border-rose-500" : "border-slate-700/60"
                      }`}
                      {...register("confirmPassword")}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-rose-400">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full mt-3 h-11 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-[1.01] active:scale-[0.99] transition-all border border-cyan-400/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <span>Create Account Free</span>
                  )}
                </button>
              </form>

              <div className="pt-4 border-t border-white/[0.08] text-center">
                <p className="text-xs sm:text-sm text-slate-400">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-bold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Back to landing link */}
        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Return to Public Home
          </Link>
        </div>
      </div>
    </div>
  );
}
