import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST: ใครก็ส่งคำขอเพลงได้ (จากปุ่ม "ขอเพลง" ใน MusicPlayer) ไม่ต้องล็อกอิน
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const title = typeof body?.title === "string" ? body.title.trim().slice(0, 100) : "";
  const artist = typeof body?.artist === "string" ? body.artist.trim().slice(0, 100) : "";
  const link = typeof body?.link === "string" ? body.link.trim().slice(0, 200) : "";
  const note = typeof body?.note === "string" ? body.note.trim().slice(0, 300) : "";
  const categories = Array.isArray(body?.categories) ? body.categories.join(",") : "";

  if (!title) {
    return NextResponse.json({ error: "กรุณากรอกชื่อเพลง" }, { status: 400 });
  }

  const created = await prisma.songRequest.create({
    data: {
      title,
      artist: artist || null,
      link: link || null,
      note: note || null,
      categories,
    },
  });

  return NextResponse.json(created, { status: 201 });
}

// GET: เฉพาะแอดมิน ใช้แสดงในหน้า /admin/song-requests
export async function GET() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requests = await prisma.songRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(requests);
}
