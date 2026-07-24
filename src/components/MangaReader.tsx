"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import NightModeToggle from "./NightModeToggle";
import { ZoomInIcon, ZoomOutIcon, ArrowUpIcon, ArrowDownIcon, BookIcon, CommentIcon, FullscreenIcon, LockIcon, CurrentIcon, ChevronLeftIcon, ChevronRightIcon } from "./icons/ReaderIcons";

type Page = { id: string; order: number; imageUrl: string };
type ChapterListItem = {
  number: number;
  title: string;
  locked: boolean;
  isCurrent: boolean;
  publishedAt: string;
};

type Props = {
  slug: string;
  pages: Page[];
  hasAccess: boolean;
  lockedContent?: ReactNode;
  chapters: ChapterListItem[];
};

const BACKGROUNDS = [
  { id: "white", label: "ขาว", value: "#ffffff" },
  { id: "cream", label: "ครีม", value: "#fbf3e3" },
  { id: "pink", label: "ชมพู", value: "#fff0f4" },
  { id: "black", label: "ดำ", value: "#121212" },
];

const READ_MODES = [
  { id: "vertical", label: "ปกติ" },
  { id: "horizontal", label: "จากซ้ายไปขวา" },
] as const;

const SCROLL_SPEEDS = [
  { id: "slow", label: "ปกติ", px: 1 },
  { id: "fast", label: "เร็ว", px: 2.5 },
  { id: "fastest", label: "เร็วมาก", px: 5 },
] as const;

