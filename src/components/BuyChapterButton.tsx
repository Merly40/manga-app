"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function BuyChapterButton({
  chapterId,
  price,
}: {
  chapterId: string;
  price: number;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBuy = async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch("/api/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chapterId }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "ซื้อตอนไม่สำเร็จ");
      return;
    }
    router.refresh();
  };

  return (
    <div className="panel flex flex-col items-center gap-3 px-6 py-16 text-center">
      
      <p className="text-[#76515e]">ตอนนี้เป็นตอนพิเศษ ต้องซื้อก่อนถึงจะอ่านได้</p>
      <p className="font-display text-2xl text-[#ef7095]">฿{price}</p>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={handleBuy}
        disabled={loading}
        className="pink-btn px-6"
      >
        {loading ? "กำลังดำเนินการ..." : `จ่ายเงินเพื่ออ่านตอนนี้`}
      </button>
      <p className="text-xs text-[#b58b98]">
        (เดโม: ระบบนี้ยังไม่เชื่อมต่อการตัดเงินจริง กดแล้วปลดล็อกทันที)
      </p>
    </div>
  );
}
