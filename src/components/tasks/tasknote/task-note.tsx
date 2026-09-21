"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface TaskNoteProps {
  description: string | null;
  className?: string;
}

export function TaskNote({ description, className = "" }: TaskNoteProps) {
  if (!description) {
    return (
      <Card className={`border-dashed border-zinc-300 bg-zinc-50/50 ${className}`}>
        <CardContent className="p-6 text-center text-sm text-zinc-500">
          No detailed description or notes provided for this task.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-zinc-200 bg-white ${className}`}>
      <CardHeader className="pb-3 border-b border-zinc-100">
        <CardTitle className="text-sm font-medium text-zinc-800 flex items-center gap-2">
          <FileText className="h-4 w-4 text-blue-600" />
          Task Notes & Description
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="prose prose-sm max-w-none text-zinc-700 whitespace-pre-wrap leading-relaxed">
          {description}
        </div>
      </CardContent>
    </Card>
  );
}
