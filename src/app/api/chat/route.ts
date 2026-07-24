import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { messages } = await req.json();
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      reply:
        "ยังไม่ได้ตั้งค่า ANTHROPIC_API_KEY บนเซิร์ฟเวอร์ค่ะ กรุณาเพิ่มคีย์ในไฟล์ .env แล้วรีสตาร์ตแอปเพื่อเปิดใช้งานแชท AI",
    });
  }

  const catalogue = await prisma.manga.findMany({
    select: { title: true, category: true, status: true, description: true, saleMode: true, fullPrice: true },
    take: 40,
  });
  const catalogueText = catalogue
    .map((m) => `- ${m.title} | หมวดหมู่: ${m.category} | สถานะ: ${m.status === "ongoing" ? "กำลังอัพ" : "จบแล้ว"} | รูปแบบขาย: ${m.saleMode}${m.saleMode !== "FREE" ? ` (฿${m.fullPrice})` : ""} | เรื่องย่อ: ${m.description.slice(0, 120)}`)
    .join("\n");

  const systemPrompt = `คุณเป็นผู้ช่วย AI สุภาพ น่ารัก บนเว็บไซต์อ่านมังงะแปลไทยชื่อ Manhwa Duchess หน้าที่ของคุณคือพูดคุย แนะนำมังงะ และตอบคำถามเกี่ยวกับเว็บไซต์ (การอ่าน การซื้อทั้งเรื่อง/รายตอน หมวดหมู่ ประวัติการอ่าน รายการโปรด) ตอบเป็นภาษาไทยเสมอ กระชับ เป็นกันเอง แนะนำเฉพาะเรื่องที่มีอยู่ในรายการด้านล่างเท่านั้น ห้ามแต่งชื่อเรื่องที่ไม่มีอยู่จริง หากไม่มีเรื่องที่ตรงกับคำขอ ให้บอกตามตรงว่ายังไม่มีในระบบ

รายการมังงะในระบบขณะนี้:
${catalogueText || "(ยังไม่มีมังงะในระบบ)"}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 500,
        system: systemPrompt,
        messages: messages.map((m: { role: string; content: string }) => ({ role: m.role, content: m.content })),
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json({ reply: "ขออภัยค่ะ ระบบแชทมีปัญหาชั่วคราว ลองใหม่อีกครั้งนะคะ" });
    }
    const text = data.content?.map((c: { type: string; text?: string }) => (c.type === "text" ? c.text : "")).join("") || "";
    return NextResponse.json({ reply: text || "ขออภัยค่ะ ไม่สามารถตอบได้ในขณะนี้" });
  } catch {
    return NextResponse.json({ reply: "เชื่อมต่อ AI ไม่สำเร็จ ลองใหม่อีกครั้งนะคะ" });
  }
}
