import { prisma } from "@/lib/prisma";
import MangaCard from "@/components/MangaCard";
import { FantasyRomanceIcon, ContemporaryRomanceIcon, ActionIcon, HorrorIcon, TagIcon } from "@/components/icons/CategoryIcons";

export const dynamic = "force-dynamic";

const cats = ["แฟนตาซีโรแมนติก", "โรแมนติกปัจจุบัน", "แอคชั่น", "สยองขวัญ"];
const CATEGORY_ICONS: Record<string, typeof FantasyRomanceIcon> = {
  "แฟนตาซีโรแมนติก": FantasyRomanceIcon,
  "โรแมนติกปัจจุบัน": ContemporaryRomanceIcon,
  "แอคชั่น": ActionIcon,
  "สยองขวัญ": HorrorIcon,
};

export default async function CategoriesPage() {
  const mangaList = await prisma.manga.findMany({
    include: { chapters: { orderBy: { number: "desc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  const statuses: { key: string; label: string; tone: string }[] = [
    { key: "ongoing", label: "ยังไม่จบ (กำลังอัพ)", tone: "text-[#ef7095]" },
    { key: "completed", label: "จบแล้ว", tone: "text-[#8c79c9]" },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-8">
      <div className="mb-7">
        <h1 className="font-display text-3xl font-bold text-[#623846]">หมวดหมู่</h1>
        <p className="mt-2 text-sm text-[#a27886]">เลือกดูตามสถานะเรื่อง แล้วกรองต่อด้วยหมวดหมู่ย่อยที่ชอบ</p>
      </div>

      {statuses.map(({ key, label, tone }) => {
        const inStatus = mangaList.filter((m) => m.status === key);
        return (
          <section key={key} className="panel mb-7 p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className={`font-display text-xl font-bold ${tone}`}>{label}</h2>
              <span className="tag">{inStatus.length} เรื่อง</span>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {cats.map((c) => {
                const Icon = CATEGORY_ICONS[c] ?? TagIcon;
                return (
                  <div key={c} className="rounded-2xl border border-[#f3dce3] bg-[#fff8fa] p-5 text-center">
                    <div className="mx-auto mb-3 grid h-9 w-9 place-items-center rounded-xl bg-[#fde2ea] text-[#df6488] ring-8 ring-[#fff0f4]">
                      <Icon />
                    </div>
                    <p className="font-medium">{c}</p>
                    <p className="mt-1 text-xs text-[#b58b98]">{inStatus.filter((m) => m.category === c).length} เรื่อง</p>
                  </div>
                );
              })}
            </div>

            {cats.map((c) => {
              const items = inStatus.filter((m) => m.category === c);
              if (!items.length) return null;
              return (
                <div key={c} className="mb-6">
                  <h3 className="mb-3 text-sm font-semibold text-[#744a57]">{c}</h3>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {items.map((m) => (
                      <MangaCard key={m.id} {...m} latestChapter={m.chapters[0]?.number} />
                    ))}
                  </div>
                </div>
              );
            })}

            {inStatus.length === 0 && (
              <div className="rounded-2xl border border-dashed border-[#eccfd8] py-12 text-center text-sm text-[#b58b98]">
                ยังไม่มีมังงะในหมวดนี้
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
