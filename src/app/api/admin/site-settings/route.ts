import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// โหลดข้อมูล
export async function GET() {
  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
    },
  });

  return NextResponse.json(settings);
}

// บันทึกข้อมูล
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const settings = await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: {
        topupBannerUrl: body.topupBannerUrl,
      },
      create: {
        id: "singleton",
        topupBannerUrl: body.topupBannerUrl,
      },
    });

    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(
      { error: "บันทึกไม่สำเร็จ" },
      { status: 500 }
    );
  }
}