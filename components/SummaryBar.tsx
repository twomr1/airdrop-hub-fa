    // components/SummaryBar.tsx
import React from "react";
export default function SummaryBar({ count, total }: { count: number; total: number }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 card">
      <div className="flex items-center gap-2">
        <span className="text-xl">🔎</span>
        <div className="font-medium">نتیجه: {new Intl.NumberFormat("fa-IR").format(count)} ایردراپ</div>
        <div className="text-sm text-gray-500 dark:text-slate-400">({new Intl.NumberFormat("fa-IR").format(total)} در کل)</div>
      </div>
      <div className="text-sm text-gray-500 dark:text-slate-400">نکته: برای تازه‌ها، سورت «جدیدترین» را بزن.</div>
    </div>
  );
}