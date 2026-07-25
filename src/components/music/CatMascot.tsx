"use client";

type Props = {
  size?: number;
  className?: string;
};

export default function CatMascot({ size = 48, className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {/* ears */}
      <path d="M14 20 L20 4 L28 22 Z" fill="#fff" stroke="#f6a8c4" strokeWidth="2" strokeLinejoin="round" />
      <path d="M50 20 L44 4 L36 22 Z" fill="#fff" stroke="#f6a8c4" strokeWidth="2" strokeLinejoin="round" />
      <path d="M17.5 18 L20.5 9.5 L24 19 Z" fill="#f9b8d0" />
      <path d="M46.5 18 L43.5 9.5 L40 19 Z" fill="#f9b8d0" />

      {/* face */}
      <circle cx="32" cy="34" r="22" fill="#fff" stroke="#f6a8c4" strokeWidth="2" />

      {/* blush */}
      <ellipse cx="19" cy="38" rx="4" ry="2.4" fill="#ffc2d6" />
      <ellipse cx="45" cy="38" rx="4" ry="2.4" fill="#ffc2d6" />

      {/* eyes: one open, one winking */}
      <circle cx="24" cy="32" r="2.3" fill="#4a3038" />
      <path d="M37 32c1.6-2 4.4-2 6 0" stroke="#4a3038" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* nose + smile */}
      <path d="M30.5 37c.9 1 2.1 1 3 0" stroke="#f472a8" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M29 39.5c1.3 1.2 4.7 1.2 6 0" stroke="#4a3038" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}
