import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const packages = await prisma.topupPackage.findMany({
    where: { enabled: true },
    orderBy: [{ sortOrder: "asc" }, { price: "asc" }],
  });
  return NextResponse.json(packages);
}