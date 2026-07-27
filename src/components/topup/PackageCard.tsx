"use client";

import { Coins, Crown, PawPrint } from "lucide-react";
import clsx from "clsx";

type Props = {
  title: string;
  imageUrl?: string | null;
  coins: number;
  bonusCoins: number;
  price: number;
  active?: boolean;
  recommended?: boolean;
  onClick?: () => void;
};

export default function PackageCard({
  title,
  imageUrl,
  coins,
  bonusCoins,
  price,
  active,
  recommended,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "group relative overflow-visible rounded-[28px] border bg-white p-5 text-left shadow-sm transition-all duration-300 dark:bg-zinc-900",
        active
          ? "border-pink-500 shadow-lg shadow-pink-500/20 ring-2 ring-pink-200 dark:ring-pink-500/30"
          : "border-pink-100 hover:-translate-y-1 hover:border-pink-300 hover:shadow-lg dark:border-zinc-800 dark:hover:border-pink-500/40"
      )}
    >
      {recommended && (
        <div className="absolute -top-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-3.5 py-1 text-[11px] font-bold text-white shadow">
          <Crown className="h-3 w-3" />
          ยอดนิยม
        </div>
      )}

      {bonusCoins > 0 && (
        <div className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
          โบนัส +{bonusCoins.toLocaleString()}
        </div>
      )}

      <div className="relative mt-9 flex justify-center">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={title}
            className="h-32 object-contain transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-pink-50 dark:bg-zinc-800">
            <Coins className="h-14 w-14 text-pink-400 dark:text-pink-300" />
          </div>
        )}
      </div>

      <div className="mt-5 text-center">
        <p className="mb-1.5 flex items-center justify-center gap-1 text-sm font-semibold text-pink-500 dark:text-pink-300">
          <PawPrint className="h-3.5 w-3.5" />
          {title}
        </p>

        <h3 className="text-3xl font-extrabold text-zinc-800 dark:text-white">
          {coins.toLocaleString()}
        </h3>

        <p className="text-xs text-zinc-500 dark:text-zinc-400">พอยต์</p>
      </div>

      <div className="mt-5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 py-2.5 text-center text-base font-bold text-white shadow-sm">
        ฿ {price.toLocaleString()}
      </div>

    </button>
  );
}