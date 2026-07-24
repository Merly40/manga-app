// วางไฟล์นี้ที่: src/components/FollowButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  mangaId: string;
  isLoggedIn: boolean;
  initialFollowing: boolean;
  initialCount: number;
};

export default function FollowButton({ mangaId, isLoggedIn, initialFollowing, initialCount }: Props) {
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mangaId }),
    });
    setLoading(false);
    if (!res.ok) return;
    const data = await res.json();
    setFollowing(data.following);
    setCount(data.followerCount);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition disabled:opacity-60 ${
        following
          ? "border-[#ef7095] bg-[#fde4ec] text-[#df6488]"
          : "border-[#f2dce3] bg-white text-[#623846] hover:bg-[#fff2f6]"
      }`}
    >
      <span aria-hidden="true">🔖</span>
      {following ? "กำลังติดตาม" : "ติดตาม"} {count.toLocaleString("th-TH")} คน
    </button>
  );
}
