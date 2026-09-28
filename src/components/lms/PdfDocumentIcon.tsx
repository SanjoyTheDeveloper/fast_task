import * as React from "react";

export function PdfDocumentIcon({ className = "w-10 h-12 text-[#181829]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="PDF Document"
    >
      {/* Document border with folded corner */}
      <path
        d="M6 7C6 4.23858 8.23858 2 11 2H29.5L42 14.5V49C42 51.7614 39.7614 54 37 54H11C8.23858 54 6 51.7614 6 49V7Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Corner fold flap */}
      <path
        d="M29.5 2V14.5H42"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bold PDF text */}
      <text
        x="24"
        y="32"
        textAnchor="middle"
        fill="currentColor"
        fontSize="11"
        fontWeight="800"
        letterSpacing="0.5"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      >
        PDF
      </text>
      {/* Horizontal text lines below PDF */}
      <line
        x1="13"
        y1="38"
        x2="35"
        y2="38"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <line
        x1="13"
        y1="43.5"
        x2="28"
        y2="43.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
