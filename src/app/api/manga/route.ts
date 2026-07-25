import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const manga = await prisma.manga.findMany({
    include: { chapters: { select: { id: true }, orderBy: { number: "desc" } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(manga);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session?.user || role !== "ADMIN") {
    return NextResponse.json({ error: "ไม่มีสิทธิ์" }, { status: 403 });
  }

  const {
  title,
  slug,
  englishTitle,
  description,
  coverUrl,
  author,
  status,
  category,
  tags,
  saleMode,
  fullPrice,
} = await req.json();
  if (!title) {
  return NextResponse.json(
    { error: "ต้องระบุชื่อเรื่อง" },
    { status: 400 }
  );
}

const finalSlug =
  slug ||
  `${title}-${Math.random().toString(36).slice(2, 8)}`;

  const manga = await prisma.manga.create({
      data: {
      title,
      slug: finalSlug,
      englishTitle,
      description: description || "",
      coverUrl: coverUrl || "",
      author: author || "",
      status: status || "ongoing",
      category: category || "แฟนตาซีโรแมนติก",
      tags: tags || "",
      saleMode: saleMode || "FREE",
      fullPrice: Number(fullPrice) || 0,
    },
  });

  return NextResponse.json(manga, { status: 201 });
}
