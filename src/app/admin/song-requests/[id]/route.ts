import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const STATUSES = ["PENDING", "ADDED", "REJECTED"];

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  return role === "ADMIN";
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const status = body?.status;

  if (!STATUSES.includes(status)) {
    return NextResponse.json({ error: "สถานะไม่ถูกต้อง" }, { status: 400 });
  }

  const updated = await prisma.songRequest.update({
    where: { id: params.id },
    data: { status },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.songRequest.delete({ where: { id: params.id } });

  return NextResponse.json({ ok: true });
}
