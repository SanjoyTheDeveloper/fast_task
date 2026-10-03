"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { CheckSquare, Loader2, Lock, Mail, User } from "@/components/ui/GoogleIcon";
import { toast, Toaster } from "sonner";

export default function RegisterPage() {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [registeredEmail, setRegisteredEmail] = React.useState<string | null>(null);
  const [devVerificationUrl, setDevVerificationUrl] = React.useState<string | null>(null);

  const [isAutoVerified, setIsAutoVerified] = React.useState(false);

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

      setRegisteredEmail(values.email);
      setIsAutoVerified(!!data.autoVerified);
      if (data.verificationUrl) {
        setDevVerificationUrl(data.verificationUrl);
      }
      
      if (data.autoVerified) {
        toast.success("Account created successfully! You can now sign in.");
      } else {
        toast.success("Account created successfully! Please check your email.");
      }
      setIsLoading(false);
    } catch (err: any) {
      setServerError(err.message || "An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-[#F8FAFC] p-4 text-[#172033] selection:bg-[#315BFF] selection:text-white">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-[radial-gradient(ellipse_at_top,rgba(49,91,255,0.08),rgba(99,102,241,0.04),transparent_65%)]" />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-blue-400/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-indigo-300/10 blur-[100px]" />
      <div className="pointer-events-none absolute left-1/3 -bottom-20 h-64 w-64 rounded-full bg-blue-300/10 blur-[90px]" />

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
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Create account • Next-Gen Student & Task Workspace
          </p>
        </div>

        {/* Success confirmation card or Register Card */}
        {registeredEmail ? (
          <div className="relative rounded-3xl border border-[#DCE7FC] bg-white shadow-[0_20px_50px_rgba(49,91,255,0.06)] overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#315BFF] via-[#5B63E6] to-[#8B5CF6]" />
            <div className="p-6 sm:p-8 space-y-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 shadow-2xs">
                <Mail className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-black text-[#172033] tracking-tight">
                  {isAutoVerified ? "Account Created & Ready!" : "Account Created Successfully!"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto font-normal">
                  {isAutoVerified
                    ? "Your account is permanently saved on this device. You can sign in now and your session will remain active across PC restarts."
                    : "Please check your inbox and click the verification link to activate your workspace."}
                </p>
              </div>

              <div className="p-3.5 bg-[#F8FAFC] border border-[#E5EAF2] rounded-2xl text-center">
                <span className="text-xs text-slate-400 block mb-1 font-medium">
                  {isAutoVerified ? "Account registered with email:" : "Verification email sent to:"}
                </span>
                <span className="text-sm font-bold text-[#315BFF] break-all">
                  {registeredEmail}
                </span>
              </div>

              <Button
                asChild
                className="w-full h-11 rounded-xl text-sm font-bold text-white bg-[#315BFF] hover:bg-[#254BE3] shadow-md shadow-blue-500/25 transition-all cursor-pointer"
              >
                <Link href={`/login?email=${encodeURIComponent(registeredEmail)}`}>
                  Proceed to Sign In
                </Link>
              </Button>

              {!isAutoVerified && devVerificationUrl && (
                <a
                  href={devVerificationUrl}
                  className="flex items-center justify-center gap-1.5 w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold py-2.5 px-3 shadow-xs transition-all text-center"
                >
                  <span>🚀 Verify Account Now (Instant Dev Link)</span>
                </a>
              )}

              <div className="pt-4 border-t border-[#F1F5F9] text-center">
                <p className="text-xs text-slate-400">
                  Didn&apos;t receive the email? Request a new link on the{" "}
                  <Link
                    href={`/login?email=${encodeURIComponent(registeredEmail)}`}
                    className="text-[#315BFF] hover:underline font-bold"
                  >
                    Sign In
                  </Link>{" "}
                  page.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative rounded-3xl border border-[#DCE7FC] bg-white shadow-[0_20px_50px_rgba(49,91,255,0.06)] overflow-hidden">
            {/* Top glowing accent gradient */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#315BFF] via-[#5B63E6] to-[#8B5CF6]" />

            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-black text-[#172033] tracking-tight">Create Free Account</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Join FastTask to orchestrate your semester goals and tasks
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {serverError && (
                  <div className="p-3.5 text-sm rounded-xl border bg-rose-50 text-rose-700 border-rose-200">
                    {serverError}
                  </div>
                )}

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#172033] uppercase tracking-wider" htmlFor="name">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      id="name"
                      placeholder="Alex Morgan"
                      className={`flex h-11 w-full rounded-xl border bg-[#F8FAFC] pl-10 pr-3 text-sm text-[#172033] placeholder:text-slate-400 transition-all focus:outline-none focus:bg-white focus:border-[#315BFF] focus:ring-2 focus:ring-[#315BFF]/15 ${
                        errors.name ? "border-rose-500" : "border-[#E5EAF2]"
                      }`}
                      {...register("name")}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-rose-500 font-medium">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#172033] uppercase tracking-wider" htmlFor="reg-email">
                    University / Personal Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      id="reg-email"
                      type="email"
                      placeholder="alex@university.edu"
                      className={`flex h-11 w-full rounded-xl border bg-[#F8FAFC] pl-10 pr-3 text-sm text-[#172033] placeholder:text-slate-400 transition-all focus:outline-none focus:bg-white focus:border-[#315BFF] focus:ring-2 focus:ring-[#315BFF]/15 ${
                        errors.email ? "border-rose-500" : "border-[#E5EAF2]"
                      }`}
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-rose-500 font-medium">{errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#172033] uppercase tracking-wider" htmlFor="reg-password">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      id="reg-password"
                      type="password"
                      placeholder="At least 6 characters"
                      className={`flex h-11 w-full rounded-xl border bg-[#F8FAFC] pl-10 pr-3 text-sm text-[#172033] placeholder:text-slate-400 transition-all focus:outline-none focus:bg-white focus:border-[#315BFF] focus:ring-2 focus:ring-[#315BFF]/15 ${
                        errors.password ? "border-rose-500" : "border-[#E5EAF2]"
                      }`}
                      {...register("password")}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-xs text-rose-500 font-medium">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#172033] uppercase tracking-wider" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      id="confirmPassword"
                      type="password"
                      placeholder="Re-enter password"
                      className={`flex h-11 w-full rounded-xl border bg-[#F8FAFC] pl-10 pr-3 text-sm text-[#172033] placeholder:text-slate-400 transition-all focus:outline-none focus:bg-white focus:border-[#315BFF] focus:ring-2 focus:ring-[#315BFF]/15 ${
                        errors.confirmPassword ? "border-rose-500" : "border-[#E5EAF2]"
                      }`}
                      {...register("confirmPassword")}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-rose-500 font-medium">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full mt-3 h-11 rounded-xl text-sm font-bold text-white bg-[#315BFF] hover:bg-[#254BE3] shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
                </Button>
              </form>

              <div className="pt-4 border-t border-[#F1F5F9] text-center">
                <p className="text-xs sm:text-sm text-slate-500">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-bold text-[#315BFF] hover:underline transition-colors"
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
            className="text-xs font-medium text-slate-400 hover:text-[#315BFF] transition-colors"
          >
            ← Return to Public Home
          </Link>
        </div>
      </div>
    </div>
  );
}
