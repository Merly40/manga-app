// วางไฟล์นี้ทับที่: src/app/manga/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import BuyMangaButton from "@/components/BuyMangaButton";
import ReadingActions from "@/components/ReadingActions";
import RatingStars from "@/components/RatingStars";
import { EyeIcon, BookmarkIcon, HeartIcon, SparkleIcon } from "@/components/icons/UiIcons";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: { slug: string } }) {
  const manga = await prisma.manga.findUnique({
    where: { slug: params.slug },
    include: { chapters: { orderBy: { number: "desc" } } },
  });
  if (!manga) return notFound();

  // นับยอดเข้าชมจริงทุกครั้งที่มีคนเปิดหน้านี้
  const viewed = await prisma.manga.update({
    where: { id: manga.id },
    data: { viewCount: { increment: 1 } },
    select: { viewCount: true },
  });
  manga.viewCount = viewed.viewCount;

  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  const role = (session?.user as any)?.role;

  let fullAccess = role === "ADMIN" || !(manga.saleMode === "FULL" || manga.saleMode === "BOTH");
  if (!fullAccess && userId) {
    fullAccess = !!(await prisma.mangaPurchase.findUnique({
      where: { userId_mangaId: { userId, mangaId: manga.id } },
    }));
  }

  const [ratingAgg, favoriteCount, myRating, myFollow] = await Promise.all([
    prisma.rating.aggregate({ where: { mangaId: manga.id }, _avg: { score: true }, _count: { score: true } }),
    prisma.follow.count({ where: { mangaId: manga.id } }),
    userId ? prisma.rating.findUnique({ where: { userId_mangaId: { userId, mangaId: manga.id } } }) : null,
    userId ? prisma.follow.findUnique({ where: { userId_mangaId: { userId, mangaId: manga.id } } }) : null,
  ]);

  const firstChapterNumber = manga.chapters.length
    ? Math.min(...manga.chapters.map((c) => c.number))
    : 1;

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-8">
      <div
className="
relative
overflow-hidden
rounded-[36px]
border
border-[#F8D9E5]
bg-[linear-gradient(180deg,#fffdfd,#fff6fb)]
shadow-[0_25px_80px_rgba(233,130,170,.15)]
dark:border-[#341c25]
dark:bg-[linear-gradient(180deg,#1a1214,#20151a)]
dark:shadow-[0_25px_80px_rgba(0,0,0,.5)]
"
>
        {/* แถบลายกลีบซากุระบางๆ ประดับขอบบน */}
        <div className="petal-top h-3 w-full opacity-70" aria-hidden="true" />
        <div className="absolute inset-0 overflow-hidden">

<div className="absolute -right-28 top-10 h-[260px] w-[260px] rounded-full bg-pink-100 blur-3xl opacity-60 dark:bg-pink-900/40 dark:opacity-40"/>

<div className="absolute left-20 bottom-0 h-[220px] w-[220px] rounded-full bg-rose-100 blur-3xl opacity-40 dark:bg-rose-900/30 dark:opacity-30"/>

</div>
        <div className="grid gap-8 p-7 md:grid-cols-[250px_1fr]">
          <div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#fde6ed]">
              {manga.coverUrl && <Image src={manga.coverUrl} alt={manga.title} fill className="object-cover" />}
            </div>
          </div>

          <div>
            <div className="flex flex-wrap gap-2">
              <span className="tag">{manga.status === "ongoing" ? "ยังไม่จบ (กำลังอัพ)" : "จบแล้ว"}</span>
              <span className="tag">{manga.category}</span>
              {(manga.saleMode === "FULL" || manga.saleMode === "BOTH") && <span className="tag">ปลดล็อกทั้งเรื่อง</span>}
              {(manga.saleMode === "CHAPTER" || manga.saleMode === "BOTH") && <span className="tag">ติดเงินรายตอน</span>}
            </div>

            <h1 className="mt-4 flex items-center gap-2 font-display text-3xl font-bold text-[#623846] md:text-4xl">
              {manga.title}
              <HeartIcon className="h-6 w-6 text-[#ef7095]" />
            </h1>

            <div className="mt-4 flex flex-wrap gap-2">
              <RatingStars
                mangaId={manga.id}
                isLoggedIn={!!userId}
                average={ratingAgg._avg.score ?? 0}
                count={ratingAgg._count.score}
                myScore={myRating?.score ?? null}
              />
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f2dce3] bg-white px-4 py-2 text-sm font-semibold text-[#623846]">
                <EyeIcon className="h-4 w-4 text-[#a98591]" />
                {manga.viewCount.toLocaleString("th-TH")}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f2dce3] bg-white px-4 py-2 text-sm font-semibold text-[#623846]">
                <BookmarkIcon className="h-4 w-4 text-[#a98591]" />
                รายการโปรด {favoriteCount.toLocaleString("th-TH")} คน
              </span>
            </div>

            <p className="mt-6 leading-8 text-[#76515e]">{manga.description}</p>

            <div className="mt-6">
              <ReadingActions
                manga={{ slug: manga.slug, title: manga.title, coverUrl: manga.coverUrl, category: manga.category }}
                mangaId={manga.id}
                isLoggedIn={!!userId}
                firstChapterNumber={firstChapterNumber}
                initialFavorited={!!myFollow}
              />
              {(manga.saleMode === "FULL" || manga.saleMode === "BOTH") && !fullAccess && (
                <div className="mt-3">
                  <BuyMangaButton mangaId={manga.id} price={manga.fullPrice} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="panel mt-6 p-7">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold">
            <SparkleIcon className="h-4 w-4 text-[#ef7095]" />
            รายการตอน ({manga.chapters.length})
          </h2>
          {fullAccess && (manga.saleMode === "FULL" || manga.saleMode === "BOTH") && (
            <span className="rounded-full bg-[#eaf8ef] px-3 py-1 text-xs text-[#4b9665]">ปลดล็อกทั้งเรื่องแล้ว</span>
          )}
        </div>

        <div className="divide-y divide-[#f5e5ea] rounded-2xl border border-[#f2dce3]">
          {manga.chapters.map((c) => (
            <Link
              key={c.id}
              href={`/manga/${manga.slug}/${c.number}`}
              className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-[#fff7f9] dark:hover:bg-[#2a1620]"
            >
              <div>
                <p className="font-medium">ตอนที่ {c.number} — {c.title}</p>
                <p className="mt-1 text-xs text-[#ae8793]">{new Date(c.publishedAt).toLocaleDateString("th-TH")}</p>
              </div>
              <span className="text-sm font-medium text-[#df668a]">
                {(manga.saleMode === "FULL" || manga.saleMode === "BOTH") && fullAccess
                  ? "อ่านตอนนี้"
                  : manga.saleMode === "FULL"
                  ? `รวมในราคา ฿${manga.fullPrice}`
                  : c.price > 0
                  ? `฿${c.price}`
                  : "อ่านฟรี"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}