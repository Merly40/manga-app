"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

type SiteSettings = {
  id: string;
  topupBannerUrl: string | null;
};

export default function TopupSettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [savedBannerUrl, setSavedBannerUrl] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await fetch("/api/admin/site-settings", {
          method: "GET",
          cache: "no-store",
        });

        const data = (await response.json()) as
          | SiteSettings
          | { error?: string };

        if (!response.ok) {
          throw new Error(
            "error" in data && data.error
              ? data.error
              : "โหลดการตั้งค่าไม่สำเร็จ"
          );
        }

        const settings = data as SiteSettings;
        const currentBanner = settings.topupBannerUrl ?? "";

        setSavedBannerUrl(settings.topupBannerUrl);
        setBannerPreview(currentBanner);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "เกิดข้อผิดพลาดขณะโหลดข้อมูล"
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadSettings();
  }, []);

  function handleChooseFile() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setMessage("");
    setErrorMessage("");

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage("รองรับเฉพาะไฟล์ JPG, PNG และ WEBP");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("ไฟล์ต้องมีขนาดไม่เกิน 5 MB");
      event.target.value = "";
      return;
    }

    if (bannerPreview.startsWith("blob:")) {
      URL.revokeObjectURL(bannerPreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setBannerFile(file);
    setBannerPreview(previewUrl);
  }

  function handleRemoveBanner() {
    if (bannerPreview.startsWith("blob:")) {
      URL.revokeObjectURL(bannerPreview);
    }

    setBannerFile(null);
    setBannerPreview("");
    setMessage("");
    setErrorMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSaveBanner() {
    try {
      setIsSaving(true);
      setMessage("");
      setErrorMessage("");

      let finalBannerUrl: string | null = savedBannerUrl;

      if (bannerFile) {
        const formData = new FormData();
        formData.append("file", bannerFile);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = (await uploadResponse.json()) as {
          url?: string;
          error?: string;
        };

        if (!uploadResponse.ok || !uploadData.url) {
          throw new Error(uploadData.error || "อัปโหลดรูปไม่สำเร็จ");
        }

        finalBannerUrl = uploadData.url;
      } else if (!bannerPreview) {
        finalBannerUrl = null;
      }

      const saveResponse = await fetch("/api/admin/site-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topupBannerUrl: finalBannerUrl,
        }),
      });

      const saveData = (await saveResponse.json()) as {
        topupBannerUrl?: string | null;
        error?: string;
      };

      if (!saveResponse.ok) {
        throw new Error(saveData.error || "บันทึกการตั้งค่าไม่สำเร็จ");
      }

      const newBannerUrl = saveData.topupBannerUrl ?? finalBannerUrl;

      setSavedBannerUrl(newBannerUrl);
      setBannerPreview(newBannerUrl ?? "");
      setBannerFile(null);
      setMessage("บันทึก Banner สำเร็จแล้ว");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "เกิดข้อผิดพลาดขณะบันทึกข้อมูล"
      );
    } finally {
      setIsSaving(false);
    }
  }

    return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold text-[#ef7095]">
          จัดการหน้าเติมพอยต์
        </h1>

        <p className="mt-2 text-[#9b7a86]">
          เปลี่ยนรูป Banner ของหน้าเติมพอยต์
        </p>
      </div>

      <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[#5d3542]">
          Banner หน้าเติมพอยต์
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          ขนาดแนะนำ 1920 × 500 px
        </p>

        <div className="mt-5 flex h-[220px] items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50">
          {isLoading ? (
            <span className="text-pink-400">
              กำลังโหลด...
            </span>
          ) : bannerPreview ? (
            <img
              src={bannerPreview}
              alt="Banner"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-pink-300">
              ยังไม่มีรูป Banner
            </span>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleChooseFile}
            className="rounded-xl bg-[#ef7095] px-5 py-3 font-medium text-white transition hover:bg-[#df6488]"
          >
            เลือกรูป Banner
          </button>

          <button
            type="button"
            onClick={handleRemoveBanner}
            className="rounded-xl border border-pink-200 bg-white px-5 py-3 font-medium text-[#ef7095] transition hover:bg-pink-50"
          >
            ลบรูป
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveBanner}
            className="rounded-xl bg-green-500 px-5 py-3 font-medium text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />

        {message && (
          <div className="mt-4 rounded-xl bg-green-50 p-4 text-green-700">
            {message}
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 rounded-xl bg-red-50 p-4 text-red-600">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}