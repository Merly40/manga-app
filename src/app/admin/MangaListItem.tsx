// วางไฟล์นี้ทับที่: src/app/admin/MangaListItem.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  slug: string;
  title: string;
  coverUrl: string;
  category: string;
  status: string;
  saleMode: string;
  fullPrice: number;
  chapterCount: number;
};

export default function MangaListItem(p: Props) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function del() {
    setLoading(true);
    const res = await fetch(`/api/manga/${p.slug}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) router.refresh();
    else setConfirm(false);
  }

  return (
    <div className="grid items-center gap-4 p-4 md:grid-cols-[1.7fr_.8fr_.7fr_.7fr_auto]">
      <div className="flex items-center gap-3">
        <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-[#fde6ed]">
          {p.coverUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.coverUrl} className="h-full w-full object-cover" alt="" />
          )}
        </div>
        <div>
          <p className="font-semibold">{p.title}</p>
          <div className="mt-1 flex gap-1">
            <span className="tag">{p.category}</span>
            <span className="tag">{p.chapterCount} ตอน</span>
          </div>
        </div>
      </div>

      <div className="text-sm">
        {p.status === "ongoing" ? (
          <span className="rounded-full bg-[#eaf8ef] px-3 py-1 text-[#4f9b69]">กำลังอัพ</span>
        ) : (
          <span className="rounded-full bg-[#f0edff] px-3 py-1 text-[#7867bd]">จบแล้ว</span>
        )}
      </div>

      <div className="text-sm">
        {p.saleMode === "FREE" ? "ฟรี" : p.saleMode === "FULL" ? `ทั้งเรื่อง ฿${p.fullPrice}` : "รายตอน"}
      </div>

      <div className="text-sm text-[#a98591]">{p.chapterCount} ตอน</div>

      <div className="flex gap-2">
        <Link href={`/admin/chapters/new?slug=${p.slug}`} className="pink-btn !px-3">
          เพิ่มตอน
        </Link>
        {confirm ? (
          <>
            <button
              onClick={del}
              disabled={loading}
              className="outline-btn !border-red-200 !px-3 !text-red-500"
            >
              ยืนยัน
            </button>
            <button onClick={() => setConfirm(false)} className="outline-btn !px-3">
              ยกเลิก
            </button>
          </>
        ) : (
          <button onClick={() => setConfirm(true)} className="outline-btn !px-3">
            ลบ
          </button>
        )}
      </div>
    </div>
  );
}