import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || role !== "ADMIN") return false;
  return true;
}

export async function GET() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  return NextResponse.json({ bannerImageUrl: settings?.bannerImageUrl ?? null });
}

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "หน้านี้อนุญาตเฉพาะแอดมิน" }, { status: 403 });
  }
  const body = await req.json();
  const bannerImageUrl: string | null = body.bannerImageUrl ?? null;

  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: { bannerImageUrl },
    create: { id: "singleton", bannerImageUrl },
  });

  return NextResponse.json({ bannerImageUrl: settings.bannerImageUrl });
}
