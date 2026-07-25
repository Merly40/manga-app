"use client";

import { useMemo, useState } from "react";
import { Coins, PawPrint } from "lucide-react";
import PackageCard from "./PackageCard";

type TopupPackage = {
  id: string;
  title: string;
  imageUrl: string | null;
  price: number;
  coins: number;
  bonusCoins: number;
};

type Props = {
  packages: TopupPackage[];
};

export default function TopupClient({ packages }: Props) {
  const [selectedId, setSelectedId] = useState(packages[0]?.id ?? "");

  const [customCoins, setCustomCoins] = useState(0);

  const selectedPackage = useMemo(() => {
    return packages.find((p) => p.id === selectedId);
  }, [packages, selectedId]);

  const usingCustom = customCoins > 0;

  const totalCoins = usingCustom ? customCoins : (selectedPackage?.coins ?? 0);

  const totalBonus = usingCustom ? 0 : (selectedPackage?.bonusCoins ?? 0);

  const totalPrice = usingCustom ? customCoins : (selectedPackage?.price ?? 0);

  function selectPackage(id: string) {
    setCustomCoins(0);
    setSelectedId(id);
  }

  function addCoins(value: number) {
    setSelectedId("");
    setCustomCoins((prev) => prev + value);
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[2fr_380px]">
      {/* ซ้าย */}
      <div className="rounded-[32px] border border-pink-200/60 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 sm:p-7">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-zinc-800 dark:text-white">
            <PawPrint className="h-5 w-5 text-pink-400" />
            เลือกแพ็กเกจเติมพอยต์
          </h2>

          <span className="rounded-full bg-pink-100 px-4 py-1.5 text-xs font-bold text-pink-600 dark:bg-pink-500/10 dark:text-pink-300">
            คุ้มที่สุดแนะนำ!
          </span>
        </div>

        {packages.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-pink-200 bg-pink-50/60 p-10 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-400">
            ยังไม่มีแพ็กเกจ
          </div>
        ) : (
          <div className="grid gap-5 pt-2 sm:grid-cols-2 xl:grid-cols-3">
            {packages.map((pkg, index) => (
              <PackageCard
                key={pkg.id}
                title={pkg.title}
                imageUrl={pkg.imageUrl}
                coins={pkg.coins}
                bonusCoins={pkg.bonusCoins}
                price={pkg.price}
                recommended={index === 2}
                active={selectedId === pkg.id}
                onClick={() => selectPackage(pkg.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ขวา */}
      <div className="h-fit rounded-[32px] border border-pink-200/60 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="flex items-center gap-2 text-xl font-bold text-zinc-800 dark:text-white">
          <PawPrint className="h-4.5 w-4.5 text-pink-400" />
          หรือกรอกจำนวนพอยต์ที่ต้องการ
        </h3>

        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">พอยต์ละ 1 บาท</p>

        <input
          type="number"
          min={0}
          value={customCoins || ""}
          onChange={(e) => {
            setSelectedId("");
            setCustomCoins(Number(e.target.value));
          }}
          placeholder="0"
          className="mt-5 w-full rounded-2xl border border-pink-200 bg-pink-50/40 p-4 text-3xl font-bold text-zinc-800 outline-none transition focus:border-pink-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
        />

        <div className="mt-4 grid grid-cols-3 gap-2.5">
          {[100, 300, 500, 1000, 2000, 5000].map((coin) => (
            <button
              key={coin}
              type="button"
              onClick={() => addCoins(coin)}
              className="rounded-2xl border border-pink-200 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-pink-400 hover:bg-pink-500 hover:text-white dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-pink-500"
            >
              +{coin.toLocaleString()}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-3 rounded-2xl bg-pink-50 p-5 dark:bg-zinc-800/60">
          <div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-300">
            <span>พอยต์</span>
            <span className="font-bold text-zinc-800 dark:text-white">
              {totalCoins.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-300">
            <span>โบนัส</span>
            <span className="font-bold text-pink-500 dark:text-pink-300">
              +{totalBonus.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-pink-100 pt-3 dark:border-zinc-700">
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">ยอดชำระ</span>
            <span className="text-2xl font-extrabold text-pink-500 dark:text-pink-300">
              ฿{totalPrice.toLocaleString()}
            </span>
          </div>
        </div>

        <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 py-3.5 text-base font-bold text-white shadow-sm transition hover:scale-[1.02]">
          <Coins className="h-5 w-5" />
          ดำเนินการชำระเงิน
        </button>
      </div>
    </section>
  );
}