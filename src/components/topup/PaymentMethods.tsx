import { PawPrint, Landmark, Wallet, QrCode, ShieldCheck } from "lucide-react";

export default function PaymentMethods() {
  return (
    <div className="rounded-[30px] border border-pink-200/60 bg-pink-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-pink-500 dark:text-pink-300">
        <PawPrint className="h-4 w-4" />
        ช่องทางการชำระเงิน
      </h3>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* PromptPay */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-pink-100 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-800/60">
          <span className="rounded-lg bg-sky-100 px-2.5 py-1 text-sm font-extrabold text-sky-600 dark:bg-sky-500/10 dark:text-sky-300">
            PromptPay
          </span>
          <p className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">พร้อมเพย์</p>
        </div>

        {/* TrueMoney */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-pink-100 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-800/60">
          <div className="flex items-center gap-1.5 font-extrabold text-orange-500 dark:text-orange-400">
            <Wallet className="h-4 w-4" />
            TrueMoney
          </div>
          <p className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">Wallet</p>
        </div>

        {/* บัตรเครดิต */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-pink-100 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-800/60">
          <div className="flex items-center gap-1">
            <span className="rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-black italic text-white">
              VISA
            </span>
            <span className="flex h-4 w-6 items-center justify-center rounded-sm bg-gradient-to-r from-red-500 to-orange-400">
              <span className="h-2.5 w-2.5 -mr-1 rounded-full bg-red-500" />
              <span className="h-2.5 w-2.5 rounded-full bg-orange-400 opacity-90" />
            </span>
            <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[9px] font-bold text-white dark:bg-zinc-700">
              JCB
            </span>
          </div>
          <p className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">บัตรเครดิต/เดบิต</p>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-pink-100 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-800/60">
          <QrCode className="h-6 w-6 text-zinc-700 dark:text-zinc-200" />
          <p className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">สแกนจ่าย</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-500">
          <Landmark className="h-3.5 w-3.5" />
          ข้อมูลของคุณจะถูกเข้ารหัสอย่างปลอดภัย
        </div>
        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
          <ShieldCheck className="h-3 w-3" />
          SSL
        </span>
      </div>
    </div>
  );
}