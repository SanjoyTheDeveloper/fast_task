"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { CheckSquare, Menu, X, ArrowRight, LayoutDashboard } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
}

export interface NavbarProps {
  navItems?: NavItem[];
  loginHref?: string;
  registerHref?: string;
}

const defaultNavItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Course", href: "/lms" },
  { label: "Features", href: "/#how-it-works" },
];

export function Navbar({
  navItems = defaultNavItems,
  loginHref = "/login",
  registerHref = "/register",
}: NavbarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState<string | null>(null);

  // Safe SSR-consistent initial active state based strictly on pathname
  const [activeItem, setActiveItem] = React.useState<string>(() => {
    if (pathname === "/dashboard" || pathname?.startsWith("/dashboard")) return "Dashboard";
    if (pathname === "/lms" || pathname?.startsWith("/lms")) return "Course";
    return "Home";
  });

  // Client-only effect running strictly after hydration
  React.useEffect(() => {
    if (window.location.hash.includes("how-it-works")) {
      setActiveItem("Features");
    } else if (pathname === "/dashboard" || pathname?.startsWith("/dashboard")) {
      setActiveItem("Dashboard");
    } else if (pathname === "/lms" || pathname?.startsWith("/lms")) {
      setActiveItem("Course");
    } else {
      setActiveItem("Home");
    }

    const handleHash = () => {
      if (window.location.hash.includes("how-it-works")) {
        setActiveItem("Features");
      } else if (window.location.pathname === "/" || window.location.pathname === "") {
        setActiveItem("Home");
      }
    };
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    setActiveItem(item.label);
    setClickedItem(item.label);
    setTimeout(() => {
      setClickedItem(null);
    }, 450);

    // Clicking Home while already on home page scrolls smoothly to top
    if (item.href === "/" || item.href === "") {
      if (typeof window !== "undefined" && (window.location.pathname === "/" || window.location.pathname === "")) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", "/");
        setActiveItem("Home");
      }
    }

    // Clicking Features / How It Works while on home page scrolls smoothly to section
    if (item.href.includes("#how-it-works")) {
      if (typeof window !== "undefined" && (window.location.pathname === "/" || window.location.pathname === "")) {
        e.preventDefault();
        const el = document.getElementById("how-it-works");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          window.history.pushState(null, "", "#how-it-works");
          setActiveItem("Features");
        }
      }
    }
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on Escape key press
  React.useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Prevent background scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? "border-b border-[#E5EAF2] bg-white/95 backdrop-blur-xl shadow-[0_2px_12px_rgba(15,23,42,0.03)]"
          : "border-b border-[#E5EAF2] bg-white/80 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90 group shrink-0"
          aria-label="FastTask Home"
        >
          <div className="h-8.5 w-8.5 rounded-xl bg-[#315BFF] hover:bg-[#254BE3] flex items-center justify-center text-white shadow-xs shadow-blue-500/25 shrink-0 transition-transform group-hover:scale-102">
            <CheckSquare className="h-4.5 w-4.5 stroke-[2.5]" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[17px] font-bold tracking-tight text-slate-900 group-hover:text-slate-950">
              FastTask
            </span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-[#EEF3FF] text-[#315BFF] border border-[#D0DFFF] uppercase tracking-wide">
              PRO
            </span>
          </div>
        </Link>

        {/* Center: Clean Human-Crafted Navigation Links (Desktop) */}
        <nav
          className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100/60 border border-slate-200/50 backdrop-blur-md"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => {
            const isClicked = clickedItem === item.label;
            const isActive = activeItem === item.label;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`relative text-[13px] font-bold px-3.5 py-1.5 rounded-xl transition-all duration-200 select-none cursor-pointer active:scale-95 active:shadow-[0_0_20px_rgba(49,91,255,0.45)] active:ring-2 active:ring-[#315BFF]/30 ${
                  isClicked
                    ? "animate-click-shadow bg-white text-[#315BFF] border border-[#D0DFFF] shadow-[0_4px_18px_rgba(49,91,255,0.22)]"
                    : isActive
                    ? "bg-white text-[#315BFF] border border-[#D0DFFF] shadow-[0_2px_12px_rgba(49,91,255,0.14)]"
                    : "text-slate-600 hover:text-[#315BFF] hover:bg-white/80 hover:shadow-[0_4px_14px_rgba(49,91,255,0.08)] border border-transparent hover:border-slate-200/60"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Auth Action Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#315BFF] hover:bg-[#254BE3] text-white text-xs font-semibold tracking-[-0.01em] shadow-xs shadow-blue-500/25 hover:shadow-sm transition-all duration-150 cursor-pointer"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Go to Dashboard</span>
              <ArrowRight className="h-3.5 w-3.5 opacity-80" />
            </Link>
          ) : (
            <>
              <Link
                href={loginHref}
                className="text-xs font-semibold text-slate-600 hover:text-slate-950 px-3.5 py-2 rounded-xl hover:bg-slate-100/70 transition-colors"
              >
                Sign In
              </Link>

              <Link
                href={registerHref}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#315BFF] hover:bg-[#254BE3] text-white text-xs font-semibold tracking-[-0.01em] shadow-xs shadow-blue-500/25 hover:shadow-sm transition-all duration-150 cursor-pointer"
              >
                <span>Launch App</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Menu Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-9 w-9 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bottom-0 bg-white/98 backdrop-blur-2xl border-b border-slate-200 p-6 flex flex-col justify-between z-50 animate-in fade-in duration-200">
            <nav className="flex flex-col space-y-1.5">
              {navItems.map((item) => {
                const isClicked = clickedItem === item.label;
                const isActive = activeItem === item.label;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      handleNavClick(e, item);
                    }}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 active:shadow-[0_0_20px_rgba(49,91,255,0.45)] ${
                      isClicked
                        ? "animate-click-shadow bg-blue-50 text-[#315BFF] border border-[#D0DFFF] shadow-[0_4px_18px_rgba(49,91,255,0.22)]"
                        : isActive
                        ? "bg-blue-50/80 text-[#315BFF] border border-[#D0DFFF]/80 shadow-xs"
                        : "text-slate-700 hover:bg-slate-100 hover:text-[#315BFF]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

          <div className="space-y-2.5 pt-6 border-t border-slate-100">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-11 rounded-xl text-sm font-semibold bg-[#315BFF] hover:bg-[#254BE3] text-white flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Go to Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  href={loginHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full h-11 rounded-xl text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href={registerHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full h-11 rounded-xl text-sm font-semibold bg-[#315BFF] hover:bg-[#254BE3] text-white flex items-center justify-center shadow-xs transition-colors"
                >
                  Get Started Free →
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
