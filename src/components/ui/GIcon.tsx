import * as React from "react";

export interface GIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  size?: number | string;
  filled?: boolean;
  weight?: number;
  grade?: number;
  opsz?: number;
  className?: string;
}

export function GIcon({
  name,
  size = 20,
  filled = false,
  weight = 400,
  grade = 0,
  opsz = 24,
  className = "",
  style,
  ...props
}: GIconProps) {
  const fontVariationSettings = `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opsz}`;

  return (
    <span
      className={`material-symbols-outlined select-none inline-flex items-center justify-center shrink-0 leading-none ${className}`}
      style={{
        fontSize: typeof size === "number" ? `${size}px` : size,
        width: typeof size === "number" ? `${size}px` : size,
        height: typeof size === "number" ? `${size}px` : size,
        fontVariationSettings,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    >
      {name}
    </span>
  );
}

export default GIcon;
