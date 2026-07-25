"use client";

import { useState } from "react";
import { ArrowLeft, X, Music2, User, Link2, Heart } from "lucide-react";
import CatMascot from "./CatMascot";

type Props = {
  onBack: () => void;
  onClose: () => void;
};

const CATEGORIES = [
  { key: "cute", label: "🎀 น่ารัก / สดใส" },
  { key: "chill", label: "🌙 ผ่อนคลาย" },
  { key: "instrumental", label: "🎹 บรรเลง" },
  { key: "romantic", label: "💗 โรแมนติก" },
  { key: "kpop", label: "🎧 K-POP" },
  { key: "jpop", label: "🎤 J-POP" },
  { key: "ost", label: "✨ OST" },
  { key: "other", label: "🎸 อื่นๆ" },
];

export default function RequestSongForm({ onBack, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [link, setLink] = useState("");
  const [note, setNote] = useState("");
  const [selected, setSelected] = useState<string[]>(["cute"]);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleCategory = (key: string) => {
    setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const submit = async () => {
    if (!title.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/song-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, artist, link, note, categories: selected }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || "ส่งคำขอไม่สำเร็จ ลองใหม่อีกครั้งนะคะ");
        return;
      }
      setSent(true);
      setTitle("");
      setArtist("");
      setLink("");
      setNote("");
      setSelected(["cute"]);
    } catch {
      setError("ส่งคำขอไม่สำเร็จ ลองใหม่อีกครั้งนะคะ");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="request-song">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          aria-label="ย้อนกลับ"
          className="grid h-9 w-9 place-items-center rounded-full border border-[#f6c8db] text-[#ec4899] transition hover:bg-[#fff0f6]"
        >
          <ArrowLeft size={16} />
        </button>
        <button
          onClick={onClose}
          aria-label="ปิด"
          className="grid h-9 w-9 place-items-center rounded-full border border-[#f6c8db] text-[#ec4899] transition hover:bg-[#fff0f6]"
        >
          <X size={16} />
        </button>
      </div>

      <div className="mt-1 flex flex-col items-center text-center">
        <CatMascot size={56} />
        <h2 className="mt-2 text-2xl font-bold text-[#ec4899]">ขอเพลง</h2>
        <p className="text-xs text-[#8a6874]">ขอเพลงที่คุณอยากฟังได้เลย ♡</p>
      </div>

      <div className="mt-4 rounded-2xl border border-[#f6d9e6] bg-[#fff8fb] p-4">
        <SectionLabel n={1} label="รายละเอียดเพลง" />

        <Field icon={<Music2 size={14} />} label="ชื่อเพลง" required count={title.length} max={100}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, 100))}
            placeholder="กรอกชื่อเพลงที่ต้องการขอ"
            className="request-input"
          />
        </Field>

        <Field icon={<User size={14} />} label="ศิลปิน (ถ้ามี)" count={artist.length} max={100}>
          <input
            value={artist}
            onChange={(e) => setArtist(e.target.value.slice(0, 100))}
            placeholder="กรอกชื่อศิลปิน"
            className="request-input"
          />
        </Field>

        <Field icon={<Link2 size={14} />} label="ลิงก์เพลง (YouTube / Spotify / อื่นๆ)" count={link.length} max={200}>
          <input
            value={link}
            onChange={(e) => setLink(e.target.value.slice(0, 200))}
            placeholder="วางลิงก์เพลง (ถ้ามี)"
            className="request-input"
          />
        </Field>
      </div>

      <div className="mt-3 rounded-2xl border border-[#f6d9e6] bg-[#fff8fb] p-4">
        <SectionLabel n={2} label="หมวดหมู่ (เลือกได้)" />
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => toggleCategory(c.key)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                selected.includes(c.key)
                  ? "border-[#ec4899] bg-[#ec4899] text-white"
                  : "border-[#f0d2df] bg-white text-[#8a6874] hover:bg-[#fff0f6]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-[#f6d9e6] bg-[#fff8fb] p-4">
        <div className="mb-3 flex items-center justify-between">
          <SectionLabel n={3} label="ข้อความเพิ่มเติม (ถ้ามี)" noMargin />
          <Heart size={14} className="text-[#f6a8c4]" />
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, 300))}
          placeholder="บอกเหตุผลหรือข้อความถึงแอดมินได้น้า ~"
          rows={3}
          className="request-input resize-none"
        />
        <div className="mt-1 text-right text-[11px] text-[#c98ea1]">{note.length}/300</div>
      </div>

      <button
        onClick={submit}
        disabled={!title.trim() || submitting}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff8fb3] to-[#ec4899] px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90 disabled:opacity-50"
      >
        <CatMascot size={20} />
        {submitting ? "กำลังส่ง..." : "ส่งคำขอเพลง"}
      </button>

      <p className="mt-3 text-center text-[11px] text-[#c98ea1]">
        💗 แอดมินจะพิจารณาและเพิ่มเพลงให้เร็วที่สุดนะคะ 💗
      </p>

      {sent && (
        <p className="mt-2 text-center text-xs font-medium text-[#16a34a]">
          ส่งคำขอเรียบร้อยแล้วค่ะ ขอบคุณนะคะ 💕
        </p>
      )}

      {error && (
        <p className="mt-2 text-center text-xs font-medium text-[#d85f83]">{error}</p>
      )}
    </div>
  );
}

function SectionLabel({ n, label, noMargin }: { n: number; label: string; noMargin?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${noMargin ? "" : "mb-3"}`}>
      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#ec4899] text-[10px] font-bold text-white">
        {n}
      </span>
      <span className="text-sm font-semibold text-[#5d3542]">{label}</span>
    </div>
  );
}

function Field({
  icon,
  label,
  required,
  count,
  max,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  required?: boolean;
  count: number;
  max: number;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-[#5d3542]">
        <span className="text-[#ec4899]">{icon}</span>
        {label} {required && <span className="text-[#ec4899]">*</span>}
      </div>
      {children}
      <div className="mt-1 text-right text-[11px] text-[#c98ea1]">
        {count}/{max}
      </div>
    </div>
  );
}
