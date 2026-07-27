import { prisma } from "@/lib/prisma";

import TopupBanner from "@/components/topup/TopupBanner";
import PaymentMethods from "@/components/topup/PaymentMethods";
import TopupSteps from "@/components/topup/TopupSteps";
import TopupClient from "@/components/topup/TopupClient";

// สำคัญ: บังคับให้หน้านี้ query ข้อมูลใหม่ทุกครั้งที่มีคนเข้า
// ไม่งั้น Next.js จะ static-render ตอน build แล้วแช่ผลลัพธ์เก่าไว้ตลอด
// ทำให้แพ็กเกจที่แอดมินเพิ่งเพิ่มไม่โผล่ที่หน้านี้
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TopupPage() {
  const packages = await prisma.topupPackage.findMany({
    where: {
      enabled: true,
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        price: "asc",
      },
    ],
  });

  const settings = await prisma.siteSettings.findUnique({
    where: {
      id: "singleton",
    },
  });

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <TopupBanner bannerUrl={settings?.topupBannerUrl} />

      <TopupClient packages={packages} />

      <section className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <PaymentMethods />
        <TopupSteps />
      </section>
    </main>
  );
}