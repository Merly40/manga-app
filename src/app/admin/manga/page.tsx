// วางไฟล์นี้ที่: src/app/admin/manga/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookCopy, Plus, Search } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminSidebar from "../AdminSidebar";
import MangaListItem from "../MangaListItem";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: {
    q?: string;
  };
};

export default async function AdminMangaPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session?.user) redirect("/login");
  if (role !== "ADMIN") redirect("/");

  const query = searchParams?.q?.trim() ?? "";

  const manga = await prisma.manga.findMany({
    where: query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { englishTitle: { contains: query, mode: "insensitive" } },
            { author: { contains: query, mode: "insensitive" } },
            { category: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: {
      _count: {
        select: { chapters: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#fffafb]">
      <div className="mx-auto grid max-w-[1500px] gap-6 px-6 py-7 xl:grid-cols-[220px_1fr]">
        <AdminSidebar />

        <section className="min-w-0">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#fde4ec] text-[#ef7095]">
                <BookCopy size={20} />
              </span>
              <div>
                <h1 className="font-display text-2xl font-bold text-[#5d3542]">
                  จัดการมังงะทั้งหมด
                </h1>
                <p className="mt-0.5 text-sm text-[#a98591]">
                  พบทั้งหมด {manga.length.toLocaleString("th-TH")} เรื่อง
                </p>
              </div>
            </div>

            <Link href="/admin/upload" className="pink-btn inline-flex items-center gap-2 self-start">
              <Plus size={16} />
              เพิ่มมังงะใหม่
            </Link>
          </div>

          <form action="/admin/manga" method="get" className="panel mb-5 p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative flex-1">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#c39ca8]"
                />
                <input
                  name="q"
                  defaultValue={query}
                  placeholder="ค้นหาชื่อเรื่อง ชื่ออังกฤษ ผู้แต่ง หรือหมวดหมู่"
                  className="w-full rounded-xl border border-[#f1dce3] bg-white py-3 pl-11 pr-4 text-sm text-[#5d3542] outline-none transition placeholder:text-[#c9a8b2] focus:border-[#ef9bb4] focus:ring-2 focus:ring-[#fde4ec]"
                />
              </label>

              <button type="submit" className="pink-btn !px-5">
                ค้นหา
              </button>

              {query && (
                <Link href="/admin/manga" className="outline-btn inline-flex items-center justify-center !px-5">
                  ล้างคำค้น
                </Link>
              )}
            </div>
          </form>

          <div className="panel overflow-hidden">
            <div className="hidden border-b border-[#f3dde4] bg-[#fff7f9] px-4 py-3 text-xs font-semibold text-[#a98591] md:grid md:grid-cols-[1.7fr_.8fr_.7fr_.7fr_auto] md:gap-4">
              <span>มังงะ</span>
              <span>สถานะ</span>
              <span>การขาย</span>
              <span>จำนวนตอน</span>
              <span className="text-right">จัดการ</span>
            </div>

            {manga.length > 0 ? (
              <div className="divide-y divide-[#f5e5ea]">
                {manga.map((item) => (
                  <MangaListItem
                    key={item.id}
                    slug={item.slug}
                    title={item.title}
                    coverUrl={item.coverUrl}
                    category={item.category}
                    status={item.status}
                    saleMode={item.saleMode}
                    fullPrice={item.fullPrice}
                    chapterCount={item._count.chapters}
                  />
                ))}
              </div>
            ) : (
              <div className="px-6 py-16 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#fdebf0] text-[#ef7095]">
                  <BookCopy size={24} />
                </span>
                <h2 className="mt-4 font-display text-lg font-bold text-[#5d3542]">
                  {query ? "ไม่พบมังงะที่ค้นหา" : "ยังไม่มีมังงะในระบบ"}
                </h2>
                <p className="mt-1 text-sm text-[#a98591]">
                  {query
                    ? "ลองค้นหาด้วยชื่อเรื่องหรือคำอื่นอีกครั้ง"
                    : "เริ่มต้นโดยเพิ่มมังงะเรื่องแรกของคุณ"}
                </p>
                {!query && (
                  <Link href="/admin/upload" className="pink-btn mt-5 inline-flex items-center gap-2">
                    <Plus size={16} />
                    เพิ่มมังงะใหม่
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
