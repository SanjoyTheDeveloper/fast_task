"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [navigating, setNavigating] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  // Complete and reset progress bar when route changes
  React.useEffect(() => {
    if (navigating) {
      setProgress(100);
      const timer = setTimeout(() => {
        setNavigating(false);
        setProgress(0);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Intercept click on internal navigation links for instant feedback
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        target.target === "_blank"
      ) {
        return;
      }

      try {
        const targetUrl = new URL(href, window.location.origin);
        if (
          targetUrl.origin === window.location.origin &&
          (targetUrl.pathname !== window.location.pathname || targetUrl.search !== window.location.search)
        ) {
          setNavigating(true);
          setProgress(35);
          setTimeout(() => {
            setProgress((prev) => (prev >= 35 && prev < 85 ? 85 : prev));
          }, 150);
        }
      } catch {
        // Ignore invalid URLs
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  if (!navigating && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[2.5px] z-[9999] pointer-events-none overflow-hidden"
      role="progressbar"
      aria-label="Navigation progress"
    >
      <div
        className="h-full bg-[#315BFF] transition-all duration-300 ease-out shadow-[0_0_8px_rgba(49,91,255,0.7)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