export default function MangaReader({ slug, pages, hasAccess, lockedContent, chapters }: Props) {
  const [zoom, setZoom] = useState(100);
  const [bg, setBg] = useState(BACKGROUNDS[0].value);
  const [mode, setMode] = useState<(typeof READ_MODES)[number]["id"]>("vertical");
  const [speed, setSpeed] = useState<(typeof SCROLL_SPEEDS)[number]["id"]>("slow");
  const [autoScroll, setAutoScroll] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const scrollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setPageIndex(0);
  }, [mode, pages]);

  useEffect(() => {
    if (autoScroll) {
      const step = SCROLL_SPEEDS.find((s) => s.id === speed)?.px ?? 1;
      scrollTimer.current = setInterval(() => window.scrollBy(0, step), 16);
    } else if (scrollTimer.current) {
      clearInterval(scrollTimer.current);
    }
    return () => {
      if (scrollTimer.current) clearInterval(scrollTimer.current);
    };
  }, [autoScroll, speed]);

  const orderedPages = pages;
  const isPaged = mode !== "vertical";
  const currentPage = orderedPages[pageIndex];
  const goPrev = () => setPageIndex((i) => Math.max(i - 1, 0));
  const goNext = () => setPageIndex((i) => Math.min(i + 1, orderedPages.length - 1));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[56px_1fr_300px]">
      {/* Floating left toolbar */}
      <aside className="hidden lg:sticky lg:top-24 lg:flex lg:h-fit lg:flex-col lg:items-center lg:gap-2">
        <ToolIcon label="ซูมเข้า" onClick={() => setZoom((z) => Math.min(z + 10, 150))}><ZoomInIcon /></ToolIcon>
        <span className="text-[11px] text-[#a9838f]">{zoom}%</span>
        <ToolIcon label="ซูมออก" onClick={() => setZoom((z) => Math.max(z - 10, 10))}><ZoomOutIcon /></ToolIcon>
        <div className="my-1 h-px w-8 bg-[#f2dce3]" />
        <ToolIcon label="เลื่อนกลับขึ้นบนสุด" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><ArrowUpIcon /></ToolIcon>
        <ToolIcon label="เลื่อนไปท้ายตอน" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}><ArrowDownIcon /></ToolIcon>
        <div className="my-1 h-px w-8 bg-[#f2dce3]" />
        <a href="#chapter-list" title="สารบัญ" className="outline-btn !flex !w-9 !items-center !justify-center !rounded-full !p-2.5 !px-0"><BookIcon /></a>
        <a href="#comments" title="คอมเมนต์" className="outline-btn !flex !w-9 !items-center !justify-center !rounded-full !p-2.5 !px-0"><CommentIcon /></a>
        <div className="[&>button]:!flex [&>button]:!w-9 [&>button]:!items-center [&>button]:!justify-center [&>button]:!rounded-full [&>button]:!p-2.5 [&>button]:!px-0">
          <NightModeToggle />
        </div>
        <ToolIcon
          label="เต็มจอ"
          onClick={() => {
            if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
            else document.exitFullscreen?.();
          }}
        >
          <FullscreenIcon />
        </ToolIcon>
      </aside>

      {/* Main reading column */}
      <div>
        {hasAccess ? (
          <div
            className="relative overflow-hidden rounded-2xl border border-[#f0d8e0]"
            style={{ background: bg }}
          >
            {isPaged ? (
              <div className="relative flex min-h-[400px] items-center justify-center py-4">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={pageIndex === 0}
                  aria-label="หน้าก่อนหน้า"
                  className="absolute left-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white transition hover:bg-black/60 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronLeftIcon />
                </button>

                {currentPage && (
                  <div style={{ width: `${zoom}%`, maxWidth: "100%" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentPage.imageUrl}
                      alt={`หน้า ${currentPage.order + 1}`}
                      className="block h-auto w-full select-none"
                      draggable={false}
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={goNext}
                  disabled={pageIndex === orderedPages.length - 1}
                  aria-label="หน้าถัดไป"
                  className="absolute right-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white transition hover:bg-black/60 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronRightIcon />
                </button>

                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/45 px-3 py-1 text-xs text-white">
                  หน้า {pageIndex + 1} / {orderedPages.length}
                </span>
              </div>
            ) : (
              <div
                className="flex flex-col"
                style={{ width: `${zoom}%`, margin: "0 auto" }}
              >
                {orderedPages.map((p, i) => (
                  <div
                    key={p.id}
                    className="w-full leading-none"
                    style={{ marginBottom: i === orderedPages.length - 1 ? 0 : "-1px" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.imageUrl} alt={`หน้า ${p.order + 1}`} className="block h-auto w-full select-none" draggable={false} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          lockedContent
        )}
      </div>

      {/* Right sidebar: settings + chapter list */}
      <aside className="flex flex-col gap-6">
        <div className="panel p-5">
          <h3 className="mb-4 font-display text-base font-bold text-[#623846]">ตั้งค่าการอ่าน</h3>

          <div className="mb-4">
            <p className="mb-2 text-xs font-medium text-[#a9838f]">โหมดการอ่าน</p>
            <div className="flex flex-wrap gap-1.5">
              {READ_MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id)}
                  className={mode === m.id ? "pink-btn !px-3 !py-1.5 !text-xs" : "outline-btn !px-3 !py-1.5 !text-xs"}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <p className="mb-2 text-xs font-medium text-[#a9838f]">พื้นหลัง</p>
            <div className="flex gap-2">
              {BACKGROUNDS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  title={b.label}
                  onClick={() => setBg(b.value)}
                  className="h-7 w-7 rounded-full border-2 transition"
                  style={{
                    background: b.value,
                    borderColor: bg === b.value ? "#ef7095" : "#e9d3da",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="mb-4">
            <p className="mb-2 text-xs font-medium text-[#a9838f]">ขนาดตัวอักษร</p>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setZoom((z) => Math.max(z - 10, 10))} className="outline-btn !h-8 !w-8 !p-0 !text-sm">A-</button>
              <span className="text-sm text-[#623846]">{zoom}%</span>
              <button type="button" onClick={() => setZoom((z) => Math.min(z + 10, 150))} className="outline-btn !h-8 !w-8 !p-0 !text-sm">A+</button>
            </div>
          </div>

          <div className="mb-4">
            <p className="mb-2 text-xs font-medium text-[#a9838f]">ความเร็วการเลื่อน</p>
            <div className="flex flex-wrap gap-1.5">
              {SCROLL_SPEEDS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSpeed(s.id)}
                  className={speed === s.id ? "pink-btn !px-3 !py-1.5 !text-xs" : "outline-btn !px-3 !py-1.5 !text-xs"}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-[#a9838f]">เลื่อนอัตโนมัติ</p>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setAutoScroll(false)}
                className={!autoScroll ? "pink-btn !px-3 !py-1.5 !text-xs" : "outline-btn !px-3 !py-1.5 !text-xs"}
              >
                ปิด
              </button>
              <button
                type="button"
                onClick={() => setAutoScroll(true)}
                className={autoScroll ? "pink-btn !px-3 !py-1.5 !text-xs" : "outline-btn !px-3 !py-1.5 !text-xs"}
              >
                เปิด
              </button>
            </div>
          </div>
        </div>

        <div className="panel p-5 text-center">
          <p className="mb-2 text-sm font-medium text-[#623846]">ชอบเรื่องนี้ไหม?</p>
          <p className="text-xs text-[#a9838f]">กดไลก์และคอมเมนต์เป็นกำลังใจให้นักแปลกันนะ~ 🐱</p>
        </div>

        <div id="chapter-list" className="panel p-5 scroll-mt-24">
          <h3 className="mb-3 font-display text-base font-bold text-[#623846]">สารบัญตอน</h3>
          <ul className="max-h-[420px] space-y-1.5 overflow-y-auto pr-1">
            {chapters.map((c) => (
              <li key={c.number}>
                {c.locked ? (
                  <div className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-[#c9a8b2]">
                    <span>
                      ตอนที่ {c.number}
                      <span className="ml-1 text-xs">{c.title}</span>
                    </span>
                    <span className="text-[#c9a8b2]"><LockIcon /></span>
                  </div>
                ) : (
                  <Link
                    href={`/manga/${slug}/${c.number}`}
                    className={
                      "flex items-center justify-between rounded-xl px-3 py-2 text-sm transition " +
                      (c.isCurrent ? "bg-[#ef7095] text-white font-semibold" : "text-[#623846] hover:bg-[#fff4f7]")
                    }
                  >
                    <span>
                      ตอนที่ {c.number}
                      <span className="ml-1 text-xs opacity-80">{c.title}</span>
                    </span>
                    {c.isCurrent && <CurrentIcon />}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

function ToolIcon({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="outline-btn !flex !w-9 !items-center !justify-center !rounded-full !p-2.5 !px-0"
    >
      {children}
    </button>
  );
}
