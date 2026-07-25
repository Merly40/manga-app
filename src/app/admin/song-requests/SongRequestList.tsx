"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Trash2 } from "lucide-react";

type SongRequest = {
  id: string;
  title: string;
  artist: string | null;
  link: string | null;
  note: string | null;
  categories: string;
  status: string;
  createdAt: string;
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "รอดำเนินการ",
  ADDED: "เพิ่มแล้ว",
  REJECTED: "ปฏิเสธ",
};

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-[#fff1f5] text-[#d85f83]",
  ADDED: "bg-[#eaf8ef] text-[#4f9b69]",
  REJECTED: "bg-[#fde2ea] text-[#ad4d70]",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function SongRequestList({ requests }: { requests: SongRequest[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  const updateStatus = async (id: string, status: string) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/song-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) router.refresh();
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("ลบคำขอเพลงนี้ใช่ไหมคะ? การลบไม่สามารถย้อนกลับได้")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/song-requests/${id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    } finally {
      setBusyId(null);
    }
  };

  if (requests.length === 0) {
    return (
      <div className="panel flex flex-col items-center gap-2 p-10 text-center">
        <p className="text-sm text-[#a98591]">ยังไม่มีคำขอเพลงเข้ามาค่ะ</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((r) => {
        const categories = r.categories ? r.categories.split(",").filter(Boolean) : [];
        const isBusy = busyId === r.id;

        return (
          <div key={r.id} className="panel p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-[#5d3542]">{r.title}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[r.status] ?? "bg-[#f2eef2] text-[#7a5560]"}`}>
                    {STATUS_LABEL[r.status] ?? r.status}
                  </span>
                </div>

                {r.artist && <p className="mt-0.5 text-sm text-[#a98591]">โดย {r.artist}</p>}

                {r.link && (
                  <a
                    href={r.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs text-[#ef7095] hover:underline"
                  >
                    <ExternalLink size={12} /> ลิงก์เพลง
                  </a>
                )}

                {r.note && <p className="mt-2 text-sm text-[#603845]">{r.note}</p>}

                {categories.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {categories.map((c) => (
                      <span key={c} className="tag">
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                <p className="mt-2 text-[11px] text-[#c9a8b2]">ขอเมื่อ {formatDate(r.createdAt)}</p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <select
                  value={r.status}
                  disabled={isBusy}
                  onChange={(e) => updateStatus(r.id, e.target.value)}
                  className="rounded-xl border border-[#efcdd7] bg-white px-2.5 py-2 text-xs text-[#603845] outline-none disabled:opacity-50"
                >
                  <option value="PENDING">รอดำเนินการ</option>
                  <option value="ADDED">เพิ่มแล้ว</option>
                  <option value="REJECTED">ปฏิเสธ</option>
                </select>

                <button
                  onClick={() => remove(r.id)}
                  disabled={isBusy}
                  aria-label="ลบคำขอเพลง"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-[#efcdd7] text-[#d85f83] transition hover:bg-[#fff0f4] disabled:opacity-50"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
