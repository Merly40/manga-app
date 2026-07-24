"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Comment = {
  id: string;
  body: string;
  createdAt: string;
  user: { name: string };
};

export default function Comments({ chapterId }: { chapterId: string }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const load = () => {
    fetch(`/api/comments?chapterId=${chapterId}`)
      .then((r) => r.json())
      .then(setComments);
  };

  useEffect(load, [chapterId]);

  const submit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chapterId, body: text }),
    });
    setLoading(false);
    if (res.ok) {
      setText("");
      load();
    }
  };

  return (
    <section className="mt-10 border-t border-[#f2dce3] pt-6">
      <h2 className="font-display text-xl font-bold text-[#623846] mb-4">คอมเมนต์ ({comments.length})</h2>

      {session?.user ? (
        <div className="flex gap-2 mb-6">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="แสดงความคิดเห็นเกี่ยวกับตอนนี้..."
            className="soft-input"
          />
          <button
            onClick={submit}
            disabled={loading}
            className="pink-btn !px-4"
          >
            ส่ง
          </button>
        </div>
      ) : (
        <p className="text-sm text-[#a27886] mb-6">เข้าสู่ระบบเพื่อแสดงความคิดเห็น</p>
      )}

      <ul className="space-y-4">
        {comments.map((c) => (
          <li key={c.id} className="text-sm">
            <span className="font-medium text-[#ef7095]">{c.user.name}</span>{" "}
            <span className="text-[#c9a8b2] text-xs">
              {new Date(c.createdAt).toLocaleString("th-TH")}
            </span>
            <p className="text-[#5d3542] mt-1">{c.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
