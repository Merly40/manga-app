// วางไฟล์นี้ทับที่: src/app/admin/upload/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UploadCloud, ArrowLeft } from "lucide-react";
import AdminSidebar from "../AdminSidebar";
import NewMangaForm from "./NewMangaForm";

export const dynamic = "force-dynamic";

export default async function AdminUploadPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user) redirect("/login");
  if (role !== "ADMIN") redirect("/");

  return (
    <div className="min-h-screen bg-[#fffafb]">
      <div className="mx-auto grid max-w-[1500px] gap-6 px-6 py-7 xl:grid-cols-[220px_1fr]">
        <AdminSidebar />

        <section>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#fde4ec] text-[#ef7095]">
                <UploadCloud size={20} />
              </span>
              <div>
                <h1 className="font-display text-2xl font-bold text-[#5d3542]">อัปโหลดมังงะ</h1>
                <p className="mt-0.5 text-sm text-[#a98591]">เพิ่มมังงะเรื่องใหม่เข้าสู่ระบบ</p>
              </div>
            </div>
            <Link href="/admin/manga" className="outline-btn inline-flex items-center gap-1.5">
              <ArrowLeft size={14} />
              กลับไปหน้าจัดการมังงะ
            </Link>
          </div>

          <NewMangaForm />
        </section>
      </div>
    </div>
  );
}