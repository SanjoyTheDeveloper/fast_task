"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";

interface TaskPriorityBadgeProps {
  priority?: "LOW" | "MEDIUM" | "HIGH" | string | null;
  className?: string;
}

/**
 * TaskPriorityBadge component.
 * Priority is not currently part of the canonical Task API contract.
 * Returns null unless an explicit priority value is provided.
 */
export function TaskPriorityBadge({ priority, className = "" }: TaskPriorityBadgeProps) {
  if (!priority) return null;

  const variant =
    priority === "HIGH" ? "high" : priority === "MEDIUM" ? "medium" : "low";

  return (
    <Badge
      variant={variant as any}
      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${className}`}
      aria-label={`Priority: ${priority}`}
    >
      {priority}
    </Badge>
  );
}
