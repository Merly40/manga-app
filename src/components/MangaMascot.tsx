// วางไฟล์นี้ที่: src/components/MangaMascot.tsx
import { HeartIcon } from "./icons/UiIcons";

export default function MangaMascot() {
  return (
    <div className="pointer-events-none absolute bottom-6 right-8 hidden flex-col items-center md:flex" aria-hidden="true">
      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-[#f6d9e2] bg-white text-[#ef7095] shadow-[0_8px_20px_rgba(239,68,119,0.12)]">
        <HeartIcon className="h-4 w-4" />
      </div>

      <svg viewBox="0 0 120 110" className="h-24 w-24">
        {/* หาง */}
        <path d="M96 78c14-2 22-16 18-30" stroke="#f3b7c9" strokeWidth="6" strokeLinecap="round" fill="none" />
        {/* ตัว */}
        <ellipse cx="55" cy="72" rx="34" ry="25" fill="#ffffff" stroke="#f3b7c9" strokeWidth="3" />
        {/* หัว */}
        <circle cx="55" cy="38" r="26" fill="#ffffff" stroke="#f3b7c9" strokeWidth="3" />
        {/* หู */}
        <path d="M34 22 L28 4 L46 16 Z" fill="#ffffff" stroke="#f3b7c9" strokeWidth="3" strokeLinejoin="round" />
        <path d="M76 22 L82 4 L64 16 Z" fill="#ffffff" stroke="#f3b7c9" strokeWidth="3" strokeLinejoin="round" />
        <path d="M35 19 L30 6 L44 15 Z" fill="#fbd7e2" />
        <path d="M75 19 L80 6 L66 15 Z" fill="#fbd7e2" />
        {/* หน้า */}
        <path d="M45 40q2-4 6 0" stroke="#5d3542" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M65 40q-2-4-6 0" stroke="#5d3542" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M52 47q3 3 6 0" stroke="#d9738f" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* แก้มปัด */}
        <circle cx="38" cy="46" r="4" fill="#fbc7d4" opacity=".7" />
        <circle cx="72" cy="46" r="4" fill="#fbc7d4" opacity=".7" />
        {/* โบว์ */}
        <path d="M55 58l-9-6v12l9-6z" fill="#ef7095" />
        <path d="M55 58l9-6v12l-9-6z" fill="#ef7095" />
        <circle cx="55" cy="58" r="3" fill="#d9527a" />
      </svg>
    </div>
  );
}
