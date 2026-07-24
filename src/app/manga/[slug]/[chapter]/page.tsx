// วางไฟล์นี้ทับที่: src/app/manga/[slug]/[chapter]/page.tsx (ชื่อโฟลเดอร์จริงของคุณ)
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Comments from "@/components/Comments";
import BuyChapterButton from "@/components/BuyChapterButton";
import ReadingActions from "@/components/ReadingActions";
import MangaReader from "@/components/MangaReader";
import ChapterSelect from "@/components/ChapterSelect";
import { FlagIcon } from "@/components/icons/UiIcons";

export const dynamic = "force-dynamic";

export default async function ChapterReaderPage({
  params,
}: {
  params: { slug: string; chapter: string };
}) {
  const manga = await prisma.manga.findUnique({ where: { slug: params.slug } });
  if (!manga) return notFound();

  const chapterNumber = Number(params.chapter);
  const chapter = await prisma.chapter.findFirst({
    where: { mangaId: manga.id, number: chapterNumber },
    include: { pages: { orderBy: { order: "asc" } } },
  });
  if (!chapter) return notFound();

  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  const role = (session?.user as any)?.role;

  let hasAccess = manga.saleMode === "FREE" || chapter.price <= 0 || role === "ADMIN";
  if (!hasAccess && (manga.saleMode === "FULL" || manga.saleMode === "BOTH") && userId) {
    const fullPurchase = await prisma.mangaPurchase.findUnique({ where: { userId_mangaId: { userId, mangaId: manga.id } } });
    hasAccess = !!fullPurchase;
  }
  if (!hasAccess && userId && (manga.saleMode === "CHAPTER" || manga.saleMode === "BOTH")) {
    const purchase = await prisma.purchase.findUnique({
      where: { userId_chapterId: { userId, chapterId: chapter.id } },
    });
    hasAccess = !!purchase;
  }

  const [prevChapter, nextChapter, allChapters, myFollow] = await Promise.all([
    prisma.chapter.findFirst({
      where: { mangaId: manga.id, number: { lt: chapterNumber } },
      orderBy: { number: "desc" },
    }),
    prisma.chapter.findFirst({
      where: { mangaId: manga.id, number: { gt: chapterNumber } },
      orderBy: { number: "asc" },
    }),
    prisma.chapter.findMany({
      where: { mangaId: manga.id },
      orderBy: { number: "asc" },
      select: { id: true, number: true, title: true, price: true, publishedAt: true },
    }),
    userId ? prisma.follow.findUnique({ where: { userId_mangaId: { userId, mangaId: manga.id } } }) : null,
  ]);

  let fullAccess = manga.saleMode === "FREE" || role === "ADMIN";
  if (!fullAccess && (manga.saleMode === "FULL" || manga.saleMode === "BOTH") && userId) {
    const fullPurchase = await prisma.mangaPurchase.findUnique({ where: { userId_mangaId: { userId, mangaId: manga.id } } });
    fullAccess = !!fullPurchase;
  }
  let purchasedChapterIds = new Set<string>();
  if (!fullAccess && userId && (manga.saleMode === "CHAPTER" || manga.saleMode === "BOTH")) {
    const purchases = await prisma.purchase.findMany({
      where: { userId, chapterId: { in: allChapters.map((c) => c.id) } },
      select: { chapterId: true },
    });
    purchasedChapterIds = new Set(purchases.map((p) => p.chapterId));
  }
  const chapterListItems = allChapters.map((c) => ({
    number: c.number,
    title: c.title,
    isCurrent: c.number === chapterNumber,
    publishedAt: c.publishedAt.toISOString(),
    locked: !(fullAccess || c.price <= 0 || purchasedChapterIds.has(c.id)),
  }));
  const tags = manga.tags ? manga.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

  const lockedContent =
    manga.saleMode === "FULL" || manga.saleMode === "BOTH" ? (
      <div className="panel p-10 text-center"><p className="mb-4">ตอนนี้รวมอยู่ในการปลดล็อกทั้งเรื่อง</p><Link href={`/manga/${manga.slug}`} className="pink-btn">ไปหน้าชำระเงินเพื่ออ่านถึงตอนจบ</Link></div>
    ) : (
      <BuyChapterButton chapterId={chapter.id} price={chapter.price} />
    );

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 md:px-6">
      <nav className="mb-3 flex flex-wrap items-center gap-1.5 text-sm text-[#a27a87]">
        <Link href="/" className="hover:text-[#ef7095]">หน้าหลัก</Link>
        <span>/</span>
        <Link href={`/manga/${manga.slug}`} className="hover:text-[#ef7095]">{manga.title}</Link>
        <span>/</span>
        <span className="text-[#623846]">ตอนที่ {chapter.number} : {chapter.title}</span>
      </nav>

      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#623846]">{manga.title}</h1>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {manga.category && <span className="tag">{manga.category}</span>}
            {tags.map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <ReadingActions
            manga={{ slug: manga.slug, title: manga.title, coverUrl: manga.coverUrl, category: manga.category }}
            mangaId={manga.id}
            isLoggedIn={!!userId}
            initialFavorited={!!myFollow}
            chapter={chapter.number}
            recordHistory
            chapterNumbers={allChapters.map((c) => c.number)}
          />
          <a
            href="mailto:support@manhwaduchess.example?subject=รายงานปัญหา"
            className="outline-btn inline-flex items-center gap-1.5"
          >
            <FlagIcon className="h-4 w-4" />
            รายงานปัญหา
          </a>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-[#f0d8e0] bg-white px-4 py-2.5">
        {prevChapter ? (
          <Link href={`/manga/${manga.slug}/${prevChapter.number}`} className="text-sm text-[#a27a87] hover:text-[#ef7095]">
            ← ตอนก่อนหน้า<br /><span className="text-xs">ตอนที่ {prevChapter.number} : {prevChapter.title}</span>
          </Link>
        ) : <span />}

        <div className="hidden md:block">
          <ChapterSelect slug={manga.slug} current={chapter.number} chapters={allChapters} />
        </div>

        {nextChapter ? (
          <Link href={`/manga/${manga.slug}/${nextChapter.number}`} className="text-right text-sm text-[#a27a87] hover:text-[#ef7095]">
            ตอนถัดไป →<br /><span className="text-xs">ตอนที่ {nextChapter.number} : {nextChapter.title}</span>
          </Link>
        ) : <span />}
      </div>

      <MangaReader
        slug={manga.slug}
        pages={chapter.pages}
        hasAccess={hasAccess}
        lockedContent={lockedContent}
        chapters={chapterListItems}
      />

      <div className="flex justify-between mt-6">
        {prevChapter ? (
          <Link href={`/manga/${manga.slug}/${prevChapter.number}`} className="outline-btn px-4 py-2">
            ← ตอนก่อนหน้า
          </Link>
        ) : <span />}
        {nextChapter ? (
          <Link href={`/manga/${manga.slug}/${nextChapter.number}`} className="pink-btn">
            ตอนถัดไป →
          </Link>
        ) : <span />}
      </div>

      <div id="comments">
        <Comments chapterId={chapter.id} />
      </div>
    </div>
  );
}
