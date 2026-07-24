// วางไฟล์นี้ทับที่: src/components/ReadingActions.tsx
// รองรับ 2 โหมดในคอมโพเนนต์เดียว:
//  - โหมดหน้ารายละเอียดเรื่อง: ไม่ส่ง prop `chapter` มา -> โชว์ "อ่านต่อ ตอนที่ N" + ปุ่มสามจุด (แชร์/แจ้งปัญหา)
//  - โหมดหน้าอ่านตอน: ส่ง prop `chapter` + `recordHistory` + `chapterNumbers` มา -> โชว์แค่ "ตอนที่ N" กดลูกศรเลือกตอนอื่นได้ ไม่มีปุ่มสามจุด
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpenIcon, BookmarkIcon, ChevronDownIcon, DotsIcon, HeartIcon } from "./icons/UiIcons";

type MangaMeta = { slug: string; title: string; coverUrl: string; category: string };

type Props = {
  manga: MangaMeta;
  mangaId: string;
  isLoggedIn: boolean;
  initialFavorited: boolean;
  /** ใช้ตอนอยู่หน้ารายละเอียดเรื่อง: ตอนแรกสุด (ค่าเริ่มต้นถ้ายังไม่เคยอ่าน) */
  firstChapterNumber?: number;
  /** ใช้ตอนอยู่หน้าอ่านตอน: เลขตอนที่กำลังอ่านอยู่ตอนนี้ — มี prop นี้ = โหมดหน้าอ่านตอนทันที */
  chapter?: number;
  /** true = บันทึกตอนนี้ลง localStorage ว่าเป็นตอนล่าสุดที่อ่าน (เรียกจากหน้าอ่านตอน) */
  recordHistory?: boolean;
  /** เลขตอนทั้งหมดของเรื่อง เรียงจากน้อยไปมาก ใช้ทำ dropdown เลือกตอน (หน้าอ่านตอน) */
  chapterNumbers?: number[];
};

const HISTORY_KEY = "manga-neko-history";
const FAVORITES_KEY = "manga-neko-favorites";

