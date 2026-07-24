"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, ReactNode, useRef, useState } from "react";

const categories = ["แฟนตาซีโรแมนติก", "โรแมนติกปัจจุบัน", "แอคชั่น", "สยองขวัญ"];

type FormState = {
  title: string;
  slug: string;
  author: string;
  description: string;
  coverUrl: string;
  status: string;
  category: string;
  tags: string;
  saleMode: string;
  fullPrice: string;
};

const initialState: FormState = {
  title: "",
  slug: "",
  author: "",
  description: "",
  coverUrl: "",
  status: "ongoing",
  category: categories[0],
  tags: "",
  saleMode: "FREE",
  fullPrice: "0",
};

/**
 * แปลงข้อความให้เป็น slug ที่ปลอดภัยสำหรับใช้ใน URL
 * - รองรับทั้งอังกฤษและไทย
 * - ตัดช่องว่าง/เครื่องหมายคำพูด/สัญลักษณ์พิเศษออก แทนที่ด้วย "-"
 * - ถ้าแปลงแล้วว่างเปล่า (เช่น พิมพ์แต่สัญลักษณ์) จะ fallback เป็น manga-<timestamp>
 */
function slugify(text: string): string {
  const cleaned = text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/['"’‘]/g, "") // ตัด apostrophe/quote ออกไปเลย ไม่แทนด้วย -
    .replace(/[^a-z0-9\u0E00-\u0E7F]+/g, "-") // อักขระอื่นที่ไม่ใช่ a-z, 0-9, ไทย -> "-"
    .replace(/^-+|-+$/g, "") // ตัด - หัวท้าย
    .replace(/-{2,}/g, "-"); // ยุบ -- ซ้ำให้เหลือตัวเดียว

  return cleaned || `manga-${Date.now()}`;
}

export default function NewMangaForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>(initialState);
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const change = (key: keyof FormState, value: string) => setForm((current) => ({ ...current, [key]: value }));

  // พิมพ์ชื่อเรื่อง -> auto-gen slug ให้ทันที ตราบใดที่แอดมินยังไม่เคยแก้ช่อง slug เอง
  function changeTitle(value: string) {
    setForm((current) => ({
      ...current,
      title: value,
      slug: slugTouched ? current.slug : slugify(value),
    }));
  }

  // ถ้าแอดมินเริ่มแก้ช่อง slug เอง ให้หยุด auto-gen จาก title ทันที (เผื่ออยากตั้งเอง)
  function changeSlug(value: string) {
    setSlugTouched(true);
    change("slug", value);
  }

  async function uploadCover(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("ไฟล์หน้าปกต้องมีขนาดไม่เกิน 5 MB");
      return;
    }

    setUploading(true);
    setError("");
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/upload", { method: "POST", body });
    const data = await response.json();
    setUploading(false);
    if (!response.ok) {
      setError(data.error || "อัปโหลดหน้าปกไม่สำเร็จ");
      return;
    }
    change("coverUrl", data.url);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.coverUrl) {
      setError("กรุณาเพิ่มไฟล์หน้าปกจากเครื่องก่อนบันทึก");
      return;
    }

    // sanitize slug อีกรอบก่อนส่ง กันพลาดกรณีแอดมินพิมพ์ช่อง slug เองแล้วมีอักขระแปลกๆ หลุดมา
    const safeSlug = slugify(form.slug || form.title);

    setLoading(true);
    setError("");
    const response = await fetch("/api/manga", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, slug: safeSlug, fullPrice: Number(form.fullPrice) || 0 }),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.error || "เกิดข้อผิดพลาด");
      return;
    }

    setForm(initialState);
    setSlugTouched(false);
    if (fileRef.current) fileRef.current.value = "";
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="panel p-6 xl:sticky xl:top-28">
      <h2 className="font-display text-xl font-bold">เพิ่มมังงะใหม่</h2>
      <p className="mb-5 mt-1 text-xs text-[#aa8490]">กำหนดหมวดหมู่ สถานะ หน้าปก และรูปแบบการขาย</p>

      <div className="space-y-4">
        <Field label="ชื่อมังงะ">
          <input required className="soft-input" value={form.title} onChange={(e) => changeTitle(e.target.value)} placeholder="กรอกชื่อมังงะ" />
        </Field>

        <Field label="Slug">
          <input required className="soft-input" value={form.slug} onChange={(e) => changeSlug(e.target.value)} placeholder="the-villains-savior" />
          <p className="mt-1 text-[11px] text-[#c9a8b2]">
            ระบบสร้างให้อัตโนมัติจากชื่อเรื่อง แก้เองได้ถ้าต้องการ — ระบบจะตัดช่องว่าง/เครื่องหมายพิเศษให้เป็น "-" เสมอตอนบันทึก
          </p>
        </Field>

        <Field label="ผู้แต่ง"><input className="soft-input" value={form.author} onChange={(e) => change("author", e.target.value)} placeholder="ชื่อผู้แต่ง" /></Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="สถานะ">
            <select className="soft-input" value={form.status} onChange={(e) => change("status", e.target.value)}>
              <option value="ongoing">ยังไม่จบ (กำลังอัพ)</option>
              <option value="completed">จบแล้ว</option>
            </select>
          </Field>
          <Field label="หมวดหมู่">
            <select className="soft-input" value={form.category} onChange={(e) => change("category", e.target.value)}>
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>
          </Field>
        </div>

        <Field label="แท็ก"><input className="soft-input" value={form.tags} onChange={(e) => change("tags", e.target.value)} placeholder="โรแมนซ์, ดราม่า" /></Field>

        <Field label="ไฟล์หน้าปกจากเครื่อง">
          <div className="rounded-2xl border border-dashed border-[#efcbd6] bg-[#fff8fa] p-4">
            {form.coverUrl ? (
              <div className="mb-3 flex items-center gap-4">
                <div className="relative h-28 w-20 overflow-hidden rounded-xl border border-[#f0d8e0] bg-white">
                  <Image src={form.coverUrl} alt="ตัวอย่างหน้าปก" fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#744a57]">เพิ่มหน้าปกแล้ว</p>
                  <p className="mt-1 truncate text-xs text-[#aa8490]">{form.coverUrl}</p>
                  <button type="button" className="mt-3 text-xs font-semibold text-[#df6488]" onClick={() => fileRef.current?.click()}>เปลี่ยนไฟล์</button>
                </div>
              </div>
            ) : (
              <div className="mb-3 text-center text-sm text-[#9e7180]">เลือก JPG, PNG หรือ WEBP ขนาดไม่เกิน 5 MB</div>
            )}
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={uploadCover} />
            <button type="button" disabled={uploading} className="outline-btn w-full" onClick={() => fileRef.current?.click()}>
              {uploading ? "กำลังอัปโหลด..." : form.coverUrl ? "เลือกไฟล์ใหม่" : "เลือกไฟล์จากเครื่อง"}
            </button>
          </div>
        </Field>

        <Field label="คำอธิบาย"><textarea rows={4} className="soft-input resize-none" value={form.description} onChange={(e) => change("description", e.target.value)} placeholder="กรอกคำอธิบายเรื่อง" /></Field>

        <Field label="รูปแบบการขาย">
          <select className="soft-input" value={form.saleMode} onChange={(e) => change("saleMode", e.target.value)}>
            <option value="FREE">อ่านฟรีทั้งเรื่อง</option>
            <option value="FULL">ติดราคาซื้อทั้งเรื่อง</option>
            <option value="CHAPTER">ติดเงินรายตอน</option>
            <option value="BOTH">ซื้อทั้งเรื่องหรือซื้อรายตอน</option>
          </select>
        </Field>

        {(form.saleMode === "FULL" || form.saleMode === "BOTH") && (
          <Field label="ราคาปลดล็อกทั้งเรื่อง (บาท)"><input type="number" min="0" className="soft-input" value={form.fullPrice} onChange={(e) => change("fullPrice", e.target.value)} /></Field>
        )}

        <div className="rounded-xl bg-[#fff4f7] p-3 text-xs leading-5 text-[#a5677b]">แบบซื้อทั้งเรื่องจะปลดล็อกทุกตอน ส่วนแบบรายตอนให้ตั้งราคาตอนในหน้าเพิ่มตอน</div>
        {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        <button disabled={loading || uploading} className="pink-btn w-full">{loading ? "กำลังบันทึก..." : "บันทึกมังงะ"}</button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold text-[#744a57]">{label}</span>{children}</label>;
}