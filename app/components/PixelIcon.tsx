import type { CSSProperties } from "react";

type PixelIconName =
  | "heart"
  | "star"
  | "sparkles"
  | "chart-line"
  | "chart-network"
  | "robot"
  | "wifi"
  | "bolt"
  | "moon"
  | "sun"
  | "calendar-alt"
  | "paint-brush"
  | "laptop-code"
  | "code"
  | "book"
  | "book-heart"
  | "music"
  | "thumbsup"
  | "thumbsdown"
  | "check"
  | "times"
  | "camera"
  | "bookmark";

interface PixelIconProps {
  name: PixelIconName;
  solid?: boolean;
  size?: number;
  className?: string;
  style?: CSSProperties;
  label?: string;
}

/**
 * Pixel icon from @hackernoon/pixel-icon-library (iconfont).
 * Color inherits from CSS `color` / Tailwind text-* classes.
 */
const PixelIcon = ({
  name,
  solid = false,
  size = 16,
  className = "",
  style,
  label,
}: PixelIconProps) => {
  const iconClass = solid ? `hn-${name}-solid` : `hn-${name}`;

  return (
    <i
      className={`hn ${iconClass} inline-flex items-center justify-center leading-none ${className}`}
      style={{ fontSize: size, ...style }}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
    />
  );
};

export default PixelIcon;
export type { PixelIconName };
