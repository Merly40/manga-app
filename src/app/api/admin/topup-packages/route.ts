import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const packages = await prisma.topupPackage.findMany({
    orderBy: [{ sortOrder: "asc" }, { price: "asc" }],
  });

  return NextResponse.json(packages);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session?.user || role !== "ADMIN") {
    return NextResponse.json(
      { error: "ไม่มีสิทธิ์" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();

    const created = await prisma.topupPackage.create({
      data: {
        title: body.title,
        description: body.description || null,
        price: Number(body.price),
        coins: Number(body.coins),
        bonusCoins: Number(body.bonusCoins || 0),
        imageUrl: body.imageUrl || null,
        enabled: true,
        sortOrder: 0,
      },
    });

    return NextResponse.json(created);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "สร้างแพ็กเกจไม่สำเร็จ" },
      { status: 500 }
    );
  }
}