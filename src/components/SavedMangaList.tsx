// วางไฟล์นี้ทับที่: src/components/SavedMangaList.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpenIcon, CalendarIcon, ChevronRightIcon, HeartIcon, SparkleIcon, TrashIcon } from "./icons/UiIcons";

type SavedItem = {
  slug: string;
  title: string;
  coverUrl?: string;
  category?: string;
  lastChapter?: number;
  readAt?: string; // ISO date string
};

type Props = {
  storageKey: string;
  emptyText: string;
  limit?: number;
};

function readList(key: string): SavedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeList(key: string, list: SavedItem[]) {
  localStorage.setItem(key, JSON.stringify(list));
}

function formatDate(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" });
}

export default function SavedMangaList({ storageKey, emptyText, limit = 3 }: Props) {
  const isHistory = storageKey.toLowerCase().includes("history");
  const heading = isHistory ? "ประวัติอ่านล่าสุด" : "รายการโปรด";
  const viewAllHref = isHistory ? "/history" : "/favorites";
  const viewAllText = isHistory ? "ดูประวัติการอ่านทั้งหมด" : "ดูรายการโปรดทั้งหมด";

  const [items, setItems] = useState<SavedItem[]>([]);

  useEffect(() => {
    setItems(readList(storageKey));
  }, [storageKey]);

  function remove(slug: string) {
    const all = readList(storageKey);
    const next = all.filter((m) => m.slug !== slug);
    writeList(storageKey, next);
    setItems(next);
  }

  const visible = items.slice(0, limit);

  return (
    <div className="panel relative overflow-hidden p-6" aria-hidden={false}>
      {/* ตกแต่งพื้นหลัง */}
      <HeartIcon className="pointer-events-none absolute -right-2 top-6 h-8 w-8 text-[#fbd2de]" aria-hidden="true" />
      <HeartIcon className="pointer-events-none absolute right-10 top-16 h-5 w-5 text-[#f6b9cb]" aria-hidden="true" />
      <SparkleIcon className="pointer-events-none absolute bottom-8 left-3 h-4 w-4 text-[#f6b9cb]" aria-hidden="true" />

      <div className="relative mb-5 flex items-center gap-3">
        <SparkleIcon className="h-4 w-4 shrink-0 text-[#ef7095]" />
        <h2 className="font-display text-xl font-bold text-[#623846] dark:text-[#f0dde3]">{heading}</h2>
        <svg viewBox="0 0 160 20" className="hidden h-4 flex-1 text-[#f3b7c9] sm:block" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 5" strokeLinecap="round">
          <path d="M2 10c20-14 40 14 60 0s40-14 60 0" />
        </svg>
        <HeartIcon className="hidden h-4 w-4 shrink-0 text-[#f3b7c9] sm:block" />
      </div>

      {visible.length === 0 ? (
        <p className="relative rounded-2xl border border-dashed border-[#eccfd8] py-10 text-center text-sm text-[#b58b98] dark:border-[#3d222c] dark:text-[#c9a8b2]">
          {emptyText}
        </p>
      ) : (
        <div className="relative space-y-4">
          {visible.map((item) => {
            const date = formatDate(item.readAt);
            return (
              <div
                key={item.slug}
                className="flex flex-col gap-5 rounded-3xl border border-[#f4dce3] bg-white p-4 shadow-[0_8px_24px_rgba(211,111,139,.08)] sm:flex-row dark:border-[#341c25] dark:bg-[#1a1a1a]"
              >
                <div className="relative w-full shrink-0 overflow-hidden rounded-2xl bg-[#fde6ed] sm:w-32">
                  <div className="aspect-[3/4] w-full">
                    {item.coverUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.coverUrl} alt={item.title} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="absolute -left-1 -top-1 flex h-9 w-7 items-center justify-center rounded-b-lg rounded-tr-lg bg-gradient-to-b from-[#f9769c] to-[#ef4477] shadow">
                    <HeartIcon className="h-3.5 w-3.5 text-white" />
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-center gap-2.5">
                  {item.category && <span className="tag w-fit">{item.category}</span>}

                  <Link href={`/manga/${item.slug}`} className="font-display text-xl font-bold text-[#623846] hover:text-[#ef7095] dark:text-[#f0dde3]">
                    {item.title}
                  </Link>

                  {isHistory && item.lastChapter && (
                    <p className="flex items-center gap-1.5 text-sm text-[#a27886] dark:text-[#c9a8b2]">
                      <BookOpenIcon className="h-4 w-4 text-[#ef7095]" />
                      อ่านล่าสุด <span className="font-semibold text-[#623846] dark:text-[#f0dde3]">ตอนที่ {item.lastChapter}</span>
                    </p>
                  )}

                  {date && (
                    <>
                      <div className="border-t border-dashed border-[#f0d8e0] dark:border-[#341c25]" />
                      <p className="flex items-center gap-1.5 text-sm text-[#a27886] dark:text-[#c9a8b2]">
                        <CalendarIcon className="h-4 w-4" />
                        {date}
                      </p>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => remove(item.slug)}
                    className="mt-1 inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-[#f9769c] to-[#ef4477] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(239,68,119,0.25)] transition hover:-translate-y-0.5"
                  >
                    นำออก
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {items.length > 0 && (
        <Link
          href={viewAllHref}
          className="relative mt-5 flex items-center justify-center gap-2 rounded-full border border-[#f4dce3] bg-white py-3 text-sm font-semibold text-[#ef7095] transition hover:bg-[#fff2f6] dark:border-[#341c25] dark:bg-[#1a1a1a]"
        >
          <SparkleIcon className="h-4 w-4" />
          {viewAllText}
          <ChevronRightIcon className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}