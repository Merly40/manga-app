"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Coins, Pencil, Trash2, ChevronUp, ChevronDown, GripVertical, Save, X, Plus } from "lucide-react";

type Package = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  coins: number;
  bonusCoins: number;
  imageUrl: string | null;
  enabled: boolean;
};

type Row = {
  id: string;
  title: string;
  description: string;
  price: number;
  coins: number;
  bonusPercent: number;
  enabled: boolean;
  imageUrl: string | null;
};

const DESCRIPTION_MAX = 100;

function toRows(packages: Package[]): Row[] {
  return packages.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description ?? "",
    price: p.price,
    coins: p.coins,
    bonusPercent: p.coins > 0 ? Math.round((p.bonusCoins / p.coins) * 100) : 0,
    enabled: p.enabled,
    imageUrl: p.imageUrl,
  }));
}

export default function PackageEditor({ initialPackages }: { initialPackages: Package[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>(() => toRows(initialPackages));
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function updateRow(id: string, patch: Partial<Row>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    setDirty(true);
  }

  function moveRow(index: number, dir: -1 | 1) {
    setRows((prev) => {
      const target = index + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setDirty(true);
  }

  function handleDrop(index: number) {
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null);
      return;
    }
    setRows((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(null);
    setDirty(true);
  }

  function cancelChanges() {
    setRows(toRows(initialPackages));
    setDirty(false);
  }

  async function saveChanges() {
    setSaving(true);
    try {
      await Promise.all(
        rows.map((r, index) =>
          fetch(`/api/admin/topup-packages/${r.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: r.title,
              description: r.description,
              price: r.price,
              coins: r.coins,
              bonusCoins: Math.round((r.coins * r.bonusPercent) / 100),
              enabled: r.enabled,
              sortOrder: index,
            }),
          })
        )
      );
      setDirty(false);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function deleteRow(id: string) {
    const res = await fetch(`/api/admin/topup-packages/${id}`, { method: "DELETE" });
    if (res.ok) {
      setRows((prev) => prev.filter((r) => r.id !== id));
      router.refresh();
    }
    setConfirmDeleteId(null);
  }

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-1 text-sm text-gray-400 dark:text-gray-500">
        <Link href="/admin" className="hover:text-pink-500">
          หน้าแรก
        </Link>
        <span>/</span>
        <Link href="/admin/settings/topup/packages" className="hover:text-pink-500">
          จัดการเติมพอยต์
        </Link>
        <span>/</span>
        <span className="text-gray-600 dark:text-gray-300">แก้ไขรายละเอียดแพ็กเกจ</span>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-pink-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-pink-100 p-3 dark:bg-pink-500/15">
            <WalletIcon className="h-6 w-6 text-pink-500 dark:text-pink-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#ef7095] dark:text-pink-400">แก้ไขรายละเอียดแพ็กเกจ</h1>
            <p className="text-sm text-[#9b7a86] dark:text-gray-400">
              จัดการข้อมูลแพ็กเกจเติมพอยต์ ปรับแต่งราคา โบนัส และลำดับการแสดงผล
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/settings/topup/packages/new"
            className="flex items-center gap-1.5 rounded-xl border border-pink-200 px-4 py-2.5 text-sm font-medium text-pink-500 transition hover:bg-pink-50 dark:border-pink-500/30 dark:hover:bg-pink-500/10"
          >
            <Plus className="h-4 w-4" />
            เพิ่มแพ็กเกจใหม่
          </Link>
          <button
            type="button"
            onClick={cancelChanges}
            disabled={!dirty || saving}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={saveChanges}
            disabled={!dirty || saving}
            className="flex items-center gap-1.5 rounded-xl bg-pink-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
          </button>
        </div>
      </div>

      {/* Hint banner */}
      <div className="flex items-center gap-2 rounded-2xl bg-pink-50 px-5 py-3 text-sm text-pink-600 dark:bg-pink-500/10 dark:text-pink-300">
        <GripVertical className="h-4 w-4 shrink-0" />
        ลากไอคอน
        <span className="rounded-md bg-white px-1.5 py-0.5 text-pink-400 dark:bg-gray-900">⠿</span>
        เพื่อย้ายตำแหน่งแพ็กเกจขึ้น-ลง (ลำดับที่ 1 จะแสดงเป็นรายการแรก)
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {rows.length === 0 ? (
          <p className="p-10 text-center text-sm text-gray-500 dark:text-gray-400">ยังไม่มีแพ็กเกจ</p>
        ) : (
          <table className="w-full">
            <thead className="bg-pink-50 dark:bg-pink-500/10">
              <tr>
                <th className="w-16 px-4 py-4 text-left text-sm font-semibold text-[#b25777] dark:text-pink-300">ลำดับ</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-[#b25777] dark:text-pink-300">แพ็กเกจ</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-[#b25777] dark:text-pink-300">พอยต์</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-[#b25777] dark:text-pink-300">ราคา (บาท)</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-[#b25777] dark:text-pink-300">โบนัส</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-[#b25777] dark:text-pink-300">รายละเอียด</th>
                <th className="px-4 py-4 text-center text-sm font-semibold text-[#b25777] dark:text-pink-300">สถานะ</th>
                <th className="px-4 py-4 text-right text-sm font-semibold text-[#b25777] dark:text-pink-300">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50 dark:divide-gray-800">
              {rows.map((row, index) => (
                <tr
                  key={row.id}
                  draggable
                  onDragStart={() => setDragIndex(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(index)}
                  className={`align-top transition ${dragIndex === index ? "opacity-40" : ""}`}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
                      <GripVertical className="h-4 w-4 cursor-grab active:cursor-grabbing" />
                      <span className="font-semibold text-gray-700 dark:text-gray-200">{index + 1}</span>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-pink-50 dark:bg-pink-500/10">
                        {row.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={row.imageUrl} alt={row.title} className="h-full w-full object-cover" />
                        ) : (
                          <Coins className="h-6 w-6 text-pink-300 dark:text-pink-400/60" />
                        )}
                      </div>
                      <input
                        value={row.title}
                        onChange={(e) => updateRow(row.id, { title: e.target.value })}
                        className="w-36 rounded-lg border-0 border-b border-transparent bg-transparent px-1 py-1 font-semibold text-gray-800 outline-none transition focus:border-pink-400 dark:text-gray-100"
                      />
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <input
                      type="number"
                      value={row.coins}
                      onChange={(e) => updateRow(row.id, { coins: Number(e.target.value) })}
                      className="w-24 rounded-lg border-b border-pink-100 bg-transparent px-1 py-1 font-medium text-gray-800 outline-none transition focus:border-pink-400 dark:border-gray-700 dark:text-gray-100"
                    />
                    <p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">พอยต์</p>
                  </td>

                  <td className="px-4 py-4">
                    <input
                      type="number"
                      value={row.price}
                      onChange={(e) => updateRow(row.id, { price: Number(e.target.value) })}
                      className="w-20 rounded-lg border-b border-pink-100 bg-transparent px-1 py-1 font-medium text-gray-800 outline-none transition focus:border-pink-400 dark:border-gray-700 dark:text-gray-100"
                    />
                    <p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">บาท</p>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 rounded-full bg-pink-100 px-2.5 py-1 dark:bg-pink-500/15">
                      <span className="text-xs font-bold text-pink-600 dark:text-pink-300">+</span>
                      <input
                        type="number"
                        value={row.bonusPercent}
                        onChange={(e) => updateRow(row.id, { bonusPercent: Number(e.target.value) })}
                        className="w-10 bg-transparent text-xs font-bold text-pink-600 outline-none dark:text-pink-300"
                      />
                      <span className="text-xs font-bold text-pink-600 dark:text-pink-300">%</span>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <textarea
                      value={row.description}
                      maxLength={DESCRIPTION_MAX}
                      onChange={(e) => updateRow(row.id, { description: e.target.value })}
                      rows={2}
                      className="w-48 resize-none rounded-lg border border-pink-100 bg-transparent p-2 text-xs text-gray-600 outline-none transition focus:border-pink-400 dark:border-gray-700 dark:text-gray-300"
                    />
                    <p className="mt-0.5 text-right text-[10px] text-gray-400 dark:text-gray-500">
                      {row.description.length}/{DESCRIPTION_MAX}
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex flex-col items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateRow(row.id, { enabled: !row.enabled })}
                        className={`relative h-6 w-11 rounded-full transition ${
                          row.enabled ? "bg-emerald-400" : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                            row.enabled ? "left-[22px]" : "left-0.5"
                          }`}
                        />
                      </button>
                      <span className={`text-[11px] font-medium ${row.enabled ? "text-emerald-500" : "text-gray-400"}`}>
                        {row.enabled ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex flex-col items-end gap-1.5">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => moveRow(index, -1)}
                          disabled={index === 0}
                          className="rounded-lg border border-gray-200 p-1.5 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                          aria-label="ย้ายขึ้น"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveRow(index, 1)}
                          disabled={index === rows.length - 1}
                          className="rounded-lg border border-gray-200 p-1.5 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                          aria-label="ย้ายลง"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>

                      {confirmDeleteId === row.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => deleteRow(row.id)}
                            className="rounded-lg bg-red-500 px-2 py-1 text-[11px] font-medium text-white hover:bg-red-600"
                          >
                            ยืนยัน
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="rounded-lg px-2 py-1 text-[11px] text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                          >
                            ยกเลิก
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(row.id)}
                          className="rounded-lg p-1.5 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                          aria-label="ลบแพ็กเกจ"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer note */}
      <div className="relative overflow-hidden rounded-3xl border border-pink-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <CatMascot className="pointer-events-none absolute -bottom-2 -right-2 h-16 w-16 text-pink-100 dark:text-pink-500/10" />
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">หมายเหตุ</p>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          การเปลี่ยนแปลงจะมีผลทันทีหลังบันทึกข้อมูล โปรดตรวจสอบความถูกต้องก่อนบันทึกทุกครั้ง
        </p>
        <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">ทั้งหมด {rows.length} รายการ</p>
      </div>
    </div>
  );
}

function WalletIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <rect x="3" y="6" width="18" height="13" rx="2.5" />
      <path d="M3 10h18" />
      <circle cx="16" cy="14" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CatMascot({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M6 3.2c.4 1.4.9 2.7 1.6 3.7a8 8 0 0 1 8.8 0c.7-1 1.2-2.3 1.6-3.7.2-.7 1.2-.6 1.3.1.3 2.1.1 4-.6 5.6A8 8 0 1 1 5.3 8.9c-.7-1.6-.9-3.5-.6-5.6.1-.7 1.1-.8 1.3-.1Z" />
    </svg>
  );
}
