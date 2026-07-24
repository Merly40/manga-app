// วางไฟล์นี้ทับที่: src/app/admin/settings/BannerSettingsForm.tsx
"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const TARGET_WIDTH = 1600;
const TARGET_HEIGHT = 640;

/**
 * ครอปภาพให้เต็มกรอบ TARGET_WIDTH x TARGET_HEIGHT แบบ "object-fit: cover"
 * (ขยายภาพให้เต็มกรอบก่อน แล้วตัดส่วนเกินออกให้พอดี ไม่มีขอบขาว ไม่มีภาพยืด)
 * ไม่ว่าไฟล์ต้นฉบับจะเป็นอัตราส่วนใดก็ตาม ผลลัพธ์จะได้ขนาดนี้เป๊ะทุกครั้ง
 */
async function cropToCover(file: File, targetW: number, targetH: number): Promise<Blob> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("โหลดไฟล์ภาพไม่สำเร็จ ลองไฟล์อื่นดูค่ะ"));
      el.src = objectUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("เบราว์เซอร์นี้ไม่รองรับการครอปภาพ");

    // scale แบบ cover: เลือกด้านที่ทำให้ภาพ "เต็มกรอบ" ทั้งสองด้าน (ด้านที่เกินจะถูกตัดออก)
    const scale = Math.max(targetW / img.width, targetH / img.height);
    const drawWidth = img.width * scale;
    const drawHeight = img.height * scale;
    const offsetX = (targetW - drawWidth) / 2;
    const offsetY = (targetH - drawHeight) / 2;

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    // เก็บ PNG ไว้ถ้าไฟล์ต้นฉบับเป็น PNG (รักษาความโปร่งใส) นอกนั้นแปลงเป็น JPEG เพื่อไฟล์เล็กลง
    const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("แปลงภาพไม่สำเร็จ"))), outputType, 0.92);
    });
    return blob;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export default function BannerSettingsForm({ initialBannerUrl }: { initialBannerUrl: string | null }) {
  const router = useRouter();
  const [bannerUrl, setBannerUrl] = useState(initialBannerUrl);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // 1) ครอปให้เป็น 1600x640 เป๊ะๆ ก่อน ไม่ว่าไฟล์ต้นฉบับจะสัดส่วนอะไรก็ตาม
      const croppedBlob = await cropToCover(file, TARGET_WIDTH, TARGET_HEIGHT);
      const ext = croppedBlob.type === "image/png" ? "png" : "jpg";
      const croppedFile = new File([croppedBlob], `banner-${Date.now()}.${ext}`, { type: croppedBlob.type });

      setPreview(URL.createObjectURL(croppedBlob));

      // 2) อัปโหลดไฟล์ที่ครอปแล้ว (ไม่ใช่ไฟล์ต้นฉบับ) ไปที่ /api/upload เดิม
      const formData = new FormData();
      formData.append("file", croppedFile);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || "อัปโหลดไม่สำเร็จ");

      const saveRes = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bannerImageUrl: uploadData.url }),
      });
      const saveData = await saveRes.json();
      if (!saveRes.ok) throw new Error(saveData.error || "บันทึกไม่สำเร็จ");

      setBannerUrl(saveData.bannerImageUrl);
      setSuccess("เปลี่ยนภาพแบนเนอร์เรียบร้อยแล้ว (ครอปเป็น 1600×640 พิกเซลให้อัตโนมัติ)");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      setPreview(null);
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleReset() {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bannerImageUrl: null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "ลบไม่สำเร็จ");
      setBannerUrl(null);
      setPreview(null);
      setSuccess("คืนค่าแบนเนอร์เริ่มต้นแล้ว");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  }

  const displayUrl = preview ?? bannerUrl;

  return (
    <div className="panel p-6">
      <h2 className="mb-1 font-display text-lg font-bold text-[#623846]">ภาพปกแบนเนอร์หน้าแรก</h2>
      <p className="mb-4 text-sm text-[#a98591]">
        ระบบจะครอปภาพให้เป็น <b className="text-[#623846]">1600 × 640 พิกเซล</b> อัตโนมัติแบบเต็มกรอบ (ตัดขอบส่วนเกินออก
        ไม่มีขอบขาว ไม่มีภาพยืด) ไม่ว่าไฟล์ต้นฉบับจะเป็นอัตราส่วนใดก็ตาม รองรับไฟล์ JPG, PNG, WEBP ขนาดไม่เกิน 5 MB — ถ้ายังไม่อัปโหลด
        ระบบจะใช้พื้นหลังไล่สีชมพูเริ่มต้นแทน
      </p>

      <div className="mb-4 flex min-h-[180px] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[#eccfd8] bg-[#fff8fa]">
        {displayUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={displayUrl} alt="ตัวอย่างแบนเนอร์" className="h-[180px] w-full object-cover" />
        ) : (
          <p className="p-6 text-center text-sm text-[#b58b98]">ยังไม่มีภาพแบนเนอร์ที่อัปโหลด (ใช้พื้นหลังไล่สีเริ่มต้น)</p>
        )}
      </div>

      {error && <p className="mb-3 rounded-xl bg-[#fff0f0] px-3 py-2 text-sm text-red-500">{error}</p>}
      {success && <p className="mb-3 rounded-xl bg-[#effaf0] px-3 py-2 text-sm text-green-600">{success}</p>}

      <div className="flex flex-wrap gap-3">
        <label className="pink-btn cursor-pointer">
          {loading ? "กำลังครอปและอัปโหลด..." : "📤 อัปโหลดภาพแบนเนอร์"}
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} disabled={loading} className="hidden" />
        </label>
        {bannerUrl && (
          <button type="button" onClick={handleReset} disabled={loading} className="outline-btn">
            คืนค่าแบนเนอร์เริ่มต้น
          </button>
        )}
      </div>
    </div>
  );
}