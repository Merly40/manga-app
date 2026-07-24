"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Notification = {
  id: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: string;
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then(setItems)
      .catch(() => {});
  }, []);

  const unread = items.filter((i) => !i.read).length;

  const markRead = async (id: string) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, read: true } : i)));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="การแจ้งเตือน"
        className="flex items-center gap-2 rounded-full px-2.5 py-1.5 text-[#9e7180] transition hover:bg-white dark:text-[#c9a3ae] dark:hover:bg-[#2a1820]"
      >
        <span className="relative">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path
              d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {unread > 0 && (
            <span className="absolute -right-1.5 -top-1.5 grid h-4 w-4 place-items-center rounded-full bg-[#ef4d6e] text-[10px] font-bold text-white">
              {unread}
            </span>
          )}
        </span>
        <span className="hidden whitespace-nowrap text-[11px] font-medium leading-tight sm:block">
          แจ้งเตือน
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 overflow-hidden rounded-2xl border border-[#f2dce3] bg-white shadow-xl dark:border-[#3a222b] dark:bg-[#1c1216]">
          {items.length === 0 ? (
            <p className="p-4 text-sm text-[#a27886] dark:text-[#a97c8b]">ยังไม่มีการแจ้งเตือน</p>
          ) : (
            items.map((n) => (
              <Link
                key={n.id}
                href={n.link}
                onClick={() => markRead(n.id)}
                className={`block border-b border-[#f2dce3] px-4 py-3 text-sm transition hover:bg-[#fff7f9] dark:border-[#3a222b] dark:hover:bg-[#2a1820] ${
                  n.read ? "text-[#a9838f] dark:text-[#a97c8b]" : "font-medium text-[#5d3542] dark:text-[#f2dfe4]"
                }`}
              >
                {n.message}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}