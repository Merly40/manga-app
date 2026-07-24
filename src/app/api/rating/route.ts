// วางไฟล์นี้ที่: src/app/api/rating/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อนให้คะแนน" }, { status: 401 });
  }

  const { mangaId, score } = await req.json();
  if (!mangaId || !Number.isInteger(score) || score < 1 || score > 5) {
    return NextResponse.json({ error: "ข้อมูลคะแนนไม่ถูกต้อง" }, { status: 400 });
  }

  // เช็คก่อนว่า user/manga มีอยู่จริงในฐานข้อมูล ป้องกัน foreign key error แบบดักไม่ทัน
  // (เกิดบ่อยตอน dev เวลา reseed/db push ใหม่ ทั้งที่ browser ยังถือ session เก่าอยู่)
  const [user, manga] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { id: true } }),
    prisma.manga.findUnique({ where: { id: mangaId }, select: { id: true } }),
  ]);
  if (!user) {
    return NextResponse.json(
      { error: "ไม่พบบัญชีผู้ใช้นี้ในฐานข้อมูล — กรุณาออกจากระบบแล้วเข้าสู่ระบบใหม่" },
      { status: 401 }
    );
  }
  if (!manga) {
    return NextResponse.json({ error: "ไม่พบเรื่องนี้ในฐานข้อมูล" }, { status: 404 });
  }

  await prisma.rating.upsert({
    where: { userId_mangaId: { userId, mangaId } },
    update: { score },
    create: { userId, mangaId, score },
  });

  const agg = await prisma.rating.aggregate({
    where: { mangaId },
    _avg: { score: true },
    _count: { score: true },
  });

  return NextResponse.json({
    average: agg._avg.score ?? 0,
    count: agg._count.score,
    myScore: score,
  });
}
