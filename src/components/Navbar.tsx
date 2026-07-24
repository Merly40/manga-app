"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import NotificationBell from "./NotificationBell";
import NightModeToggle from "./NightModeToggle";

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d={d} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Navbar() {
  const { data: session } = useSession();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const pathname = usePathname();

  const navLinkClass = (href: string) => {
    const active = href === "/" ? pathname === "/" : pathname?.startsWith(href);
    return `rounded-full px-3 py-1.5 transition ${
      active
        ? "bg-[#fff1f5] text-[#ef7095] dark:bg-[#3a1f28] dark:text-[#ff9db8]"
        : "text-[#7a5560] hover:bg-[#fff1f5] hover:text-[#ef7095] dark:text-[#c9a3ae] dark:hover:bg-[#3a1f28] dark:hover:text-[#ff9db8]"
    }`;
  };

  const navLinks = [
    { href: "/", label: "หน้าหลัก" },
    { href: "/categories", label: "หมวดหมู่" },
    { href: "/history", label: "ประวัติอ่านล่าสุด" },
    { href: "/favorites", label: "รายการโปรด" },
  ];

  return (
    <>
      <div className="petal-top h-5 bg-[#f5a0b7]" />
      <header className="sticky top-0 z-40 border-b border-[#f7e2e8] bg-white/95 backdrop-blur dark:border-[#3a222b] dark:bg-[#160d11]/95">
        <div className="mx-auto flex min-h-[82px] max-w-[1400px] items-center gap-7 px-5 py-3 md:px-6">
          <Link href="/" className="mr-1 flex min-w-fit items-center gap-3 font-display text-2xl font-bold text-[#ef7095] dark:text-[#ff8fac]">
            <span className="grid h-11 w-11 place-items-center rounded-2xl border border-[#f5c8d5] bg-[#fff4f7] dark:border-[#4a2b35] dark:bg-[#241318]">
              <Icon d="M7 9.5 4.5 6.8 4 12c0 5 3.3 8 8 8s8-3 8-8l-.5-5.2L17 9.5M9 14h.01M15 14h.01M10 17c1.3.7 2.7.7 4 0" />
            </span>
            Manhwa Duchess
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-1.5 whitespace-nowrap text-[13px] font-medium lg:flex">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className={navLinkClass(l.href)}>
                {l.label}
              </Link>
            ))}
            {role === "ADMIN" && (
              <Link href="/admin" className={navLinkClass("/admin") + " font-semibold"}>
                จัดการมังงะ
              </Link>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <form action="/" className="hidden w-52 items-center rounded-full border border-[#f0dce2] bg-[#fffafb] px-4 py-2.5 md:flex dark:border-[#3a222b] dark:bg-[#20141a]">
              <input name="q" className="w-full bg-transparent text-sm text-[#5d3542] outline-none placeholder:text-[#b98d9a] dark:text-[#f2dfe4] dark:placeholder:text-[#8a6874]" placeholder="ค้นหามังงะ..." />
              <Icon d="m21 21-4.35-4.35M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
            </form>
            <NightModeToggle />

            {session?.user ? (
              <div className="flex items-center gap-1 rounded-full border border-[#f5c8d5] bg-[#fff4f7] pl-1 pr-1.5 py-1 dark:border-[#3a222b] dark:bg-[#20141a]">
                {/* Notifications */}
                <NotificationBell />

                <span className="h-8 w-px shrink-0 bg-[#f5c8d5] dark:bg-[#3a222b]" />

                {/* Avatar / role dropdown */}
                <button className="flex items-center gap-2 whitespace-nowrap rounded-full px-2 py-1 transition hover:bg-white dark:hover:bg-[#2a1820]">
                  <img
                    src={session.user.image || "/avatar.png"}
                    alt={session.user.name ?? "avatar"}
                    className="h-9 w-9 shrink-0 rounded-full border-2 border-[#f5c8d5] object-cover dark:border-[#4a2b35]"
                  />
                  <span className="hidden flex-col items-start text-left leading-tight sm:flex">
                    <span className="text-xs font-semibold text-[#ef7095] dark:text-[#ff9db8]">
                      {role === "ADMIN" ? "แอดมิน" : session.user.name}
                    </span>
                    <span className="text-[11px] text-[#c98ea1] dark:text-[#a97c8b]">ยินดีต้อนรับกลับ</span>
                  </span>
                  <Icon d="m6 9 6 6 6-6" />
                </button>

                <span className="h-8 w-px shrink-0 bg-[#f5c8d5] dark:bg-[#3a222b]" />

                {/* Logout */}
                <button
                  className="flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-[#d85f83] transition hover:bg-white dark:text-[#ff9db8] dark:hover:bg-[#2a1820]"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <Icon d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                  <span className="hidden sm:inline">ออกจากระบบ</span>
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm text-[#5d3542] dark:text-[#f2dfe4]">เข้าสู่ระบบ</Link>
                <Link href="/register" className="pink-btn !rounded-full">สมัครสมาชิก</Link>
              </>
            )}
          </div>
        </div>

        <nav className="mx-auto flex max-w-[1400px] gap-1.5 overflow-x-auto whitespace-nowrap px-5 pb-3 text-[13px] font-medium lg:hidden">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className={navLinkClass(l.href)}>
              {l.label}
            </Link>
          ))}
          {role === "ADMIN" && (
            <Link href="/admin" className={navLinkClass("/admin") + " font-semibold"}>
              จัดการมังงะ
            </Link>
          )}
        </nav>
      </header>
    </>
  );
}