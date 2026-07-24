// วางไฟล์นี้ที่: src/components/icons/UiIcons.tsx
import { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function StarIcon({ filled = true, className, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.6}
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 3.6l2.47 5.24 5.78.58-4.33 3.98 1.2 5.7L12 16.2l-5.12 2.9 1.2-5.7-4.33-3.98 5.78-.58L12 3.6z" />
    </svg>
  );
}

export function EyeIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function BookmarkIcon({ filled = false, className, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
      strokeLinecap="round"
      className={className}
      {...props}
    >
      <path d="M6 3.75h12a.75.75 0 01.75.75v16.2a.4.4 0 01-.63.33L12 16.9l-6.12 4.13a.4.4 0 01-.63-.33V4.5A.75.75 0 016 3.75z" />
    </svg>
  );
}

export function BookOpenIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 6.5c-1.6-1.3-3.9-1.9-6.3-1.7-.4 0-.7.35-.7.75v11.6c0 .45.4.8.85.75 2.2-.2 4.3.3 5.75 1.5.25.2.6.2.85 0 1.45-1.2 3.55-1.7 5.75-1.5.45.05.85-.3.85-.75V5.55c0-.4-.3-.75-.7-.75-2.4-.2-4.7.4-6.3 1.7z" />
      <path d="M12 6.5v13" />
    </svg>
  );
}

export function ChevronDownIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function ChevronRightIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function DotsIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <circle cx="5" cy="12" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="19" cy="12" r="1.8" />
    </svg>
  );
}

export function HeartIcon({ filled = true, className, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.7}
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 20.2s-7.6-4.6-9.9-9.3C.6 7.4 2.2 4 5.6 3.4c2-.35 3.9.5 5 2.1a5.6 5.6 0 015-2.1c3.4.6 5 4 3.5 7.5-2.3 4.7-9.1 9.3-9.1 9.3z" />
    </svg>
  );
}

export function FlagIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M5 3v18" />
      <path d="M5 4.5c2.2-1.4 4.4-1.4 6.5 0 2.1 1.4 4.3 1.4 6.5 0v9c-2.2 1.4-4.4 1.4-6.5 0-2.1-1.4-4.3-1.4-6.5 0z" />
    </svg>
  );
}

export function CalendarIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect x="3.5" y="5" width="17" height="16" rx="3" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </svg>
  );
}

export function TrashIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M4 7h16" />
      <path d="M9 7V4.8c0-.44.36-.8.8-.8h4.4c.44 0 .8.36.8.8V7" />
      <path d="M6 7l1 12.2c.05.98.87 1.8 1.85 1.8h6.3c.98 0 1.8-.82 1.85-1.8L18 7" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function SparkleIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M12 2c.6 3.4 2.1 5.4 5.5 6-3.4.6-4.9 2.6-5.5 6-.6-3.4-2.1-5.4-5.5-6 3.4-.6 4.9-2.6 5.5-6z" />
      <path d="M19.5 14c.25 1.5.9 2.3 2.3 2.6-1.4.3-2.05 1.1-2.3 2.6-.25-1.5-.9-2.3-2.3-2.6 1.4-.3 2.05-1.1 2.3-2.6z" opacity=".65" />
    </svg>
  );
}