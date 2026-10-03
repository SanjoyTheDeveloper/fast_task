"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { GIcon } from "@/components/ui/GIcon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface DashboardHeaderProps {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
  } | null;
  onOpenCreateModal?: () => void;
}

export function DashboardHeader({ user, onOpenCreateModal }: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [prevPathname, setPrevPathname] = React.useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMobileMenuOpen(false);
  }

  // Handle Escape key to close mobile menu
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  // Auth.js logout mechanism: clear session and redirect to public home / landing page
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Clear server-side session cookies & tokens
      await fetch("/api/auth/logout", { method: "POST" });
      // NextAuth signOut with redirect to the public home / landing page
      await signOut({ callbackUrl: "/", redirect: true });
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: navigate directly to public home page
      router.push("/");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isDashboard = pathname === "/dashboard" || pathname === "/";
  const isKanban = pathname === "/kanban";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/85 backdrop-blur-xl shadow-2xs">
      <div className="w-full max-w-[1600px] mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-10">
        {/* Left: Brand Logo & Desktop Navigation */}
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 sm:gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl shrink-0"
            aria-label="FastTask Home"
          >
            <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md shadow-blue-500/25 shrink-0">
              <GIcon name="task_alt" size={20} filled />
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-zinc-900 leading-none">
                  FastTask
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-200/60 uppercase">
                  Pro
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 font-semibold tracking-wider uppercase mt-0.5 hidden xs:inline-block">
                Dashboard
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDashboard
                  ? "bg-blue-50 text-blue-700"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
              }`}
            >
              <GIcon name="grid_view" size={14} />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/kanban"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isKanban
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
              }`}
            >
              <GIcon name="view_kanban" size={14} />
              <span>Kanban</span>
            </Link>
          </nav>
        </div>

        {/* Right: Actions, User Menu & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {onOpenCreateModal && (
            <Button
              onClick={onOpenCreateModal}
              size="sm"
              className="h-9 px-3 sm:px-4 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs shadow-blue-500/30 transition-transform active:scale-95 cursor-pointer focus:ring-2 focus:ring-blue-500 shrink-0"
              aria-label="Create new task"
            >
              <GIcon name="add" size={16} />
              <span className="hidden sm:inline font-semibold">Add Task</span>
            </Button>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 sm:h-10 gap-2 sm:gap-2.5 px-2 sm:px-3 border-zinc-200 hover:bg-zinc-50 rounded-xl transition-all hover:border-zinc-300 focus:ring-2 focus:ring-blue-500 cursor-pointer shrink-0"
                  aria-label="User account menu"
                >
                  <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs shrink-0">
                    {user.name ? user.name.charAt(0).toUpperCase() : <GIcon name="person" size={14} />}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-zinc-800 leading-tight">
                      {user.name || "User"}
                    </span>
                    <span className="text-[11px] text-zinc-400 leading-none truncate max-w-[120px]">
                      {user.email || ""}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 shadow-xl border-zinc-200 rounded-xl p-1.5">
                <DropdownMenuLabel className="font-normal p-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold text-zinc-900">{user.name || "User"}</p>
                    <p className="text-xs text-zinc-500 truncate">{user.email || ""}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer rounded-lg p-2 text-xs font-medium">
                    <GIcon name="grid_view" size={16} className="mr-2 text-zinc-500" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/kanban" className="cursor-pointer rounded-lg p-2 text-xs font-medium">
                    <GIcon name="view_kanban" size={16} className="mr-2 text-zinc-500" />
                    <span>Kanban Board</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer rounded-lg p-2 text-xs font-medium"
                  aria-label="Log out"
                >
                  <GIcon name="logout" size={16} className="mr-2" />
                  <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 sm:gap-2">
              <Button variant="ghost" size="sm" asChild className="rounded-xl text-xs sm:text-sm h-8 sm:h-9">
                <Link href="/login">Log in</Link>
              </Button>
              <Button size="sm" asChild className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm h-8 sm:h-9">
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Navigation Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden h-9 w-9 text-zinc-600 hover:text-zinc-900 rounded-xl focus:ring-2 focus:ring-blue-500 cursor-pointer shrink-0"
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation-menu"
          >
            {isMobileMenuOpen ? (
              <GIcon name="close" size={20} />
            ) : (
              <GIcon name="menu" size={20} />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div
          id="mobile-navigation-menu"
          className="md:hidden border-t border-zinc-200/80 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-3 animate-fade-in-up"
        >
          {/* User Info Bar if logged in */}
          {user && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-200/70">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                {user.name ? user.name.charAt(0).toUpperCase() : <GIcon name="person" size={16} />}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-bold text-zinc-900 truncate">{user.name || "User"}</span>
                <span className="text-[11px] text-zinc-500 truncate">{user.email || ""}</span>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation Links">
            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isDashboard ? "bg-blue-50 text-blue-700" : "text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              <GIcon name="grid_view" size={16} />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/kanban"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isKanban ? "bg-indigo-50 text-indigo-700" : "text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              <GIcon name="view_kanban" size={16} />
              <span>Kanban Board</span>
            </Link>
          </nav>

          {/* Mobile Actions */}
          <div className="pt-2 border-t border-zinc-100 flex flex-col gap-2">
            {onOpenCreateModal && (
              <Button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenCreateModal();
                }}
                className="h-10 w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs"
              >
                <GIcon name="add" size={16} />
                <span>Add New Task</span>
              </Button>
            )}

            {user ? (
              <Button
                variant="outline"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                disabled={isLoggingOut}
                className="h-10 w-full gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 rounded-xl"
              >
                <GIcon name="logout" size={16} />
                <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
              </Button>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Button variant="outline" asChild className="h-11 w-full rounded-xl border-zinc-300 font-semibold text-sm">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
                </Button>
                <Button asChild className="h-11 w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs">
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
