import { Fragment } from "react";
import {
  PawPrint,
  MousePointerClick,
  CreditCard,
  CircleDollarSign,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    icon: MousePointerClick,
    title: "เลือกแพ็กเกจ",
    desc: "หรือกรอกจำนวนพอยต์ที่ต้องการ",
  },
  {
    icon: CreditCard,
    title: "เลือกช่องทาง",
    desc: "การชำระเงิน",
  },
  {
    icon: CircleDollarSign,
    title: "ชำระเงิน",
    desc: "ตามยอดที่แสดง",
  },
  {
    icon: BadgeCheck,
    title: "รับพอยต์ทันที",
    desc: "เข้าบัญชีของคุณ",
  },
];

export default function TopupSteps() {
  return (
    <div className="rounded-[30px] border border-pink-200/60 bg-pink-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-7 flex items-center gap-2 text-lg font-bold text-pink-500 dark:text-pink-300">
        <PawPrint className="h-4 w-4" />
        วิธีการเติมพอยต์
      </h3>

      <div className="flex items-start justify-between">
        {steps.map((item, index) => {
          const Icon = item.icon;
          const isLast = index === steps.length - 1;

          return (
            <Fragment key={item.title}>
              <div className="flex flex-1 flex-col items-center text-center">
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-pink-200 bg-white dark:border-pink-500/30 dark:bg-zinc-800">
                    <Icon className="h-6 w-6 text-pink-500 dark:text-pink-300" />
                  </div>
                  <span className="absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white">
                    {index + 1}
                  </span>
                </div>

                <p className="mt-3 text-xs font-bold text-zinc-700 dark:text-zinc-100 sm:text-sm">
                  {item.title}
                </p>
                <p className="mt-0.5 max-w-[92px] text-[10px] leading-snug text-zinc-500 dark:text-zinc-400">
                  {item.desc}
                </p>
              </div>

              {!isLast && (
                <div className="flex h-14 shrink-0 items-center px-1">
                  <ArrowRight className="h-4 w-4 text-pink-300 dark:text-pink-500/50" />
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}