import { ShieldCheck, Zap, Gift, PawPrint, Heart, Sparkles } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "ปลอดภัย 100%",
    desc: "ระบบเติมเงินมาตรฐานสากล",
  },
  {
    icon: Zap,
    title: "เข้าทันที",
    desc: "พอยต์เข้าทันทีไม่ต้องรอ",
  },
  {
    icon: Gift,
    title: "โบนัสคุ้มค่า",
    desc: "รับพอยต์เพิ่มทุกแพ็กเกจ",
  },
  {
    icon: PawPrint,
    title: "สนับสนุนทีมงาน",
    desc: "ช่วยให้มังงะที่คุณรักแปลต่อเนื่อง",
  },
];

type Props = {
  bannerUrl?: string | null;
};

export default function TopupBanner({ bannerUrl }: Props) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-pink-200/60 bg-gradient-to-br from-pink-50 via-white to-rose-50 p-6 dark:border-pink-900/30 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 sm:p-8 lg:p-9">
      {/* ประกายดาวตกแต่ง */}
      <Sparkles className="absolute left-6 top-6 h-4 w-4 text-pink-300 dark:text-pink-500/40" />
      <Sparkles className="absolute right-1/3 top-10 h-3 w-3 text-pink-300 dark:text-pink-500/40" />
      <Sparkles className="absolute bottom-8 left-1/3 h-3 w-3 text-rose-300 dark:text-pink-500/30" />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center">
        {/* หัวข้อ */}
        <div className="shrink-0 lg:max-w-[240px]">
          <h1 className="font-display flex items-center gap-1.5 whitespace-nowrap text-3xl font-extrabold leading-tight text-rose-500 dark:text-pink-300 sm:text-4xl lg:text-5xl">
            เติมพอยต์
            <Sparkles className="h-5 w-5 shrink-0 text-pink-400" />
          </h1>
          <p className="mt-1.5 flex items-center gap-1.5 whitespace-nowrap text-base font-bold text-rose-400 dark:text-pink-200">
            ง่าย ๆ ได้ทันที
            <Heart className="h-3.5 w-3.5 shrink-0 fill-current" />
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            เติมพอยต์เพื่อปลดล็อกตอนพิเศษ
            <br />
            สนับสนุนการแปลมังงะให้คุณต่อเนื่อง
          </p>
        </div>

        {/* ฟีเจอร์เด่น (ไม่มีกรอบกล่อง ลอยอยู่บนพื้นหลัง) */}
        <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex flex-col items-center text-center">
                <div className="mb-2.5 flex h-14 w-14 items-center justify-center rounded-full border-2 border-pink-200 bg-white/80 shadow-sm dark:border-pink-500/20 dark:bg-zinc-900/70">
                  <Icon className="h-6 w-6 text-pink-500 dark:text-pink-300" />
                </div>
                <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-100">{item.title}</h3>
                <p className="mt-1 max-w-[110px] text-xs leading-snug text-zinc-500 dark:text-zinc-400">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* ภาพประกอบ */}
        <div className="relative flex h-[180px] w-[180px] shrink-0 items-center justify-center lg:h-[220px] lg:w-56">
          {bannerUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={bannerUrl} alt="Topup" className="max-h-full object-contain" />
          ) : (
            <div className="max-w-[190px] rounded-2xl rounded-br-sm bg-pink-500 px-4 py-3 text-center text-xs font-semibold leading-relaxed text-white shadow-lg dark:bg-pink-600">
              อัปเดตแพ็จเกจใหม่ทุกเดือน อย่าพลาด! 
            </div>
          )}
        </div>
      </div>
    </section>
  );
}