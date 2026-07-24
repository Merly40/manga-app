import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_req: Request, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session?.user || (role !== "ADMIN" && role !== "TRANSLATOR")) {
    return NextResponse.json({ error: "ไม่มีสิทธิ์" }, { status: 403 });
  }

  const manga = await prisma.manga.findUnique({ where: { slug: params.slug } });
  if (!manga) {
    return NextResponse.json({ error: "ไม่พบเรื่องนี้" }, { status: 404 });
  }

  await prisma.manga.delete({ where: { id: manga.id } });

  return NextResponse.json({ ok: true });
}
