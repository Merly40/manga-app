"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("รหัสผ่านทั้งสองช่องไม่ตรงกัน กรุณากรอกใหม่อีกครั้ง");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(
        res.status === 409
          ? "อีเมลนี้ถูกใช้สมัครสมาชิกไปแล้ว ลองเข้าสู่ระบบหรือใช้อีเมลอื่นแทน"
          : data.error || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"
      );
      setLoading(false);
      return;
    }

    await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
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
          <p className="mt-1 text-sm text-[#a27886]">มาเป็นส่วนหนึ่งของโลกมังงะกันเถอะ! ✨</p>
        </div>

        <div className="w-full panel p-7">
          <h2 className="mb-1 text-center font-display text-xl font-bold text-[#623846]">สร้างบัญชีใหม่ 💗</h2>
          <p className="mb-6 text-center text-sm text-[#a27886]">สมัครสมาชิกเพื่อเข้าใช้งานและรับสิทธิพิเศษมากมาย</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#623846]">ชื่อที่แสดง</label>
              <input
                type="text"
                placeholder="ตั้งชื่อที่ใช้แสดงในเว็บไซต์"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="soft-input"
              />
            </div>

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
              <label className="mb-1 block text-sm font-medium text-[#623846]">รหัสผ่าน</label>
              <input
                type="password"
                placeholder="ตั้งรหัสผ่าน (อย่างน้อย 8 ตัวอักษร)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="soft-input"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#623846]">ยืนยันรหัสผ่าน</label>
              <input
                type="password"
                placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="soft-input"
              />
            </div>

            {error && (
              <p className="rounded-xl bg-[#fff0f0] px-3 py-2 text-sm text-red-500">{error}</p>
            )}

            <button type="submit" disabled={loading} className="pink-btn w-full !rounded-full !py-3">
              {loading ? "กำลังสมัคร..." : "✨ สมัครสมาชิก"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-[#a27886]">
            มีบัญชีอยู่แล้ว?{" "}
            <Link href="/login" className="font-semibold text-[#ef7095] hover:underline">
              เข้าสู่ระบบเลย
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
