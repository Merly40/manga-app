"use client";

type Props = {
  playing?: boolean;
  onClick?: () => void;
};

export default function MusicButton({ playing = false, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label={playing ? "ปิดแผงเพลง" : "เปิดแผงเพลง"}
      className="music-btn group relative flex h-16 w-16 items-center justify-center"
    >
      <svg
        viewBox="0 0 120 120"
        className={`h-16 w-16 drop-shadow-[0_6px_14px_rgba(236,72,153,.35)] transition-transform group-hover:scale-105 ${
          playing ? "animate-spin" : ""
        }`}
      >
        <defs>
          <radialGradient id="catBtnGrad" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#ffe1ee" />
            <stop offset="100%" stopColor="#ffb3d1" />
          </radialGradient>
        </defs>

        {/* ears */}
        <path d="M22 34 L38 8 L52 40 Z" fill="#fff5f9" stroke="#f472a8" strokeWidth="3" strokeLinejoin="round" />
        <path d="M98 34 L82 8 L68 40 Z" fill="#fff5f9" stroke="#f472a8" strokeWidth="3" strokeLinejoin="round" />
        <path d="M27 33 L37 15 L46 36 Z" fill="#f9a8c9" />
        <path d="M93 33 L83 15 L74 36 Z" fill="#f9a8c9" />

        {/* head */}
        <circle cx="60" cy="66" r="46" fill="url(#catBtnGrad)" stroke="#ec4899" strokeWidth="3" />

        {/* play triangle */}
        <path d="M50 46 L84 66 L50 86 Z" fill="#ec4899" />

        {/* shine */}
        <ellipse cx="42" cy="48" rx="12" ry="7" fill="#fff" opacity="0.5" />
      </svg>

      {/* paw badge */}
      <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-[#f8a8c8] shadow-md">
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white">
          <circle cx="7" cy="9" r="2.2" />
          <circle cx="12" cy="6.5" r="2.2" />
          <circle cx="17" cy="9" r="2.2" />
          <path d="M12 12c-3.3 0-6 2.2-6 5 0 1.6 1.4 2.7 3 2.2 1-.3 2-.5 3-.5s2 .2 3 .5c1.6.5 3-.6 3-2.2 0-2.8-2.7-5-6-5Z" />
        </svg>
      </span>
    </button>
  );
}