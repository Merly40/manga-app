import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const chapterId = searchParams.get("chapterId");
  if (!chapterId) {
    return NextResponse.json({ error: "chapterId is required" }, { status: 400 });
  }

  const comments = await prisma.comment.findMany({
    where: { chapterId },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(comments);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "กรุณาล็อกอินก่อนคอมเมนต์" }, { status: 401 });
  }

  const { chapterId, body } = await req.json();
  if (!chapterId || !body?.trim()) {
    return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      chapterId,
      body: body.trim(),
      userId: (session.user as any).id,
    },
    include: { user: { select: { name: true } } },
  });

  return NextResponse.json(comment, { status: 201 });
}
