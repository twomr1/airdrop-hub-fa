// components/Pagination.tsx
import React from "react";
export default function Pagination({ page, total, onPage }: { page: number; total: number; onPage: (p: number) => void }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button disabled={page <= 1} onClick={() => onPage(page - 1)} className="px-3 py-1.5 rounded-xl border dark:border-slate-700 disabled:opacity-50">قبلی</button>
      <div className="text-sm">صفحه {new Intl.NumberFormat("fa-IR").format(page)} از {new Intl.NumberFormat("fa-IR").format(total)}</div>
      <button disabled={page >= total} onClick={() => onPage(page + 1)} className="px-3 py-1.5 rounded-xl border dark:border-slate-700 disabled:opacity-50">بعدی</button>
    </div>
  );
}