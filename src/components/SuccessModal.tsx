"use client";

import { useEffect, useState } from "react";
import { PartyPopper } from "lucide-react";

export default function SuccessModal({
  open,
  title = "บันทึกสำเร็จแล้ว!",
  message,
}: {
  open: boolean;
  title?: string;
  message?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open) {
      const t = requestAnimationFrame(() => setMounted(true));
      return () => cancelAnimationFrame(t);
    }
    setMounted(false);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity duration-200 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`flex flex-col items-center gap-3 rounded-3xl border border-pink-100 bg-white px-10 py-8 text-center shadow-xl transition-all duration-300 dark:border-gray-800 dark:bg-gray-900 ${
          mounted ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-500/15">
          <PartyPopper className="h-8 w-8 text-pink-500 dark:text-pink-300" />
        </div>
        <p className="text-xl font-bold text-[#ef7095] dark:text-pink-400">{title}</p>
        {message && <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>}
      </div>
    </div>
  );
}