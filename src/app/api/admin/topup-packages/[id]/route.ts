import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || role !== "ADMIN") {
    return NextResponse.json({ error: "ไม่มีสิทธิ์" }, { status: 403 });
  }

  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (body.enabled !== undefined) data.enabled = Boolean(body.enabled);
  if (body.title !== undefined) data.title = body.title;
  if (body.description !== undefined) data.description = body.description;
  if (body.price !== undefined) data.price = Number(body.price);
  if (body.coins !== undefined) data.coins = Number(body.coins);
  if (body.bonusCoins !== undefined) data.bonusCoins = Number(body.bonusCoins);
  if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl;
  if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder); // <-- บรรทัดใหม่ที่เพิ่ม

  const updated = await prisma.topupPackage.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || role !== "ADMIN") {
    return NextResponse.json({ error: "ไม่มีสิทธิ์" }, { status: 403 });
  }

  await prisma.topupPackage.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
