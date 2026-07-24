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

export function ZoomInIcon(props: IconProps) {
  return (
    <svg {...base} width={20} height={20} {...props}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.2" y2="16.2" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

export function ZoomOutIcon(props: IconProps) {
  return (
    <svg {...base} width={20} height={20} {...props}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.2" y2="16.2" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

export function ArrowUpIcon(props: IconProps) {
  return (
    <svg {...base} width={20} height={20} {...props}>
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="6 11 12 5 18 11" />
    </svg>
  );
}

export function ArrowDownIcon(props: IconProps) {
  return (
    <svg {...base} width={20} height={20} {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="18 13 12 19 6 13" />
    </svg>
  );
}

export function BookIcon(props: IconProps) {
  return (
    <svg {...base} width={20} height={20} {...props}>
      <path d="M4 5.5c1.8-1 4.4-1 6 0.3v13c-1.6-1.3-4.2-1.3-6-.3v-13Z" />
      <path d="M20 5.5c-1.8-1-4.4-1-6 .3v13c1.6-1.3 4.2-1.3 6-.3v-13Z" />
    </svg>
  );
}

export function CommentIcon(props: IconProps) {
  return (
    <svg {...base} width={20} height={20} {...props}>
      <path d="M20 14.5a2 2 0 0 1-2 2H8l-4 3.5V6.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8Z" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg {...base} width={20} height={20} {...props}>
      <circle cx="12" cy="12" r="4.2" />
      <line x1="12" y1="2.5" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="21.5" />
      <line x1="2.5" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="21.5" y2="12" />
      <line x1="5" y1="5" x2="6.8" y2="6.8" />
      <line x1="17.2" y1="17.2" x2="19" y2="19" />
      <line x1="19" y1="5" x2="17.2" y2="6.8" />
      <line x1="6.8" y1="17.2" x2="5" y2="19" />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...base} width={20} height={20} {...props}>
      <path d="M20 14.2A8.2 8.2 0 1 1 9.8 4a6.4 6.4 0 0 0 10.2 10.2Z" />
    </svg>
  );
}

export function FullscreenIcon(props: IconProps) {
  return (
    <svg {...base} width={20} height={20} {...props}>
      <path d="M8 4H4v4" />
      <path d="M16 4h4v4" />
      <path d="M8 20H4v-4" />
      <path d="M16 20h4v-4" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg {...base} width={16} height={16} {...props}>
      <rect x="4.5" y="10.5" width="15" height="9.5" rx="2" />
      <path d="M7.5 10.5V7.2a4.5 4.5 0 0 1 9 0v3.3" />
    </svg>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg {...base} width={26} height={26} {...props}>
      <polyline points="15 5 8 12 15 19" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...base} width={26} height={26} {...props}>
      <polyline points="9 5 16 12 9 19" />
    </svg>
  );
}
export function CurrentIcon(props: IconProps) {
  return (
    <svg {...base} width={16} height={16} {...props} fill="currentColor" stroke="none">
      <circle cx="12" cy="12" r="5" />
    </svg>
  );
}
