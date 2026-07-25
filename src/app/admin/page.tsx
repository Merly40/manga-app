// วางไฟล์นี้ทับที่: src/app/admin/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  Flower2,
  FolderCog,
  Music2,
  Settings2,
  Users,
  BookOpen,
  Layers,
  Clock,
  ArrowRight,
} from "lucide-react";
import AdminSidebar from "./AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user) redirect("/login");
  if (role !== "ADMIN") redirect("/");

  // นับข้อมูลระบบไว้โชว์ในการ์ด "ข้อมูลระบบ"
  // ⚠️ ปรับชื่อโมเดล (user / manga / chapter) ให้ตรงกับ schema.prisma จริงของโปรเจกต์ ถ้าชื่อโมเดลไม่ตรงกันตรงนี้จะคอมไพล์ไม่ผ่าน
  const [userCount, mangaCount, chapterCount] = await Promise.all([
    prisma.user.count(),
    prisma.manga.count(),
    prisma.chapter.count(),
  ]);

  const updatedAt = new Date().toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#fffafb]">
      <div className="mx-auto grid max-w-[1500px] gap-6 px-6 py-7 xl:grid-cols-[220px_1fr]">
        <AdminSidebar />

        <section>
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#fde4ec] text-[#ef7095]">
              <Flower2 size={20} />
            </span>
            <div>
              <h1 className="font-display text-2xl font-bold text-[#5d3542]">Admin Dashboard</h1>
              <p className="mt-0.5 text-sm text-[#a98591]">จัดการเว็บไซต์ได้อย่างง่ายดาย</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <DashboardCard
              href="/admin/upload"
              icon={<FolderCog size={22} />}
              iconBg="bg-[#fde4ec]"
              iconColor="text-[#ef7095]"
              title="จัดการมังงะ / อัปโหลด"
              description="เพิ่ม แก้ไข ลบ และจัดการมังงะ รวมถึงการอัปโหลดตอนใหม่"
              cta="ไปหน้าอัปโหลด"
            />

            <DashboardCard
              href="/admin/song-requests"
              icon={<Music2 size={22} />}
              iconBg="bg-[#efeafd]"
              iconColor="text-[#8b7fd1]"
              title="คำขอเพลง"
              description="จัดการคำขอเพลง ดูรายการและสถานะคำขอเพลง"
              cta="จัดการคำขอเพลง"
            />

            <DashboardCard
              href="/admin/settings"
              icon={<Settings2 size={22} />}
              iconBg="bg-[#efeafd]"
              iconColor="text-[#8b7fd1]"
              title="ตั้งค่าเว็บไซต์"
              description="จัดการข้อมูลเว็บไซต์ ตั้งค่า Banner และการแสดงผลต่าง ๆ"
              cta="ตั้งค่าเว็บไซต์"
            />

            <div className="panel relative overflow-hidden p-6">
              <BunnyDoodle className="pointer-events-none absolute -bottom-3 -right-3 h-28 w-28 opacity-90" />
              <h3 className="mb-4 font-display text-lg font-bold text-[#5d3542]">ข้อมูลระบบ</h3>
              <ul className="relative space-y-3 text-sm">
                <StatRow icon={<Users size={15} />} label="ผู้ใช้งานทั้งหมด" value={`${userCount.toLocaleString("th-TH")} คน`} />
                <StatRow icon={<BookOpen size={15} />} label="มังงะทั้งหมด" value={`${mangaCount.toLocaleString("th-TH")} เรื่อง`} />
                <StatRow icon={<Layers size={15} />} label="ตอนทั้งหมด" value={`${chapterCount.toLocaleString("th-TH")} ตอน`} />
                <StatRow icon={<Clock size={15} />} label="อัปเดตล่าสุด" value={updatedAt} />
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function DashboardCard({
  href,
  icon,
  iconBg,
  iconColor,
  title,
  description,
  cta,
}: {
  href: string;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="panel group flex flex-col justify-between p-6 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <span className={`mb-5 grid h-12 w-12 place-items-center rounded-2xl ${iconBg} ${iconColor}`}>
        {icon}
      </span>
      <div>
        <h3 className="font-display text-lg font-bold text-[#5d3542]">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-[#a98591]">{description}</p>
      </div>
      <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#df6488]">
        {cta}
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

function StatRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <li className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-[#a98591]">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#f6eef1] text-[#b58b98]">
          {icon}
        </span>
        {label}
      </span>
      <span className="font-semibold text-[#5d3542]">{value}</span>
    </li>
  );
}

function BunnyDoodle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <ellipse cx="40" cy="28" rx="9" ry="22" fill="#fbdce6" transform="rotate(-12 40 28)" />
      <ellipse cx="78" cy="28" rx="9" ry="22" fill="#fbdce6" transform="rotate(12 78 28)" />
      <ellipse cx="40" cy="30" rx="4" ry="14" fill="#f6b9cf" transform="rotate(-12 40 30)" />
      <ellipse cx="78" cy="30" rx="4" ry="14" fill="#f6b9cf" transform="rotate(12 78 30)" />
      <ellipse cx="60" cy="72" rx="34" ry="30" fill="#fbdce6" />
      <circle cx="48" cy="66" r="3" fill="#7a4d5c" />
      <circle cx="72" cy="66" r="3" fill="#7a4d5c" />
      <path d="M56 76 q4 4 8 0" stroke="#c96b86" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="60" cy="84" rx="6" ry="4" fill="#f6b9cf" />
    </svg>
  );
}