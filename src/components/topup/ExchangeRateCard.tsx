// ไฟล์ใหม่ (ยังไม่มีอยู่ในโปรเจกต์) — วางที่: src/components/topup/ExchangeRateCard.tsx
// การ์ด "อัตราแลกเปลี่ยน" ที่อยู่ข้าง ๆ ช่องทางการชำระเงิน/วิธีเติมพอยต์ ตามรูปตัวอย่าง
import { Coins, Cat } from "lucide-react";

export default function ExchangeRateCard() {
  return (
    <div className="flex flex-col justify-between rounded-[30px] border border-pink-200/60 bg-gradient-to-br from-pink-50 to-rose-50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
      <h3 className="mb-6 text-xl font-bold text-zinc-800 dark:text-white">อัตราแลกเปลี่ยน</h3>

      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
        <div className="flex items-center gap-3 text-2xl font-extrabold text-pink-500 dark:text-pink-300">
          <span className="flex items-center gap-1.5">
            <Coins className="h-6 w-6" />1 พอยต์
          </span>
          <span className="text-zinc-400 dark:text-zinc-500">=</span>
          <span>1 บาท</span>
        </div>

        <div className="mt-2 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm dark:bg-zinc-800">
          {/* TODO: เปลี่ยนเป็นไอคอนแมวจริงทีหลังถ้ามีรูป */}
          <Cat className="h-8 w-8 text-pink-400" />
        </div>
      </div>
    </div>
  );
}
