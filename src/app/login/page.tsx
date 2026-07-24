"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ERROR_MESSAGES: Record<string, string> = {
  EMAIL_NOT_FOUND: "ไม่พบบัญชีที่ใช้อีเมลนี้ ลองตรวจสอบอีเมลอีกครั้งหรือสมัครสมาชิกใหม่",
  WRONG_PASSWORD: "รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง",
  CredentialsSignin: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError(ERROR_MESSAGES[res.error] || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      return;
    }
    if (typeof window !== "undefined") {
      if (remember) localStorage.setItem("manga-neko-remember-email", email);
      else localStorage.removeItem("manga-neko-remember-email");
    }
    router.push("/");
    router.refresh();
  };

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,#fde4ec_0%,transparent_45%),radial-gradient(circle_at_85%_25%,#f5d7ea_0%,transparent_40%),radial-gradient(circle_at_50%_90%,#ffeef3_0%,transparent_50%)]" />

      <div className="mx-auto flex min-h-[calc(100vh-82px)] max-w-sm flex-col items-center justify-center px-6 py-10">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="grid h-16 w-16 place-items-center rounded-3xl border border-[#f5c8d5] bg-[#fff4f7] text-3xl shadow-[0_10px_24px_rgba(239,112,149,.18)]">
            🐱
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold text-[#623846]">Manhwa Duchess</h1>
          <p className="mt-1 text-sm text-[#a27886]">โลกของมังงะที่ทำให้ใจคุณละลาย 💗</p>
        </div>

        <div className="w-full panel p-7">
          <h2 className="mb-1 text-center font-display text-xl font-bold text-[#623846]">ยินดีต้อนรับกลับมา!</h2>
          <p className="mb-6 text-center text-sm text-[#a27886]">เข้าสู่ระบบเพื่อไปพบกับมังงะเรื่องโปรดของคุณ</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#623846]">อีเมล</label>
              <input
                type="email"
                placeholder="กรอกอีเมลของคุณ"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="soft-input"
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-medium text-[#623846]">รหัสผ่าน</label>
                <Link href="#" className="text-xs text-[#ef7095] hover:underline">ลืมรหัสผ่าน?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="กรอกรหัสผ่าน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="soft-input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c9a8b2]"
                  aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-[#a27886]">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-[#efcdd7] accent-[#ef7095]"
              />
              จดจำฉันไว้ในระบบ
            </label>

            {error && (
              <p className="rounded-xl bg-[#fff0f0] px-3 py-2 text-sm text-red-500">{error}</p>
            )}

            <button type="submit" disabled={loading} className="pink-btn w-full !rounded-full !py-3">
              {loading ? "กำลังเข้าสู่ระบบ..." : "🐾 เข้าสู่ระบบ"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-[#a27886]">
            ยังไม่มีบัญชี?{" "}
            <Link href="/register" className="font-semibold text-[#ef7095] hover:underline">
              สมัครสมาชิกเลย
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
