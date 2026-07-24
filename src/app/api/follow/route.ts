// วางไฟล์นี้ที่: src/app/api/follow/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อนกดติดตาม" }, { status: 401 });
  }

  const { mangaId } = await req.json();
  if (!mangaId) {
    return NextResponse.json({ error: "ไม่พบ mangaId" }, { status: 400 });
  }

  // เช็คก่อนว่า user/manga มีอยู่จริงในฐานข้อมูล ป้องกัน foreign key error แบบดักไม่ทัน
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

  const existing = await prisma.follow.findUnique({
    where: { userId_mangaId: { userId, mangaId } },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
  } else {
    await prisma.follow.create({ data: { userId, mangaId } });
  }

  const followerCount = await prisma.follow.count({ where: { mangaId } });

  return NextResponse.json({ following: !existing, followerCount });
}
