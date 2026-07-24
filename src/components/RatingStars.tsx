// วางไฟล์นี้ทับที่: src/components/RatingStars.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StarIcon } from "./icons/UiIcons";

type Props = {
  mangaId: string;
  isLoggedIn: boolean;
  average: number;
  count: number;
  myScore: number | null;
};

export default function RatingStars({ mangaId, isLoggedIn, average, count, myScore }: Props) {
  const router = useRouter();
  const [avg, setAvg] = useState(average);
  const [total, setTotal] = useState(count);
  const [mine, setMine] = useState(myScore);
  const [hover, setHover] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function rate(score: number) {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mangaId, score }),
      });

      if (res.status === 404) {
        setError("ไม่พบ /api/rating — เช็คว่าวางไฟล์ route.ts ไว้ที่ src/app/api/rating/route.ts");
        return;
      }

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        setError(`เซิร์ฟเวอร์ตอบกลับไม่ถูกต้อง (status ${res.status}) — ดู error ในเทอร์มินอลที่รัน npm run dev`);
        return;
      }

      if (!res.ok) {
        setError(data?.error || `ให้คะแนนไม่สำเร็จ (status ${res.status})`);
        return;
      }

      setAvg(data.average);
      setTotal(data.count);
      setMine(data.myScore);
      router.refresh();
    } catch (err: any) {
      setError(`เชื่อมต่อเซิร์ฟเวอร์ไม่ได้: ${err?.message || "unknown error"}`);
    } finally {
      setLoading(false);
    }
  }

  const display = hover ?? mine ?? 0;

  return (
    <div className="relative inline-flex items-center gap-1.5 rounded-full border border-[#f2dce3] bg-white px-4 py-2 text-sm font-semibold text-[#623846] dark:border-[#3d222c] dark:bg-[#1a1a1a] dark:text-[#f0dde3]">
      <StarIcon className="h-4 w-4 text-[#ffb400]" filled />
      <span>
        {avg.toFixed(1)} ({total.toLocaleString("th-TH")})
      </span>

      <div className="ml-1 flex items-center border-l border-[#f2dce3] pl-1.5 dark:border-[#3d222c]">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            disabled={loading}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(null)}
            onClick={() => rate(n)}
            aria-label={`ให้ ${n} ดาว`}
            className="cursor-pointer p-1 leading-none disabled:cursor-wait"
          >
            <StarIcon className={`h-4 w-4 ${n <= display ? "text-[#ffb400]" : "text-[#e7d3d9]"}`} filled />
          </button>
        ))}
      </div>

      {error && (
        <span className="absolute left-0 top-[calc(100%+6px)] w-64 whitespace-normal rounded-lg bg-[#fff0f0] px-2 py-1 text-xs font-medium leading-snug text-red-500">
          {error}
        </span>
      )}
    </div>
  );
}
