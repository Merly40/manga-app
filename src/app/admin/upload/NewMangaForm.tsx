// วางไฟล์นี้ทับที่: src/app/admin/upload/NewMangaForm.tsx
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, DragEvent, FormEvent, ReactNode, useRef, useState } from "react";
import { UploadCloud, FolderOpen, ImageIcon } from "lucide-react";

const categories = ["แฟนตาซีโรแมนติก", "โรแมนติกปัจจุบัน", "แอคชั่น", "สยองขวัญ"];

type FormState = {
  title: string;
  englishTitle: string;
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
  englishTitle: "",
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
 */
function slugify(text: string): string {
  const cleaned = text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/['"’‘]/g, "")
    .replace(/[^a-z0-9\u0E00-\u0E7F]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return cleaned || `manga-${Date.now()}`;
}

export default function NewMangaForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");

  const change = (key: keyof FormState, value: string) => setForm((current) => ({ ...current, [key]: value }));

  async function uploadCoverFile(file: File) {
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

  function onFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) uploadCoverFile(file);
    event.target.value = "";
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (file) uploadCoverFile(file);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.coverUrl) {
      setError("กรุณาเพิ่มไฟล์หน้าปกจากเครื่องก่อนบันทึก");
      return;
    }

    const safeSlug = slugify(form.englishTitle || form.title);

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
    if (fileRef.current) fileRef.current.value = "";
    router.push("/admin/manga");
    router.refresh();
  }

  return (
    <form onSubmit={submit}>
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="panel p-6">
          <h2 className="mb-5 flex items-center gap-2 font-display text-lg font-bold text-[#5d3542]">
            <span className="text-[#ef7095]">✿</span> ข้อมูลมังงะ
          </h2>

          <div className="space-y-4">
            <Field label="ชื่อเรื่อง (ไทย)">
              <input required className="soft-input" value={form.title} onChange={(e) => change("title", e.target.value)} placeholder="กรอกชื่อเรื่องภาษาไทย" />
            </Field>

            <Field label="ชื่อเรื่อง (อังกฤษ)">
              <input className="soft-input" value={form.englishTitle} onChange={(e) => change("englishTitle", e.target.value)} placeholder="กรอกชื่อเรื่องภาษาอังกฤษ" />
              <p className="mt-1 text-[11px] text-[#c9a8b2]">ใช้สร้างลิงก์ของเรื่องอัตโนมัติ</p>
            </Field>

            <Field label="ผู้แต่ง">
              <input className="soft-input" value={form.author} onChange={(e) => change("author", e.target.value)} placeholder="ชื่อผู้แต่ง" />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="หมวดหมู่">
                <select className="soft-input" value={form.category} onChange={(e) => change("category", e.target.value)}>
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </Field>
              <Field label="สถานะเรื่อง">
                <select className="soft-input" value={form.status} onChange={(e) => change("status", e.target.value)}>
                  <option value="ongoing">ยังไม่จบ (กำลังอัพ)</option>
                  <option value="completed">จบแล้ว</option>
                </select>
              </Field>
            </div>

            <Field label="แท็ก">
              <input className="soft-input" value={form.tags} onChange={(e) => change("tags", e.target.value)} placeholder="โรแมนซ์, ดราม่า" />
            </Field>

            <Field label="คำอธิบายเรื่อง">
              <textarea
                rows={4}
                maxLength={500}
                className="soft-input resize-none"
                value={form.description}
                onChange={(e) => change("description", e.target.value)}
                placeholder="เขียนคำอธิบายเรื่องย่อ..."
              />
              <p className="mt-1 text-right text-[11px] text-[#c9a8b2]">{form.description.length} / 500</p>
            </Field>

            <Field label="รูปแบบการขาย">
              <select className="soft-input" value={form.saleMode} onChange={(e) => change("saleMode", e.target.value)}>
                <option value="FREE">อ่านฟรีทั้งเรื่อง</option>
                <option value="FULL">ติดราคาซื้อทั้งเรื่อง</option>
                <option value="CHAPTER">ติดเงินรายตอน</option>
                <option value="BOTH">ซื้อทั้งเรื่องหรือซื้อรายตอน</option>
              </select>
            </Field>

            {(form.saleMode === "FULL" || form.saleMode === "BOTH") && (
              <Field label="ราคาปลดล็อกทั้งเรื่อง (บาท)">
                <input type="number" min="0" className="soft-input" value={form.fullPrice} onChange={(e) => change("fullPrice", e.target.value)} />
              </Field>
            )}

            <div className="rounded-xl bg-[#fff4f7] p-3 text-xs leading-5 text-[#a5677b]">
              แบบซื้อทั้งเรื่องจะปลดล็อกทุกตอน ส่วนแบบรายตอนให้ตั้งราคาตอนในหน้าเพิ่มตอน
            </div>

            {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
          </div>
        </div>

        <div className="panel p-6">
          <h2 className="mb-5 flex items-center gap-2 font-display text-lg font-bold text-[#5d3542]">
            <span className="text-[#ef7095]">✿</span> รูปหน้าปก
          </h2>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition ${
              dragActive ? "border-[#ef7095] bg-[#fff0f4]" : "border-[#efcbd6] bg-[#fff8fa]"
            }`}
          >
            <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-[#fde4ec] text-[#ef7095]">
              <UploadCloud size={24} />
            </div>
            <p className="text-sm font-semibold text-[#744a57]">คลิกหรือลากไฟล์มาวางที่นี่</p>
            <p className="mt-1 text-xs text-[#aa8490]">รองรับไฟล์ JPG, PNG, WEBP ขนาดไม่เกิน 5 MB</p>
            <button
              type="button"
              disabled={uploading}
              onClick={(e) => {
                e.stopPropagation();
                fileRef.current?.click();
              }}
              className="pink-btn mt-4 inline-flex items-center gap-1.5 !px-5"
            >
              <FolderOpen size={14} />
              {uploading ? "กำลังอัปโหลด..." : "เลือกไฟล์"}
            </button>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onFileInputChange} />
          </div>

          <p className="mb-2 mt-5 text-xs font-semibold text-[#744a57]">ตัวอย่างปก</p>
          <div className="overflow-hidden rounded-2xl border border-[#f0d8e0] bg-[#fff8fa]">
            {form.coverUrl ? (
              <div className="relative aspect-[3/4] w-full">
                <Image src={form.coverUrl} alt="ตัวอย่างหน้าปก" fill className="object-cover" />
              </div>
            ) : (
              <div className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-2 p-6 text-center text-xs text-[#c9a8b2]">
                <ImageIcon size={28} />
                ยังไม่มีรูปหน้าปก
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <button type="button" onClick={() => router.push("/admin/manga")} className="outline-btn px-8">
          ยกเลิก
        </button>
        <button disabled={loading || uploading} className="pink-btn px-8">
          {loading ? "กำลังบันทึก..." : "บันทึกมังงะ"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-[#744a57]">{label}</span>
      {children}
    </label>
  );
}
