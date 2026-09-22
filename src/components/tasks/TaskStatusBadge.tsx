"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock } from "lucide-react";

interface TaskStatusBadgeProps {
  completed: boolean;
  className?: string;
}

export function TaskStatusBadge({ completed, className = "" }: TaskStatusBadgeProps) {
  if (completed) {
    return (
      <Badge
        variant="completed"
        className={`inline-flex items-center gap-1 font-semibold text-xs px-2.5 py-0.5 rounded-full ${className}`}
        aria-label="Status: Completed"
      >
        <CheckCircle2 className="h-3 w-3" />
        <span>Completed</span>
      </Badge>
    );
  }

  return (
    <Badge
      variant="pending"
      className={`inline-flex items-center gap-1 font-semibold text-xs px-2.5 py-0.5 rounded-full ${className}`}
      aria-label="Status: Active"
    >
      <Clock className="h-3 w-3" />
      <span>Active</span>
    </Badge>
  );
}
