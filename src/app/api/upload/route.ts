import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const extensions: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || role !== "ADMIN") {
    return NextResponse.json({ error: "หน้านี้อนุญาตเฉพาะแอดมิน" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "ไม่พบไฟล์" }, { status: 400 });
  if (!allowedTypes.has(file.type)) return NextResponse.json({ error: "รองรับเฉพาะ JPG, PNG และ WEBP" }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "ไฟล์ต้องมีขนาดไม่เกิน 5 MB" }, { status: 400 });

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  const safeName = `cover-${Date.now()}-${crypto.randomUUID()}${extensions[file.type]}`;
  await writeFile(path.join(uploadDir, safeName), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ url: `/uploads/${safeName}` }, { status: 201 });
}
