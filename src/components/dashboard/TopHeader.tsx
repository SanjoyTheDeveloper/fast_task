"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  ChevronDown,
  LayoutDashboard,
  CheckCircle2,
  Calendar as CalendarIcon,
  Clock,
  Columns,
  FileText,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  CheckSquare,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStudentProfile } from "@/lib/studentProfile";

export interface TopHeaderProps {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
  } | null;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onOpenMobileMenu?: () => void;
  onOpenZenMode?: () => void;
}

export function TopHeader({
  user,
  searchQuery = "",
  onSearchChange,
  onOpenMobileMenu,
  onOpenZenMode,
}: TopHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const { profile, palette } = useStudentProfile(
    user?.name ? { name: user.name } : undefined
  );
  const userName = profile?.name || user?.name || (user?.email ? user.email.split("@")[0] : "Student");
  const userEmail = user?.email || "";

  // Logout handler redirecting to landing page /
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      await signOut({ callbackUrl: "/", redirect: true });
    } catch (err) {
      console.error("Logout failed:", err);
      router.push("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      isActive: pathname === "/dashboard" || pathname === "/",
    },
    {
      id: "tasks",
      label: "My Tasks",
      icon: CheckCircle2,
      href: "/tasks",
      isActive: pathname === "/tasks",
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: CalendarIcon,
      href: "/calendar",
      isActive: pathname === "/calendar",
    },
    {
      id: "schedule",
      label: "Routine",
      icon: Clock,
      href: "/schedule",
      isActive: pathname === "/schedule",
    },
    {
      id: "kanban",
      label: "Kanban",
      icon: Columns,
      href: "/kanban",
      isActive: pathname === "/kanban",
    },
    {
      id: "notes",
      label: "Notes",
      icon: FileText,
      href: "/notes",
      isActive: pathname === "/notes",
    },
    {
      id: "lms",
      label: "Courses",
      icon: BookOpen,
      href: "/lms",
      isActive: pathname === "/lms",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/settings",
      isActive: pathname === "/settings",
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E5EAF2] shadow-2xs">
      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-4">
        {/* Left: Brand Logo & Desktop Navigation */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 transition-transform hover:scale-102 shrink-0"
            aria-label="FastTask Dashboard"
          >
            <div className="h-9 w-9 rounded-xl bg-[#315BFF] flex items-center justify-center text-white shadow-md shadow-blue-500/25 shrink-0">
              <CheckSquare className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-[#172033]">
                FastTask
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-[#EEF3FF] text-[#315BFF] border border-[#D0DFFF] uppercase tracking-wide">
                PRO
              </span>
            </div>
          </Link>

          {/* Top Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                    item.isActive
                      ? "bg-[#EEF3FF] text-[#315BFF] shadow-2xs font-extrabold"
                      : "text-slate-600 hover:text-[#172033] hover:bg-slate-100/80"
                  }`}
                >
                  <Icon
                    className={`h-3.5 w-3.5 shrink-0 ${
                      item.isActive ? "text-[#315BFF]" : "text-slate-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: User Profile & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => {
              setIsMobileMenuOpen((prev) => !prev);
              if (onOpenMobileMenu) onOpenMobileMenu();
            }}
            className="lg:hidden h-9 w-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-2xs transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* User Profile Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all outline-none cursor-pointer">
              {/* Avatar */}
              <div
                className={`h-8 w-8 rounded-full bg-gradient-to-tr ${palette.gradient} text-white flex items-center justify-center text-xs font-bold ring-2 ring-blue-100 shadow-2xs overflow-hidden transition-all`}
              >
                {userName
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>

              {/* Name & Email info */}
              <div className="text-left hidden sm:block max-w-[170px]">
                <p className="text-xs font-bold text-[#172033] truncate leading-tight">
                  {userName}
                </p>
                <p className="text-[10px] text-slate-400 truncate leading-tight">
                  {userEmail}
                </p>
              </div>

              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1.5 shadow-xl border-[#E5EAF2]">
              <DropdownMenuLabel className="font-semibold text-xs text-slate-500 px-2 py-1.5">
                Signed in as
                <p className="font-bold text-sm text-[#172033] truncate mt-0.5">{userName}</p>
                <p className="text-[11px] text-slate-400 font-normal truncate">{userEmail}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="flex items-center gap-2 px-2 py-2 rounded-lg text-xs font-semibold cursor-pointer">
                  <LayoutDashboard className="h-4 w-4 text-slate-400" />
                  <span>Dashboard Overview</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/tasks" className="flex items-center gap-2 px-2 py-2 rounded-lg text-xs font-semibold cursor-pointer">
                  <CheckCircle2 className="h-4 w-4 text-slate-400" />
                  <span>My Tasks</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/kanban" className="flex items-center gap-2 px-2 py-2 rounded-lg text-xs font-semibold cursor-pointer">
                  <Columns className="h-4 w-4 text-slate-400" />
                  <span>Kanban Board</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/lms" className="flex items-center gap-2 px-2 py-2 rounded-lg text-xs font-semibold cursor-pointer">
                  <BookOpen className="h-4 w-4 text-[#315BFF]" />
                  <span>Course</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center gap-2 px-2 py-2 rounded-lg text-xs font-semibold cursor-pointer">
                  <Settings className="h-4 w-4 text-slate-400" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 px-2 py-2 rounded-lg text-xs font-bold text-rose-600 focus:bg-rose-50 focus:text-rose-700 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Slide-down Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200/80 bg-white/98 backdrop-blur-md px-4 py-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <nav className="grid grid-cols-2 gap-1.5" aria-label="Mobile navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    item.isActive
                      ? "bg-[#EEF3FF] text-[#315BFF] font-extrabold"
                      : "text-slate-600 hover:text-[#172033] hover:bg-slate-100"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      item.isActive ? "text-[#315BFF]" : "text-slate-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