function readList(key: string): any[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeList(key: string, list: any[]) {
  localStorage.setItem(key, JSON.stringify(list));
}

export default function ReadingActions({
  manga,
  mangaId,
  isLoggedIn,
  initialFavorited,
  firstChapterNumber,
  chapter,
  recordHistory,
  chapterNumbers,
}: Props) {
  const router = useRouter();
  const isReaderMode = typeof chapter === "number";

  const [continueChapter, setContinueChapter] = useState<number>(chapter ?? firstChapterNumber ?? 1);
  const [isFavorite, setIsFavorite] = useState(initialFavorited);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [chapterMenuOpen, setChapterMenuOpen] = useState(false);
  const chapterBoxRef = useRef<HTMLDivElement>(null);

  // หน้ารายละเอียดเรื่อง: หาว่าเคยอ่านค้างไว้ตอนไหน เพื่อโชว์ "อ่านต่อ ตอนที่ N" ให้ตรง
  useEffect(() => {
    if (isReaderMode) return;
    const history = readList(HISTORY_KEY);
    const entry = history.find((m) => m.slug === manga.slug);
    if (entry?.lastChapter) setContinueChapter(entry.lastChapter);
  }, [isReaderMode, manga.slug]);

  // หน้าอ่านตอน: บันทึกตอนนี้เป็นตอนล่าสุดที่อ่าน
  useEffect(() => {
    if (!recordHistory || !isReaderMode) return;
    const history = readList(HISTORY_KEY);
    const others = history.filter((m) => m.slug !== manga.slug);
    writeList(HISTORY_KEY, [...others, { ...manga, lastChapter: chapter, readAt: new Date().toISOString() }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordHistory, isReaderMode, manga.slug, chapter]);

  // สถานะรายการโปรดเริ่มต้น: ถ้ายังไม่ล็อกอิน ใช้ localStorage เป็นตัวสำรอง
  useEffect(() => {
    if (isLoggedIn) return;
    const favorites = readList(FAVORITES_KEY);
    setIsFavorite(favorites.some((m) => m.slug === manga.slug));
  }, [isLoggedIn, manga.slug]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (chapterBoxRef.current && !chapterBoxRef.current.contains(e.target as Node)) setChapterMenuOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function toggleFavorite() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setLoadingFavorite(true);
    try {
      const res = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mangaId }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setIsFavorite(data.following);

      const favorites = readList(FAVORITES_KEY);
      const exists = favorites.some((m) => m.slug === manga.slug);
      if (data.following && !exists) writeList(FAVORITES_KEY, [...favorites, { ...manga, readAt: new Date().toISOString() }]);
      if (!data.following && exists) writeList(FAVORITES_KEY, favorites.filter((m) => m.slug !== manga.slug));

      router.refresh();
    } finally {
      setLoadingFavorite(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {isReaderMode ? (
        <div className="relative" ref={chapterBoxRef}>
          <button
            type="button"
            onClick={() => setChapterMenuOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f9769c] to-[#ef4477] px-7 py-3.5 font-display text-base font-semibold text-white shadow-[0_10px_20px_rgba(239,68,119,0.28)] transition hover:-translate-y-0.5"
          >
            <BookOpenIcon className="h-5 w-5" />
            ตอนที่ {chapter}
            <ChevronDownIcon className={`h-4 w-4 opacity-90 transition-transform ${chapterMenuOpen ? "rotate-180" : ""}`} />
            <span className="ml-1 flex items-center -space-x-1 opacity-90">
              <HeartIcon className="h-3 w-3" />
              <HeartIcon className="h-3.5 w-3.5" />
            </span>
          </button>

          {chapterMenuOpen && chapterNumbers && chapterNumbers.length > 0 && (
            <div className="absolute left-0 top-[calc(100%+8px)] z-20 max-h-72 w-36 overflow-y-auto rounded-2xl border border-[#f2dce3] bg-white p-2 shadow-[0_10px_30px_rgba(239,68,119,0.15)] dark:border-[#3d222c] dark:bg-[#1a1a1a]">
              {chapterNumbers.map((n) => (
                <Link
                  key={n}
                  href={`/manga/${manga.slug}/${n}`}
                  onClick={() => setChapterMenuOpen(false)}
                  className={`block rounded-xl px-3 py-2 text-sm transition ${
                    n === chapter
                      ? "bg-[#fde4ec] font-semibold text-[#df6488] dark:bg-[#2a1620] dark:text-[#f4a9bf]"
                      : "text-[#623846] hover:bg-[#fff2f6] dark:text-[#f0dde3] dark:hover:bg-[#2a1620]"
                  }`}
                >
                  ตอนที่ {n}
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        <Link
          href={`/manga/${manga.slug}/${continueChapter}`}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f9769c] to-[#ef4477] px-7 py-3.5 font-display text-base font-semibold text-white shadow-[0_10px_20px_rgba(239,68,119,0.28)] transition hover:-translate-y-0.5"
        >
          <BookOpenIcon className="h-5 w-5" />
          อ่านต่อ ตอนที่ {continueChapter}
          <ChevronDownIcon className="h-4 w-4 opacity-90" />
          <span className="ml-1 flex items-center -space-x-1 opacity-90">
            <HeartIcon className="h-3 w-3" />
            <HeartIcon className="h-3.5 w-3.5" />
          </span>
        </Link>
      )}

      <button
        type="button"
        onClick={toggleFavorite}
        disabled={loadingFavorite}
        className={`inline-flex items-center gap-2 rounded-full border px-6 py-3.5 font-display text-sm font-semibold transition disabled:opacity-60 ${
          isFavorite
            ? "border-[#ef7095] bg-[#fde4ec] text-[#df6488]"
            : "border-[#f2dce3] bg-white text-[#623846] hover:bg-[#fff2f6] dark:border-[#3d222c] dark:bg-[#1a1a1a] dark:text-[#f0dde3]"
        }`}
      >
        <BookmarkIcon className="h-5 w-5" filled={isFavorite} />
        {isFavorite ? "อยู่ในรายการโปรดแล้ว" : "เพิ่มในรายการโปรด"}
      </button>

      {!isReaderMode && (
        <div className="relative">
          <button
            type="button"
            aria-label="เพิ่มเติม"
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex h-[52px] w-[52px] items-center justify-center rounded-full border border-[#f2dce3] bg-white text-[#a98591] transition hover:bg-[#fff2f6] dark:border-[#3d222c] dark:bg-[#1a1a1a]"
          >
            <DotsIcon className="h-5 w-5" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-[58px] z-10 w-44 rounded-2xl border border-[#f2dce3] bg-white p-2 shadow-[0_10px_30px_rgba(239,68,119,0.12)] dark:border-[#3d222c] dark:bg-[#1a1a1a]">
              <button type="button" className="w-full rounded-xl px-3 py-2 text-left text-sm text-[#623846] hover:bg-[#fff2f6] dark:text-[#f0dde3] dark:hover:bg-[#2a1620]">
                แชร์เรื่องนี้
              </button>
              <button type="button" className="w-full rounded-xl px-3 py-2 text-left text-sm text-[#623846] hover:bg-[#fff2f6] dark:text-[#f0dde3] dark:hover:bg-[#2a1620]">
                แจ้งปัญหา
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}