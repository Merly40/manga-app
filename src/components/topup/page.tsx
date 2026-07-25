import { prisma } from "@/lib/prisma";

import TopupBanner from "@/components/topup/TopupBanner";
import PackageCard from "@/components/topup/PackageCard";

import PaymentMethods from "@/components/topup/PaymentMethods";
import TopupSteps from "@/components/topup/TopupSteps";

export default async function TopupPage() {
  const packages = await prisma.topupPackage.findMany({
  const settings = await prisma.siteSettings.findUnique({
  where: {
    id: "singleton",
  },
});
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

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8">

      <TopupBanner bannerUrl={settings.topupBannerUrl} />

      <section className="grid gap-8 lg:grid-cols-[2fr_420px]">

        {/* แพ็กเกจ */}

        <div>

          <div className="mb-6 flex items-center justify-between">

            <h2 className="text-2xl font-bold">
              เลือกแพ็กเกจพอยต์
            </h2>

            <span className="rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-600 dark:bg-pink-900/30 dark:text-pink-300">
              คุ้มที่สุด
            </span>

          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

            {packages.map((pkg, index) => (

              <PackageCard
                key={pkg.id}
                title={pkg.title}
                imageUrl={pkg.imageUrl}
                coins={pkg.coins}
                bonusCoins={pkg.bonusCoins}
                price={pkg.price}
                recommended={index === 2}
              />

            ))}

          </div>

        </div>

        {/* ฝั่งขวา */}

        <div className="rounded-[32px] border border-pink-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

          <h3 className="text-2xl font-bold">
            เติมพอยต์เอง
          </h3>

          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            พอยต์ละ 1 บาท
          </p>

          <input
            type="number"
            placeholder="0"
            className="mt-6 w-full rounded-2xl border border-pink-200 bg-transparent p-4 text-3xl font-bold outline-none focus:border-pink-500 dark:border-zinc-700"
          />

          <div className="mt-6 grid grid-cols-3 gap-3">

            {[100,300,500,1000,2000,5000].map((coin)=>(

              <button
                key={coin}
                className="rounded-2xl border border-pink-200 py-3 font-semibold transition hover:bg-pink-500 hover:text-white dark:border-zinc-700"
              >
                +{coin}
              </button>

            ))}

          </div>

          <div className="mt-8 rounded-2xl bg-pink-50 p-5 dark:bg-zinc-800">

            <div className="flex items-center justify-between">

              <span>ยอดที่ต้องชำระ</span>

              <span className="text-3xl font-bold text-pink-500">
                ฿0
              </span>

            </div>

          </div>

          <button
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 py-4 text-lg font-bold text-white transition hover:scale-[1.02]"
          >
            ดำเนินการชำระเงิน
          </button>

        </div>

      </section>

      <section className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">

  <PaymentMethods />

  <TopupSteps />

</section>

    </main>
  );
}