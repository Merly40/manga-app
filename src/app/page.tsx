import { prisma } from "@/lib/prisma";
import MangaCard from "@/components/MangaCard";
import SavedMangaList from "@/components/SavedMangaList";
import Link from "next/link";
import {
  FantasyRomanceIcon,
  ContemporaryRomanceIcon,
  ActionIcon,
  HorrorIcon,
  TagIcon,
} from "@/components/icons/CategoryIcons";

export const dynamic = "force-dynamic";

const cats = [
  "แฟนตาซีโรแมนติก",
  "โรแมนติกปัจจุบัน",
  "แอคชั่น",
  "สยองขวัญ",
];

const CATEGORY_ICONS: Record<string, typeof FantasyRomanceIcon> = {
  "แฟนตาซีโรแมนติก": FantasyRomanceIcon,
  "โรแมนติกปัจจุบัน": ContemporaryRomanceIcon,
  แอคชั่น: ActionIcon,
  สยองขวัญ: HorrorIcon,
};

export default async function HomePage() {
  const [mangaList, settings] = await Promise.all([
    prisma.manga.findMany({
      include: {
        chapters: {
          orderBy: { number: "desc" },
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.siteSettings.findUnique({
      where: {
        id: "singleton",
      },
    }),
  ]);

  const bannerImageUrl = settings?.bannerImageUrl ?? null;

  const ongoing = mangaList.filter((m) => m.status === "ongoing");
  const completed = mangaList.filter((m) => m.status === "completed");

  return (
    <div className="mx-auto max-w-[1600px] px-6 pb-16 pt-7">

      {/* ================= Banner ================= */}

      <section className="panel relative mx-auto w-full overflow-hidden rounded-3xl aspect-[5/2] bg-[linear-gradient(120deg,#fff7fa_0%,#fde8ef_52%,#f8d9e6_100%)]">

        {bannerImageUrl ? (
          <img
            src={bannerImageUrl}
            alt="แบนเนอร์"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <>
            <div className="absolute -right-14 bottom-[-90px] h-[470px] w-[470px] rounded-full border-[45px] border-white/45 bg-[radial-gradient(circle_at_45%_40%,#fff_0_12%,#fac6d8_13%_36%,#e98eae_37%_55%,#c65d83_56%)] opacity-90" />

            <div className="absolute right-20 top-14 h-28 w-28 rotate-12 rounded-[40%] border border-white/70 bg-white/40" />
          </>
        )}
      </section>

      {/* ================= Category ================= */}

      <section className="mt-7 grid gap-5 lg:grid-cols-[1fr_320px]">

        <div className="panel p-6">

          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">
              หมวดหมู่
            </h2>

            <Link
              href="/categories"
              className="text-sm text-[#c36b86]"
            >
              ดูหมวดหมู่ทั้งหมด →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">

            {cats.map((c) => {
              const Icon = CATEGORY_ICONS[c] ?? TagIcon;

              return (
                <Link
                  key={c}
                  href="/categories"
                  className="rounded-2xl border border-[#f3dce3] bg-[#fff8fa] p-5 text-center transition hover:-translate-y-0.5"
                >
                  <div className="mx-auto mb-3 grid h-9 w-9 place-items-center rounded-xl bg-[#fde2ea] text-[#df6488] ring-8 ring-[#fff0f4]">
                    <Icon />
                  </div>

                  <p className="font-medium">{c}</p>

                  <p className="mt-1 text-xs text-[#b58b98]">
                    {mangaList.filter((m) => m.category === c).length} เรื่อง
                  </p>
                </Link>
              );
            })}

          </div>
        </div>

        <div className="panel p-6">

          <h2 className="font-display text-xl font-bold">
            สถานะเรื่อง
          </h2>

          <div className="mt-5 space-y-3">

            <a
              href="#ongoing"
              className="flex items-center justify-between rounded-2xl bg-[#fff2f6] px-5 py-4"
            >
              <span>ยังไม่จบ (กำลังอัพ)</span>

              <b className="text-[#ef7095]">
                {ongoing.length}
              </b>
            </a>

            <a
              href="#completed"
              className="flex items-center justify-between rounded-2xl bg-[#f7f4ff] px-5 py-4"
            >
              <span>จบแล้ว</span>

              <b className="text-[#8c79c9]">
                {completed.length}
              </b>
            </a>

          </div>

        </div>

      </section>

      {/* ================= History ================= */}

      <section className="mt-7 grid gap-5 lg:grid-cols-2">

        <SavedMangaList
          storageKey="manga-neko-history"
          emptyText="ยังไม่มีประวัติการอ่าน ลองเปิดอ่านมังงะสักตอนก่อนนะ"
          limit={3}
        />

        <SavedMangaList
          storageKey="manga-neko-favorites"
          emptyText="ยังไม่มีมังงะในรายการโปรด"
          limit={3}
        />

      </section>

      {/* ================= Ongoing ================= */}

      <section
        id="ongoing"
        className="panel mt-7 p-6"
      >

        <div className="mb-5 flex items-center justify-between">

          <h2 className="font-display text-xl font-bold">
            ยังไม่จบ (กำลังอัพ)
          </h2>

          <span className="tag">
            กำลังอัปเดต
          </span>

        </div>

        {ongoing.length ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">

            {ongoing.map((m) => (
              <MangaCard
                key={m.id}
                {...m}
                latestChapter={m.chapters[0]?.number}
              />
            ))}

          </div>
        ) : (
          <Empty />
        )}

      </section>

      {/* ================= Completed ================= */}

      <section
        id="completed"
        className="panel mt-7 p-6"
      >

        <div className="mb-5 flex items-center justify-between">

          <h2 className="font-display text-xl font-bold">
            จบแล้ว
          </h2>

          <span className="tag">
            อ่านได้ยาวถึงตอนจบ
          </span>

        </div>

        {completed.length ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">

            {completed.map((m) => (
              <MangaCard
                key={m.id}
                {...m}
                latestChapter={m.chapters[0]?.number}
              />
            ))}

          </div>
        ) : (
          <Empty />
        )}

      </section>

    </div>
  );
}

function Empty() {
  return (
    <div className="rounded-2xl border border-dashed border-[#eccfd8] py-12 text-center text-sm text-[#b58b98]">
      ยังไม่มีมังงะในส่วนนี้
    </div>
  );
}