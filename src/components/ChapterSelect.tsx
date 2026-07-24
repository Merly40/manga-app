"use client";

import { useRouter } from "next/navigation";

export default function ChapterSelect({
  slug,
  current,
  chapters,
}: {
  slug: string;
  current: number;
  chapters: { number: number }[];
}) {
  const router = useRouter();

  return (
    <select
      defaultValue={current}
      className="soft-input !w-auto !py-2 text-sm"
      onChange={(e) => router.push(`/manga/${slug}/${e.target.value}`)}
    >
      {chapters.map((c) => (
        <option key={c.number} value={c.number}>
          ตอนที่ {c.number}
        </option>
      ))}
    </select>
  );
}
