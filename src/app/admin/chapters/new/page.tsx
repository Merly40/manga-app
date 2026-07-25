// วางไฟล์นี้ทับที่: src/app/admin/upload/page.tsx
"use client";

import { Suspense, useMemo, useRef, useState, type DragEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FilePlus2, UploadCloud, X, BookOpenText, Gem, ArrowLeft } from "lucide-react";
import AdminSidebar from "../../AdminSidebar";

function AddChapterForm() {
  const params = useSearchParams();
  const router = useRouter();
  const slug = params.get("slug") || "";

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [number, setNumber] = useState("");
  const [title, setTitle] = useState("");
  const [pricingType, setPricingType] = useState<"free" | "paid">("free");
  const [price, setPrice] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");

  const previews = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files]);

  function addFiles(list: FileList | File[]) {
    const incoming = Array.from(list).filter((file) => file.type.startsWith("image/"));
    if (incoming.length === 0) return;
    setError("");
    setFiles((current) => [...current, ...incoming]);
  }

  function removeFileAt(index: number) {
    setFiles((current) => current.filter((_, i) => i !== index));
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      setError("เลือกไฟล์ภาพอย่างน้อย 1 หน้า");
      return;
    }
    if (pricingType === "paid" && (!price || Number(price) <= 0)) {
      setError("กรอกราคาตอนให้ถูกต้อง");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const pageUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        setProgress(`กำลังอัปโหลดหน้า ${i + 1}/${files.length}...`);
        const formData = new FormData();
        formData.append("file", files[i]);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) throw new Error("อัปโหลดไฟล์ล้มเหลว");
        const data = await res.json();
        pageUrls.push(data.url);
      }

      setProgress("กำลังบันทึกตอน...");
      const res = await fetch(`/api/manga/${slug}/chapters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number,
          title,
          pageUrls,
          price: pricingType === "paid" ? Number(price) : 0,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "บันทึกตอนล้มเหลว");
      }

      router.push(`/manga/${slug}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
      setProgress("");
    }
  };

  return (
    <div className="min-h-screen bg-[#fffafb]">
      <div className="mx-auto grid max-w-[1500px] gap-6 px-6 py-7 xl:grid-cols-[220px_1fr]">
        <AdminSidebar />

        <section>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#fde4ec] text-[#ef7095]">
                <FilePlus2 size={20} />
              </span>
              <div>
                <h1 className="font-display text-2xl font-bold text-[#5d3542]">เพิ่มตอน</h1>
                <p className="mt-0.5 text-sm text-[#a98591]">
                  เรื่อง: <span className="font-semibold text-[#df6488]">{slug || "-"}</span>
                </p>
              </div>
            </div>
            <Link href="/admin/manga" className="outline-btn inline-flex items-center gap-1.5">
              <ArrowLeft size={14} />
              กลับไปหน้าจัดการมังงะ
            </Link>
          </div>

          <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="panel p-6">
              <h2 className="mb-5 flex items-center gap-2 font-display text-lg font-bold text-[#5d3542]">
                <span className="text-[#ef7095]">✿</span> ข้อมูลตอน
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#744a57]">ชื่อตอน</label>
                  <input
                    placeholder="กรอกชื่อตอน"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="soft-input"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#744a57]">เลขตอน</label>
                  <input
                    placeholder="เช่น 12 หรือ 12.5"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    required
                    className="soft-input"
                  />
                  <p className="mt-1 text-[11px] text-[#c9a8b2]">เลขตอนไม่ควรซ้ำกับตอนที่มีอยู่แล้ว</p>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-[#744a57]">ตั้งค่าตอน</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 rounded-2xl border border-[#efd9e0] bg-[#fff8fa] px-4 py-3 cursor-pointer transition has-[:checked]:border-[#ef7095] has-[:checked]:bg-[#fff0f4]">
                      <input
                        type="radio"
                        name="pricingType"
                        checked={pricingType === "free"}
                        onChange={() => setPricingType("free")}
                        className="accent-[#ef7095]"
                      />
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#fde4ec] text-[#ef7095]">
                        <BookOpenText size={15} />
                      </span>
                      <span className="text-sm text-[#5d3542]">ตอนฟรี</span>
                    </label>

                    <label className="flex items-center gap-3 rounded-2xl border border-[#efd9e0] bg-[#fff8fa] px-4 py-3 cursor-pointer transition has-[:checked]:border-[#ef7095] has-[:checked]:bg-[#fff0f4]">
                      <input
                        type="radio"
                        name="pricingType"
                        checked={pricingType === "paid"}
                        onChange={() => setPricingType("paid")}
                        className="accent-[#ef7095]"
                      />
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#efeafd] text-[#8b7fd1]">
                        <Gem size={15} />
                      </span>
                      <span className="flex-1 text-sm text-[#5d3542]">ตั้งราคาขายตอน</span>
                      {pricingType === "paid" && (
                        <input
                          type="number"
                          min={1}
                          placeholder="บาท"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-24 rounded-xl border border-[#efd9e0] bg-white px-2.5 py-1.5 text-sm outline-none focus:border-[#ef7095]"
                        />
                      )}
                    </label>
                  </div>
                </div>

                {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
                {progress && <p className="text-sm text-[#a27886]">{progress}</p>}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => router.push("/admin/manga")}
                    className="outline-btn flex-1"
                  >
                    ยกเลิก
                  </button>
                  <button type="submit" disabled={loading} className="pink-btn flex-1">
                    {loading ? "กำลังอัปโหลด..." : "เพิ่มตอน"}
                  </button>
                </div>
              </div>
            </div>

            <div className="panel p-6">
              <h2 className="mb-5 flex items-center gap-2 font-display text-lg font-bold text-[#5d3542]">
                <span className="text-[#ef7095]">✿</span> หน้ามังงะที่แปลแล้ว
              </h2>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition ${
                  dragActive ? "border-[#ef7095] bg-[#fff0f4]" : "border-[#efcbd6] bg-[#fff8fa]"
                }`}
              >
                <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-[#fde4ec] text-[#ef7095]">
                  <UploadCloud size={24} />
                </div>
                <p className="text-sm font-semibold text-[#744a57]">คลิกหรือลากไฟล์มาวางที่นี่</p>
                <p className="mt-1 text-xs text-[#aa8490]">รองรับไฟล์ JPG, PNG, WEBP หลายไฟล์ เรียงตามลำดับที่เลือก</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) addFiles(e.target.files);
                    e.target.value = "";
                  }}
                  className="hidden"
                />
              </div>

              {files.length > 0 && (
                <>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs font-semibold text-[#744a57]">{files.length} หน้า</p>
                    <button
                      type="button"
                      onClick={() => setFiles([])}
                      className="text-xs font-semibold text-[#df6488] hover:underline"
                    >
                      ล้างทั้งหมด
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2.5">
                    {previews.map((src, index) => (
                      <div
                        key={`${files[index].name}-${index}`}
                        className="group relative overflow-hidden rounded-xl border border-[#f0d8e0] bg-white"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt={`หน้า ${index + 1}`} className="aspect-[3/4] w-full object-cover" />
                        <span className="absolute left-1.5 top-1.5 rounded-full bg-black/50 px-1.5 py-0.5 text-[10px] text-white">
                          {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFileAt(index)}
                          aria-label="ลบหน้านี้"
                          className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-black/50 text-white opacity-0 transition group-hover:opacity-100"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-[#a98591]">กำลังโหลด...</p>}>
      <AddChapterForm />
    </Suspense>
  );
}
