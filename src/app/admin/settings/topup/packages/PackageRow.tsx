"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Coins, Pencil, Trash2 } from "lucide-react";

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

export default function PackageRow({ pkg, isFeatured }: { pkg: Package; isFeatured: boolean }) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(pkg.enabled);
  const [toggling, setToggling] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const bonusPercent = pkg.coins > 0 ? Math.round((pkg.bonusCoins / pkg.coins) * 100) : 0;
  const pricePerPoint = pkg.coins + pkg.bonusCoins > 0 ? pkg.price / (pkg.coins + pkg.bonusCoins) : 0;

  const toggleEnabled = async () => {
    setToggling(true);
    const next = !enabled;
    const res = await fetch(`/api/admin/topup-packages/${pkg.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: next }),
    });
    setToggling(false);
    if (res.ok) {
      setEnabled(next);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    const res = await fetch(`/api/admin/topup-packages/${pkg.id}`, { method: "DELETE" });
    setDeleting(false);
    if (res.ok) {
      router.refresh();
    } else {
      setConfirmingDelete(false);
    }
  };

  return (
    <tr className="relative transition hover:bg-pink-50/60 dark:hover:bg-gray-800/60">
      <td className="px-5 py-4">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-pink-50 dark:bg-pink-500/10">
          {pkg.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={pkg.imageUrl} alt={pkg.title} className="h-full w-full object-cover" />
          ) : (
            <Coins className="h-7 w-7 text-pink-300 dark:text-pink-400/60" />
          )}
        </div>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800 dark:text-gray-100">{pkg.title}</span>
          {isFeatured && (
            <span className="rounded-full bg-pink-500 px-2 py-0.5 text-[10px] font-medium text-white">แนะนำ</span>
          )}
        </div>
        {pkg.description && (
          <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{pkg.description}</div>
        )}
      </td>

      <td className="px-5 py-4 text-center font-medium text-gray-700 dark:text-gray-200">฿ {pkg.price.toLocaleString()}</td>

      <td className="px-5 py-4 text-center text-gray-700 dark:text-gray-200">{pkg.coins.toLocaleString()}</td>

      <td className="px-5 py-4 text-center">
        {pkg.bonusCoins > 0 ? (
          <span className="inline-block rounded-full bg-pink-100 px-2.5 py-1 text-xs font-medium text-pink-600 dark:bg-pink-500/15 dark:text-pink-300">
            โบนัส +{bonusPercent}%
          </span>
        ) : (
          <span className="text-gray-300 dark:text-gray-600">-</span>
        )}
      </td>

      <td className="px-5 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        ฿ {pricePerPoint.toFixed(2)} / พอยด์
      </td>

      <td className="px-5 py-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={toggleEnabled}
            disabled={toggling}
            aria-label="สลับสถานะเปิด/ปิดใช้งาน"
            className={`relative h-6 w-11 rounded-full transition disabled:opacity-50 ${
              enabled ? "bg-emerald-400" : "bg-gray-300 dark:bg-gray-600"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                enabled ? "left-[22px]" : "left-0.5"
              }`}
            />
          </button>
          <span className={`text-xs font-medium ${enabled ? "text-emerald-500" : "text-gray-400 dark:text-gray-500"}`}>
            {enabled ? "เปิดใช้งาน" : "ปิดใช้งาน"}
          </span>
        </div>
      </td>

      <td className="px-5 py-4">
        {confirmingDelete ? (
          <div className="flex items-center justify-end gap-1.5">
            <span className="text-xs text-gray-500 dark:text-gray-400">ลบเลย?</span>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-lg bg-red-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-50"
            >
              {deleting ? "..." : "ยืนยัน"}
            </button>
            <button
              onClick={() => setConfirmingDelete(false)}
              className="rounded-lg px-2.5 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              ยกเลิก
            </button>
          </div>
        ) : (
          <div className="flex justify-end gap-2 pr-1">
            <a
              href={`/admin/settings/topup/packages/${pkg.id}/edit`}
              className="rounded-lg p-2 text-blue-500 transition hover:bg-blue-50 dark:hover:bg-blue-500/10"
              aria-label="แก้ไขแพ็กเกจ"
            >
              <Pencil className="h-5 w-5" />
            </a>
            <button
              onClick={() => setConfirmingDelete(true)}
              className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
              aria-label="ลบแพ็กเกจ"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}