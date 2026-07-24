"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

const STARTER: Msg = {
  role: "assistant",
  content: "สวัสดีค่ะ หนูเป็นผู้ช่วย AI ของ Manhwa Duchess ถามหนูได้เลยว่าอยากอ่านแนวไหน หรือมีคำถามเกี่ยวกับเว็บไซต์ก็ถามได้นะคะ 🌸",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([STARTER]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user", content: text } as Msg];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages((cur) => [...cur, { role: "assistant", content: data.reply || "ขออภัยค่ะ ตอบไม่ได้ในขณะนี้" }]);
    } catch {
      setMessages((cur) => [...cur, { role: "assistant", content: "เกิดข้อผิดพลาด ลองใหม่อีกครั้งนะคะ" }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 flex h-[480px] w-[340px] flex-col overflow-hidden rounded-3xl border border-[#f2dce3] bg-white shadow-[0_20px_50px_rgba(150,60,90,.25)]">
          <div className="flex items-center justify-between bg-[#ef7095] px-5 py-4 text-white">
            <span className="font-display font-semibold">ผู้ช่วย Manhwa Duchess AI</span>
            <button onClick={() => setOpen(false)} aria-label="ปิดแชท" className="text-lg leading-none">×</button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto bg-[#fffafb] p-4">
            {messages.map((m, i) => (
              <div key={i} className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-6 ${m.role === "user" ? "ml-auto bg-[#ef7095] text-white" : "bg-white border border-[#f2dce3] text-[#5d3542]"}`}>
                {m.content}
              </div>
            ))}
            {loading && <div className="max-w-[85%] rounded-2xl border border-[#f2dce3] bg-white px-4 py-2.5 text-sm text-[#a9838f]">กำลังพิมพ์...</div>}
            <div ref={bottomRef} />
          </div>
          <div className="flex items-center gap-2 border-t border-[#f2dce3] p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="พิมพ์คำถามหรือขอคำแนะนำมังงะ..."
              className="soft-input"
            />
            <button onClick={send} disabled={loading} className="pink-btn !px-4">ส่ง</button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="เปิดแชท AI"
        className="grid h-14 w-14 place-items-center rounded-full bg-[#ef7095] text-2xl text-white shadow-[0_12px_28px_rgba(218,106,139,.4)] transition hover:bg-[#e35e87]"
      >
        {open ? "×" : "💬"}
      </button>
    </div>
  );
}
