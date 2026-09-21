"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckSquare, LogOut, Bell, Database, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
  onOpenCreateModal?: () => void;
}

export function Navbar({ user, onOpenCreateModal }: NavbarProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/85 backdrop-blur-xl shadow-2xs">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo with Glow */}
        <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98]">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md shadow-blue-500/25">
            <CheckSquare className="h-5 w-5 stroke-[2.5]" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-zinc-900 leading-none">
                FastTask
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-200/60 uppercase">
                Pro
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-semibold tracking-wider uppercase mt-1">
              Task & Project Manager
            </span>
          </div>
        </Link>

        {/* Center: System Status Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-50 border border-zinc-200/70 text-xs text-zinc-600">
          <Database className="h-3.5 w-3.5 text-blue-600" />
          <span className="font-medium text-zinc-700">PostgreSQL + Prisma</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-2.5">
          {user && onOpenCreateModal && (
            <Button
              onClick={onOpenCreateModal}
              size="sm"
              className="hidden sm:flex h-9 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30 transition-transform active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Create Task</span>
            </Button>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-10 gap-2.5 px-3 border-zinc-200 hover:bg-zinc-50 rounded-xl transition-all hover:border-zinc-300"
                >
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-zinc-800 leading-tight">
                      {user.name}
                    </span>
                    <span className="text-[11px] text-zinc-400 leading-none truncate max-w-[130px]">
                      {user.email}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 shadow-xl border-zinc-200 rounded-xl p-1.5">
                <DropdownMenuLabel className="font-normal p-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold text-zinc-900">{user.name}</p>
                    <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer rounded-lg p-2"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="font-medium">{isLoggingOut ? "Logging out..." : "Log out"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
