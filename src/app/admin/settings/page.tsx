import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import BannerSettingsForm from "./BannerSettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user) redirect("/login");
  if (role !== "ADMIN") redirect("/");

  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });

  return (
    <div className="min-h-screen bg-[#fffafb]">
      <div className="mx-auto grid max-w-[1500px] gap-6 px-6 py-7 xl:grid-cols-[220px_1fr]">
        <aside className="panel h-fit p-4 xl:sticky xl:top-28">
          <h2 className="px-3 pb-4 font-display text-xl font-bold text-[#ef7095]">Admin Panel</h2>
          <Link href="/admin" className="mb-1 block rounded-xl px-4 py-3 text-sm text-[#805764]">
            แดชบอร์ด
          </Link>
          <Link href="/admin" className="mb-1 block rounded-xl px-4 py-3 text-sm text-[#805764]">
            จัดการมังงะ
          </Link>
          {["จัดการตอน", "จัดการหมวดหมู่", "จัดการผู้ใช้", "จัดการคอมเมนต์"].map((x) => (
            <div key={x} className="mb-1 rounded-xl px-4 py-3 text-sm text-[#805764]">
              {x}
            </div>
          ))}
          <Link href="/admin/settings" className="mb-1 block rounded-xl bg-[#fde4ec] px-4 py-3 text-sm font-semibold text-[#df6488]">
            ตั้งค่าเว็บไซต์
          </Link>
        </aside>

        <section>
          <div className="mb-5">
            <h1 className="font-display text-2xl font-bold">ตั้งค่าเว็บไซต์</h1>
            <p className="mt-1 text-sm text-[#a98591]">เปลี่ยนภาพปกแบนเนอร์บนหน้าแรกของเว็บไซต์</p>
          </div>
          <BannerSettingsForm initialBannerUrl={settings?.bannerImageUrl ?? null} />
        </section>
      </div>
    </div>
  );
}
