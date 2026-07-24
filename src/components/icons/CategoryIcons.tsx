import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// แฟนตาซีโรแมนติก — heart with a sparkle (magical romance)
export function FantasyRomanceIcon(props: IconProps) {
  return (
    <svg {...base} width={22} height={22} {...props}>
      <path d="M9.5 19.2c-4-2.7-6-5.4-6-8.2a4.3 4.3 0 0 1 7.8-2.5A4.3 4.3 0 0 1 19 11c0 2.8-2 5.5-6 8.2a1.7 1.7 0 0 1-3.5 0Z" />
      <path d="M18.5 3.5v2.6M17.2 4.8h2.6" />
    </svg>
  );
}

// โรแมนติกปัจจุบัน — plain heart (everyday romance)
export function ContemporaryRomanceIcon(props: IconProps) {
  return (
    <svg {...base} width={22} height={22} {...props}>
      <path d="M12 20c-5.8-3.6-8.5-7-8.5-10.3A4.7 4.7 0 0 1 12 6.8a4.7 4.7 0 0 1 8.5 2.9c0 3.3-2.7 6.7-8.5 10.3Z" />
    </svg>
  );
}

// แอคชั่น — bolt / lightning
export function ActionIcon(props: IconProps) {
  return (
    <svg {...base} width={22} height={22} {...props}>
      <polygon points="13 2 4 14 11 14 10 22 20 9 13 9 13 2" />
    </svg>
  );
}

// สยองขวัญ — ghost
export function HorrorIcon(props: IconProps) {
  return (
    <svg {...base} width={22} height={22} {...props}>
      <path d="M5 20V11a7 7 0 0 1 14 0v9l-2.3-1.8L14.5 20l-2.5-1.8L9.5 20l-2.2-1.8L5 20Z" />
      <circle cx="9.7" cy="11" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="14.3" cy="11" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Fallback for any category not in the map above
export function TagIcon(props: IconProps) {
  return (
    <svg {...base} width={22} height={22} {...props}>
      <path d="M12.5 3H5a2 2 0 0 0-2 2v7.5a2 2 0 0 0 .6 1.4l9 9a2 2 0 0 0 2.8 0l7-7a2 2 0 0 0 0-2.8l-9-9a2 2 0 0 0-1.4-.6Z" />
      <circle cx="8.5" cy="8.5" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}
