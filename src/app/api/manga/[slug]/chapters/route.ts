import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session?.user || (role !== "ADMIN" && role !== "TRANSLATOR")) {
    return NextResponse.json({ error: "ไม่มีสิทธิ์" }, { status: 403 });
  }

  const manga = await prisma.manga.findUnique({ where: { slug: params.slug } });
  if (!manga) {
    return NextResponse.json({ error: "ไม่พบเรื่องนี้" }, { status: 404 });
  }

  const { number, title, pageUrls, price } = await req.json();
  if (number === undefined || !Array.isArray(pageUrls) || pageUrls.length === 0) {
    return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
  }

  const chapter = await prisma.chapter.create({
    data: {
      mangaId: manga.id,
      number: Number(number),
      title: title || `ตอนที่ ${number}`,
      price: price ? Math.max(0, Number(price)) : 0,
      pages: {
        create: pageUrls.map((url: string, i: number) => ({
          order: i,
          imageUrl: url,
        })),
      },
    },
  });

  // Notify readers who have commented on this manga before (simple heuristic notification fanout)
  const followers = await prisma.user.findMany({
    where: { comments: { some: { chapter: { mangaId: manga.id } } } },
    select: { id: true },
  });
  if (followers.length > 0) {
    await prisma.notification.createMany({
      data: followers.map((f) => ({
        userId: f.id,
        message: `${manga.title} ตอนที่ ${number} มาแล้ว`,
        link: `/manga/${manga.slug}/${number}`,
      })),
    });
  }

  return NextResponse.json(chapter, { status: 201 });
}
