// วางไฟล์นี้ที่: src/app/admin/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutGrid,
  Library,
  UploadCloud,
  BookCopy,
  FileStack,
  Music2,
  Settings2,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";

type IconType = LucideIcon;

type NavChild = { label: string; href: string; icon: IconType };
type NavGroup = { label: string; icon: IconType; children: NavChild[] };

const NAV: NavGroup[] = [
  {
    label: "จัดการมังงะ",
    icon: Library,
    children: [
      { label: "อัปโหลดมังงะ", href: "/admin/upload", icon: UploadCloud },
      { label: "จัดการมังงะทั้งหมด", href: "/admin/manga", icon: BookCopy },
      { label: "จัดการตอน", href: "/admin/chapters", icon: FileStack },
    ],
  },
  {
    label: "คำขอเพลง",
    icon: Music2,
    children: [{ label: "รายการคำขอเพลง", href: "/admin/song-requests", icon: Music2 }],
  },
  {
    label: "ตั้งค่าเว็บไซต์",
    icon: Settings2,
    children: [{ label: "ตั้งค่า Banner และเว็บไซต์", href: "/admin/settings", icon: Settings2 }],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname() ?? "/admin";

  const activeGroupIndex = NAV.findIndex((group) =>
    group.children.some((child) => pathname.startsWith(child.href))
  );
  const [openIndex, setOpenIndex] = useState<number | null>(
    activeGroupIndex === -1 ? null : activeGroupIndex
  );

  return (
    <aside className="panel h-fit p-4 xl:sticky xl:top-28">
      <div className="mb-3 flex items-center gap-2 px-3 pb-3 pt-1">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#fde4ec] text-[#ef7095]">
          <LayoutGrid size={16} />
        </span>
        <h2 className="font-display text-lg font-bold text-[#ef7095]">Admin Dashboard</h2>
      </div>

      <Link
        href="/admin"
        className={`mb-1 block rounded-xl px-4 py-3 text-sm transition ${
          pathname === "/admin"
            ? "bg-[#fde4ec] font-semibold text-[#df6488]"
            : "text-[#805764] hover:bg-[#fff4f7]"
        }`}
      >
        แดชบอร์ด
      </Link>

      <nav className="space-y-1">
        {NAV.map((group, index) => {
          const GroupIcon = group.icon;
          const isOpen = openIndex === index;
          const groupActive = group.children.some((child) => pathname.startsWith(child.href));

          return (
            <div key={group.label}>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                className={`flex w-full items-center gap-2 rounded-xl px-4 py-3 text-left text-sm transition ${
                  groupActive ? "font-semibold text-[#df6488]" : "text-[#805764] hover:bg-[#fff4f7]"
                }`}
              >
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${
                    groupActive ? "bg-[#fde4ec] text-[#ef7095]" : "bg-[#f6eef1] text-[#b58b98]"
                  }`}
                >
                  <GroupIcon size={14} />
                </span>
                <span className="flex-1">{group.label}</span>
                <ChevronDown
                  size={14}
                  className={`shrink-0 text-[#c9a8b2] transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isOpen && (
                <div className="ml-4 mt-1 space-y-1 border-l border-[#f3dde4] pl-4">
                  {group.children.map((child) => {
                    const ChildIcon = child.icon;
                    const active = pathname === child.href || pathname.startsWith(`${child.href}?`);
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                          active
                            ? "bg-[#fde4ec] font-semibold text-[#df6488]"
                            : "text-[#8a6472] hover:bg-[#fff4f7]"
                        }`}
                      >
                        <ChildIcon size={13} />
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}