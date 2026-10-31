import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names safely with tailwind-merge and clsx.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date or string into a readable format (e.g., "Oct 24, 2026").
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "No due date";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "Invalid date";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

/**
 * Formats a number as a currency string (e.g. "$120.00").
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Formats a 24-hour time string ("14:30") to 12-hour format ("02:30 PM").
 */
export function formatTime24to12(timeStr: string): string {
  if (!timeStr) return "";
  const [hStr, mStr] = timeStr.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr || "00";
  if (isNaN(h)) return timeStr;
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  h = h ? h : 12;
  const paddedH = String(h).padStart(2, "0");
  return `${paddedH}:${m} ${ampm}`;
}

/**
 * Formats a session time range (e.g., "09:30 AM - 10:50 AM").
 */
export function formatSessionTime(startTime: string, endTime: string): string {
  return `${formatTime24to12(startTime)} - ${formatTime24to12(endTime)}`;
}

