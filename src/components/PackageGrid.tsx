"use client";

import { useEffect, useState } from "react";
import { Coins, Gift, Gem, Crown, PawPrint } from "lucide-react";

type Package = {
  id: string;
  title: string;
  price: number;
  coins: number;
  bonusCoins: number;
  imageUrl: string | null;
};

const tierIcons = [Coins, Gift, Gem, Gem, Crown, Crown];
const tierBg = [
  "bg-rose-100 text-rose-400",
  "bg-orange-100 text-orange-400",
  "bg-pink-100 text-pink-500",
  "bg-amber-100 text-amber-500",
  "bg-fuchsia-100 text-fuchsia-500",
  "bg-pink-200 text-pink-600",
];

export default function PackageGrid({ onSelect }: { onSelect?: (pkg: Package) => void }) {
  const [packages, setPackages] = useState<Package[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/topup-packages")
      .then((r) => r.json())
      .then(setPackages)
      .catch(() => setPackages([]));
  }, []);

  const handleSelect = (pkg: Package) => {
    setSelectedId(pkg.id);
    onSelect?.(pkg);
  };

  if (packages === null) {
    return <div className="py-16 text-center text-sm text-pink-300">กำลังโหลดแพ็กเกจ...</div>;
  }

  if (packages.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <PawPrint className="h-8 w-8 text-pink-200" />
        <p className="text-sm text-pink-300">ยังไม่มีแพ็กเกจในตอนนี้</p>
      </div>
    );
  }

  // แพ็กเกจที่คุ้มที่สุด (ราคาต่อพอยด์ต่ำสุด) จะได้ริบบิ้น "คุ้มที่สุดแนะนำ!"
  const bestId = [...packages]
    .filter((p) => p.coins + p.bonusCoins > 0)
    .sort((a, b) => a.price / (a.coins + a.bonusCoins) - b.price / (b.coins + b.bonusCoins))[0]?.id;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {packages.map((pkg, i) => {
        const Icon = tierIcons[i % tierIcons.length];
        const bonusPercent = pkg.coins > 0 ? Math.round((pkg.bonusCoins / pkg.coins) * 100) : 0;
        const isBest = pkg.id === bestId;
        const isSelected = pkg.id === selectedId;

        return (
          <button
            key={pkg.id}
            type="button"
            onClick={() => handleSelect(pkg)}
            className={`relative flex flex-col items-center gap-2 rounded-2xl border-2 bg-white p-4 pt-6 text-center transition hover:-translate-y-0.5 hover:shadow-md dark:bg-gray-900 ${
              isBest
                ? "border-pink-400 dark:border-pink-500"
                : isSelected
                ? "border-pink-300 dark:border-pink-600"
                : "border-pink-100 dark:border-gray-800"
            }`}
          >
            {bonusPercent > 0 && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-pink-500 px-2.5 py-1 text-[11px] font-medium text-white shadow-sm">
                โบนัส +{bonusPercent}%
              </span>
            )}

            {isBest && (
              <span className="absolute -top-3 right-2 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 px-2.5 py-1 text-[11px] font-medium text-white shadow-sm">
                <Crown className="h-3 w-3" />
                ยอดเยี่ยม
              </span>
            )}

            <div className="relative mt-3 h-16 w-16 overflow-hidden rounded-full">
              {pkg.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={pkg.imageUrl} alt={pkg.title} className="h-full w-full object-cover" />
              ) : (
                <div className={`flex h-full w-full items-center justify-center rounded-full ${tierBg[i % tierBg.length]}`}>
                  <Icon className="h-8 w-8" />
                </div>
              )}
            </div>

            <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
              {(pkg.coins + pkg.bonusCoins).toLocaleString()} <span className="text-sm font-medium">พอยด์</span>
            </p>

            <span
              className={`mt-1 w-full rounded-full py-1.5 text-sm font-semibold transition ${
                isBest || isSelected
                  ? "bg-pink-500 text-white"
                  : "border border-pink-200 text-pink-500 dark:border-pink-700 dark:text-pink-300"
              }`}
            >
              ฿ {pkg.price.toLocaleString()}
            </span>
          </button>
        );
      })}
    </div>
  );
}