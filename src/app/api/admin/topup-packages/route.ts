import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const packages = await prisma.topupPackage.findMany({
    orderBy: [
      { sortOrder: "asc" },
      { price: "asc" },
    ],
  });

  return NextResponse.json(packages);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const pkg = await prisma.topupPackage.create({
      data: {
        title: body.title,
        description: body.description,
        price: Number(body.price),
        coins: Number(body.coins),
        bonusCoins: Number(body.bonusCoins),
        imageUrl: body.imageUrl,
        enabled: true,
      },
    });

    return NextResponse.json(pkg);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "สร้างแพ็กเกจไม่สำเร็จ",
      },
      {
        status: 500,
      }
    );
  }
}