import Link from "next/link";
import Image from "next/image";
import {
  FantasyRomanceIcon,
  ContemporaryRomanceIcon,
  ActionIcon,
  HorrorIcon,
  TagIcon,
} from "./icons/CategoryIcons";
import { BookOpenIcon, ChevronRightIcon, HeartIcon } from "./icons/UiIcons";

type Props = {
  slug: string;
  title: string;
  coverUrl: string;
  status: string;
  category?: string;
  description?: string | null;
  latestChapter?: number;
  rank?: number;
  saleMode?: string;
  fullPrice?: number;
};

const CATEGORY_ICON_MAP: Record<string, typeof FantasyRomanceIcon> = {
  แฟนตาซีโรแมนติก: FantasyRomanceIcon,
  โรแมนติกปัจจุบัน: ContemporaryRomanceIcon,
  แอคชั่น: ActionIcon,
  สยองขวัญ: HorrorIcon,
};

export default function MangaCard({
  slug,
  title,
  coverUrl,
  status,
  category,
  description,
  latestChapter,
  rank,
  saleMode,
  fullPrice,
}: Props) {
  const CategoryIcon = (category && CATEGORY_ICON_MAP[category]) || TagIcon;
  const isOngoing = status === "ongoing";

  return (
    <Link
      href={`/manga/${slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-[#f2dce3] bg-white transition hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(218,106,139,.15)] dark:border-[#341c25] dark:bg-[#1a1a1a]"
    >
      {/* ================= Cover ================= */}
      <div className="relative aspect-[2/3] overflow-hidden bg-[#fff0f4] dark:bg-[#2a0b13]">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center gap-2 bg-[linear-gradient(145deg,#fde8ef,#f7c8d8)] p-4 text-center dark:bg-[linear-gradient(145deg,#2b0b15,#1a0810)]">
            <CategoryIcon className="mx-auto h-8 w-8 text-[#e08bab] dark:text-[#c96e8f]" />
            <p className="line-clamp-2 font-display text-sm text-[#b95f7c] dark:text-[#e8d0d8]">
              {title}
            </p>
          </div>
        )}

        {/* ริบบิ้นสถานะ มุมซ้ายบน */}
        <div className="absolute left-0 top-3">
          <div className="flex items-center gap-1 rounded-r-full bg-gradient-to-r from-[#f9769c] to-[#ef4477] py-1 pl-3 pr-3 text-[10px] font-semibold text-white shadow-md">
            <PawIcon className="h-2.5 w-2.5" />
            {isOngoing ? "กำลังอัพ" : "จบแล้ว"}
          </div>
        </div>

        {/* อันดับ มุมขวาบน (ถ้ามี) */}
        {rank && (
          <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white text-xs font-bold text-[#ef7095] shadow dark:bg-[#1a1a1a] dark:text-[#f4a9bf]">
            {rank}
          </span>
        )}
      </div>

      {/* ================= Content ================= */}
      <div className="relative p-3.5">
        {/* หมวดหมู่ */}
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <span className="tag inline-flex items-center gap-1 !px-2.5 !py-1">
            <CategoryIcon className="h-3 w-3" />
            {category ?? "ทั่วไป"}
          </span>
          {saleMode === "FULL" && (
            <span className="tag !px-2 !py-0.5">ทั้งเรื่อง ฿{fullPrice}</span>
          )}
        </div>

        {/* ชื่อเรื่อง */}
        <h3 className="flex items-start gap-1 font-display text-[15px] font-bold leading-snug text-[#623846] dark:text-[#f0dde3]">
          <span className="line-clamp-2 min-h-[40px]">{title}</span>
          <HeartIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#ef7095]" />
        </h3>

        {/* คำโปรยย่อ */}
        {description && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#a9838f] dark:text-[#c9a8b2]">
            {description}
          </p>
        )}

        {/* เส้นประคั่น */}
        <div className="my-3 border-t border-dashed border-[#f0d8e0] dark:border-[#341c25]" />

        {/* กล่องตอนล่าสุด */}
        {latestChapter !== undefined && (
          <div className="mb-3 flex items-center justify-between rounded-xl bg-[#fff2f6] px-3 py-2 text-xs dark:bg-[#2a1620]">
            <span className="flex items-center gap-1.5 text-[#a27886] dark:text-[#c9a8b2]">
              <BookOpenIcon className="h-3.5 w-3.5 text-[#ef7095]" />
              ตอนล่าสุด
            </span>
            <span className="flex items-center gap-0.5 font-semibold text-[#623846] dark:text-[#f0dde3]">
              ตอนที่ {latestChapter}
              <ChevronRightIcon className="h-3 w-3 opacity-60" />
            </span>
          </div>
        )}

        {/* ปุ่มอ่าน */}
        <span className="flex items-center justify-center rounded-full bg-gradient-to-r from-[#f9769c] to-[#ef4477] py-2.5 text-xs font-semibold text-white shadow-[0_8px_18px_rgba(239,68,119,0.25)] transition group-hover:-translate-y-0.5">
          อ่านเลย!
        </span>
      </div>
    </Link>
  );
}

/* ================= ไอคอน/มาสคอตเล็กๆ เฉพาะการ์ดนี้ ================= */

function PawIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <circle cx="6" cy="10" r="2.1" />
      <circle cx="11" cy="6.6" r="2.1" />
      <circle cx="16.4" cy="7.3" r="2" />
      <circle cx="19.6" cy="11.3" r="1.8" />
      <path d="M12 12.2c3 0 6 2.1 6 5.1 0 2-1.6 2.9-3.4 2.2-1-.4-1.9-.4-2.9 0-1.8.7-4.7.2-4.7-2.5 0-2.7 2-4.8 5-4.8z" />
    </svg>
  );
}