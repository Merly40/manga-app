"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function UploadForm() {
  const params = useSearchParams();
  const router = useRouter();
  const slug = params.get("slug") || "";

  const [number, setNumber] = useState("");
  const [title, setTitle] = useState("");
  const [pricingType, setPricingType] = useState<"free" | "paid">("free");
  const [price, setPrice] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length === 0) {
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setProgress("");
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-12">
      <div className="panel p-6">
        <div className="flex items-center justify-between mb-5">
          <h1 className="font-display text-2xl font-bold text-[#623846] flex items-center gap-2">
            🌸 เพิ่มตอน
          </h1>
          <button
            type="button"
            onClick={() => router.push(`/admin`)}
            className="text-[#c9a8b2] hover:text-[#ef7095] text-xl leading-none"
            aria-label="ปิด"
          >
            ×
          </button>
        </div>
        <p className="text-xs text-[#a27886] mb-5">เรื่อง: {slug}</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#744a57] mb-1">ชื่อตอน</label>
            <input
              placeholder="กรอกชื่อตอน"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="soft-input"
            />
          </div>

          <div>
            <label className="block text-sm text-[#744a57] mb-1">เลขตอน</label>
            <input
              placeholder="เช่น 12 หรือ 12.5"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
              className="soft-input"
            />
            <p className="text-xs text-[#c36b86] mt-1">เลขตอนไม่ควรซ้ำกับตอนที่มีอยู่แล้ว</p>
          </div>

          <div>
            <label className="block text-sm text-[#744a57] mb-2">ตั้งค่าตอน</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 rounded-2xl border border-[#efd9e0] bg-[#fff8fa] px-4 py-3 cursor-pointer has-[:checked]:border-[#ef7095]">
                <input
                  type="radio"
                  name="pricingType"
                  checked={pricingType === "free"}
                  onChange={() => setPricingType("free")}
                  className="accent-[#ef7095]"
                />
                <span className="text-sm">🆓 ตอนฟรี</span>
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-[#efd9e0] bg-[#fff8fa] px-4 py-3 cursor-pointer has-[:checked]:border-[#ef7095]">
                <input
                  type="radio"
                  name="pricingType"
                  checked={pricingType === "paid"}
                  onChange={() => setPricingType("paid")}
                  className="accent-[#ef7095]"
                />
                <span className="text-sm flex-1">💎 ตั้งราคาขายตอน</span>
                {pricingType === "paid" && (
                  <input
                    type="number"
                    min={1}
                    placeholder="บาท"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-24 rounded-xl border border-[#efd9e0] bg-white px-2 py-1 text-sm focus:outline-none focus:border-[#ef7095]"
                  />
                )}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#744a57] mb-1">
              ไฟล์ภาพหน้ามังงะที่แปลแล้ว (เรียงตามลำดับที่เลือก)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="w-full text-sm"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {progress && <p className="text-[#a27886] text-sm">{progress}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="outline-btn flex-1"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="pink-btn flex-1"
            >
              {loading ? "กำลังอัปโหลด..." : "เพิ่มตอน"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={<p>กำลังโหลด...</p>}>
      <UploadForm />
    </Suspense>
  );
}
