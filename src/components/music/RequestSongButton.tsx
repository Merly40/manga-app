"use client";

import { ChevronRight } from "lucide-react";
import CatMascot from "./CatMascot";

type Props = {
  onClick?: () => void;
};

export default function RequestSongButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="song-request-btn mt-4 flex w-full items-center gap-3 rounded-2xl border border-dashed border-[#f6b8d0] bg-[#fff3f8] px-4 py-3 text-left transition hover:bg-[#ffe9f2]"
    >
      <CatMascot size={40} />
      <span className="flex-1">
        <span className="block text-base font-bold text-[#ec4899]">ขอเพลง</span>
        <span className="block text-xs text-[#8a6874]">คลิกเพื่อขอเพลงที่อยากฟัง ♡</span>
      </span>
      <ChevronRight className="h-5 w-5 shrink-0 text-[#f6a8c4]" />
    </button>
  );
}
