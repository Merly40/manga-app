import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import SongRequestList from "./SongRequestList";

export const dynamic = "force-dynamic";

export default async function AdminSongRequestsPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user) redirect("/login");
  if (role !== "ADMIN") redirect("/");

  const requests = await prisma.songRequest.findMany({ orderBy: { createdAt: "desc" } });

  const total = requests.length;
  const pending = requests.filter((r) => r.status === "PENDING").length;
  const added = requests.filter((r) => r.status === "ADDED").length;
  const rejected = requests.filter((r) => r.status === "REJECTED").length;

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
          <Link href="/admin/settings" className="mb-1 block rounded-xl px-4 py-3 text-sm text-[#805764]">
            ตั้งค่าเว็บไซต์
          </Link>
          <Link
            href="/admin/song-requests"
            className="mb-1 block rounded-xl bg-[#fde4ec] px-4 py-3 text-sm font-semibold text-[#df6488]"
          >
            คำขอเพลง
          </Link>
        </aside>

        <section>
          <div className="mb-5">
            <h1 className="font-display text-2xl font-bold">คำขอเพลง</h1>
            <p className="mt-1 text-sm text-[#a98591]">รายการเพลงที่ผู้ใช้ขอเข้ามาจากหน้าเว็บไซต์</p>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="ทั้งหมด" value={total} />
            <StatCard label="รอดำเนินการ" value={pending} />
            <StatCard label="เพิ่มแล้ว" value={added} />
            <StatCard label="ปฏิเสธ" value={rejected} />
          </div>

          <SongRequestList
            requests={requests.map((r) => ({
              ...r,
              createdAt: r.createdAt.toISOString(),
            }))}
          />
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="panel p-5">
      <p className="text-sm text-[#a98591]">{label}</p>
      <p className="mt-1 text-2xl font-bold text-[#5d3542]">{value}</p>
    </div>
  );
}
