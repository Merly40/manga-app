import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { Coins, Plus, Wallet, Tag, CheckCircle2, PauseCircle } from "lucide-react";
import PackageRow from "./PackageRow";

export default async function TopupPackagesPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session?.user || role !== "ADMIN") {
    redirect("/");
  }

  const packages = await prisma.topupPackage.findMany({
    orderBy: [{ sortOrder: "asc" }, { price: "asc" }],
  });

  const totalCount = packages.length;
  const totalCoins = packages.reduce((sum, p) => sum + p.coins, 0);
  const totalRevenue = packages.reduce((sum, p) => sum + p.price, 0);
  const enabledCount = packages.filter((p) => p.enabled).length;
  const disabledCount = totalCount - enabledCount;

  // แพ็กเกจที่คุ้มที่สุด (ราคาต่อพอยด์ต่ำสุด) จะได้ริบบิ้น "แนะนำ"
  const bestValueId = packages
    .filter((p) => p.enabled && p.coins + p.bonusCoins > 0)
    .sort((a, b) => a.price / (a.coins + a.bonusCoins) - b.price / (b.coins + b.bonusCoins))[0]?.id;

  const stats = [
    {
      label: "แพ็กเกจทั้งหมด",
      value: totalCount.toLocaleString(),
      unit: "รายการ",
      icon: Wallet,
      bg: "bg-pink-100 dark:bg-pink-500/15",
      fg: "text-pink-500 dark:text-pink-300",
    },
    {
      label: "พอยด์ทั้งหมด",
      value: totalCoins.toLocaleString(),
      unit: "พอยด์",
      icon: Coins,
      bg: "bg-indigo-100 dark:bg-indigo-500/15",
      fg: "text-indigo-500 dark:text-indigo-300",
    },
    {
      label: "ยอดขายรวม",
      value: `฿ ${totalRevenue.toLocaleString()}`,
      unit: "บาท",
      icon: Tag,
      bg: "bg-sky-100 dark:bg-sky-500/15",
      fg: "text-sky-500 dark:text-sky-300",
    },
    {
      label: "เปิดใช้งาน",
      value: enabledCount.toLocaleString(),
      unit: "รายการ",
      icon: CheckCircle2,
      bg: "bg-emerald-100 dark:bg-emerald-500/15",
      fg: "text-emerald-500 dark:text-emerald-300",
    },
    {
      label: "ปิดใช้งาน",
      value: disabledCount.toLocaleString(),
      unit: "รายการ",
      icon: PauseCircle,
      bg: "bg-amber-100 dark:bg-amber-500/15",
      fg: "text-amber-500 dark:text-amber-300",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative flex items-center justify-between overflow-hidden rounded-3xl border border-pink-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <CatCorner className="pointer-events-none absolute -right-2 -top-2 h-20 w-20 text-pink-200 dark:text-pink-500/20" />

        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-pink-100 p-3 dark:bg-pink-500/15">
            <PawIcon className="h-6 w-6 text-pink-500 dark:text-pink-300" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#ef7095] dark:text-pink-400">แพ็กเกจเติมพอยต์</h1>
            <p className="text-sm text-[#9b7a86] dark:text-gray-400">จัดการแพ็กเกจเติมพอยต์ทั้งหมด</p>
          </div>
        </div>

        <Link
          href="/admin/settings/topup/packages/new"
          className="relative z-10 flex items-center gap-2 rounded-xl bg-pink-500 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-pink-600"
        >
          <Plus className="h-5 w-5" />
          เพิ่มแพ็กเกจใหม่
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-pink-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <PawIcon className="pointer-events-none absolute -right-1 -top-1 h-10 w-10 text-pink-50 dark:text-gray-800" />
              <div className={`shrink-0 rounded-xl p-2.5 ${s.bg}`}>
                <Icon className={`h-5 w-5 ${s.fg}`} />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                <p className="text-xl font-bold leading-tight text-gray-800 dark:text-gray-100">{s.value}</p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500">{s.unit}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {packages.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <div className="rounded-2xl bg-pink-50 p-4 dark:bg-pink-500/10">
              <PawIcon className="h-8 w-8 text-pink-300 dark:text-pink-400/60" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">ยังไม่มีแพ็กเกจเติมพอยต์ เริ่มสร้างแพ็กเกจแรกกันเลย</p>
            <Link
              href="/admin/settings/topup/packages/new"
              className="mt-1 flex items-center gap-2 rounded-xl bg-pink-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-pink-600"
            >
              <Plus className="h-4 w-4" />
              เพิ่มแพ็กเกจใหม่
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-pink-50 dark:bg-pink-500/10">
              <tr>
                <th className="px-5 py-4 text-left text-sm font-semibold text-[#b25777] dark:text-pink-300">รูป</th>
                <th className="px-5 py-4 text-left text-sm font-semibold text-[#b25777] dark:text-pink-300">ชื่อแพ็กเกจ</th>
                <th className="px-5 py-4 text-center text-sm font-semibold text-[#b25777] dark:text-pink-300">ราคา</th>
                <th className="px-5 py-4 text-center text-sm font-semibold text-[#b25777] dark:text-pink-300">เหรียญ</th>
                <th className="px-5 py-4 text-center text-sm font-semibold text-[#b25777] dark:text-pink-300">โบนัส</th>
                <th className="px-5 py-4 text-center text-sm font-semibold text-[#b25777] dark:text-pink-300">ราคาต่อพอยด์</th>
                <th className="px-5 py-4 text-center text-sm font-semibold text-[#b25777] dark:text-pink-300">สถานะ</th>
                <th className="px-5 py-4 text-right text-sm font-semibold text-[#b25777] dark:text-pink-300">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50 dark:divide-gray-800">
              {packages.map((pkg) => (
                <PackageRow key={pkg.id} pkg={pkg} isFeatured={pkg.id === bestValueId} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function PawIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="7" cy="9" r="2.1" />
      <circle cx="12" cy="7" r="2.1" />
      <circle cx="17" cy="9" r="2.1" />
      <path d="M12 12c-3.3 0-6 2-6 4.6 0 1.9 1.6 3 3.3 2.2 1-.5 1.8-.5 2.7 0 1.7.8 3.3-.3 3.3-2.2 0-2.6-2.7-4.6-6-4.6Z" />
    </svg>
  );
}

function CatCorner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M6 3.2c.4 1.4.9 2.7 1.6 3.7a8 8 0 0 1 8.8 0c.7-1 1.2-2.3 1.6-3.7.2-.7 1.2-.6 1.3.1.3 2.1.1 4-.6 5.6A8 8 0 1 1 5.3 8.9c-.7-1.6-.9-3.5-.6-5.6.1-.7 1.1-.8 1.3-.1Z" />
    </svg>
  );
}