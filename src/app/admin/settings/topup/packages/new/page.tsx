"use client";

import { Coins, ImageIcon, Save } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import SuccessModal from "@/components/SuccessModal";

export default function NewTopupPackagePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const [price, setPrice] = useState(29);
  const [coins, setCoins] = useState(300);
  const [bonusCoins, setBonusCoins] = useState(0);

  function chooseImage() {
    fileInputRef.current?.click();
  }

  function handleImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function savePackage() {
    try {
      setSaving(true);
      setErrorMessage("");

      let uploadedImage = imageUrl;

      if (imageFile) {
        const form = new FormData();
        form.append("file", imageFile);

        const upload = await fetch("/api/upload", {
          method: "POST",
          body: form,
        });

        const uploadData = await upload.json();

        if (!upload.ok) {
          throw new Error(uploadData.error ?? "อัปโหลดรูปไม่สำเร็จ");
        }

        uploadedImage = uploadData.url;
        setImageUrl(uploadedImage);
      }

      const res = await fetch("/api/admin/topup-packages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          price,
          coins,
          bonusCoins,
          imageUrl: uploadedImage,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      // เด้ง popup น่ารักๆ ก่อน แล้วค่อยพากลับไปหน้ารายการแพ็กเกจ
      setShowSuccess(true);
      setTimeout(() => {
        location.href = "/admin/settings/topup/packages";
      }, 1200);
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <SuccessModal open={showSuccess} title="บันทึกแพ็กเกจสำเร็จแล้ว!" message="กำลังพากลับไปหน้ารายการแพ็กเกจ..." />

      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-pink-100 p-3">
          <Coins className="h-6 w-6 text-pink-500" />
        </div>

        <div>
          <h1 className="text-3xl font-bold">เพิ่มแพ็กเกจเติมพอยต์</h1>
          <p className="text-gray-500">สร้างแพ็กเกจใหม่</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 font-semibold">รายละเอียดแพ็กเกจ</h2>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block font-medium">ชื่อแพ็กเกจ</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border p-3 outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">รายละเอียด</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-xl border p-3 outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">ราคา (บาท)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">จำนวนเหรียญ</label>
              <input
                type="number"
                value={coins}
                onChange={(e) => setCoins(Number(e.target.value))}
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">โบนัส</label>
              <input
                type="number"
                value={bonusCoins}
                onChange={(e) => setBonusCoins(Number(e.target.value))}
                className="w-full rounded-xl border p-3"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="mb-5 font-semibold">รูปแพ็กเกจ</h2>

            <div className="flex h-72 items-center justify-center rounded-2xl border-2 border-dashed">
              <div className="text-center">
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} className="mx-auto h-56 rounded-xl object-cover" alt="" />
                ) : (
                  <ImageIcon className="mx-auto mb-4 h-12 w-12 text-pink-400" />
                )}

                <button
                  onClick={chooseImage}
                  type="button"
                  className="mt-4 rounded-xl bg-pink-500 px-5 py-3 font-medium text-white"
                >
                  เลือกรูป
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImage}
                />
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="rounded-xl bg-red-50 p-4 text-red-600">{errorMessage}</div>
          )}

          <button
            onClick={savePackage}
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-pink-500 py-4 text-lg font-semibold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-5 w-5" />
            {saving ? "กำลังบันทึก..." : "บันทึกแพ็กเกจ"}
          </button>
        </div>
      </div>
    </div>
  );
}