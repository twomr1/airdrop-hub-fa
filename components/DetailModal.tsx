// components/DetailModal.tsx
'use client'
import React from "react";
import { Airdrop } from "@/lib/types";
import { fmtDate, fmtMoney, fmtNum } from "@/lib/utils";
import ProjectLogo from "@/components/ProjectLogo";
import ChainIcon from "@/components/ChainIcon";
import StatusBadge from "@/components/StatusBadge";

export default function DetailModal({ a, onClose }: { a: Airdrop; onClose: () => void }) {
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <ProjectLogo src={a.logoUrl} name={a.project} size={56} />
            <div>
              <h3 className="font-black text-2xl">{a.title}</h3>
              <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400"><span>{a.project}</span> • <span className="inline-flex items-center gap-1"><ChainIcon name={a.chain} />{a.chain}</span></div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800">✖</button>
        </div>
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div className="space-y-2 text-sm">
            <div className="flex items-start justify-between gap-4 py-1"><div className="text-gray-500 dark:text-slate-400">وضعیت</div><StatusBadge s={a.status} /></div>
            <div className="flex items-start justify-between gap-4 py-1"><div className="text-gray-500 dark:text-slate-400">بازه زمانی</div><div>{fmtDate(a.start)} تا {fmtDate(a.end)}</div></div>
            <div className="flex items-start justify-between gap-4 py-1"><div className="text-gray-500 dark:text-slate-400">ارزش تخمینی</div><div className="font-bold">{fmtMoney(a.estValueUSD)}</div></div>
            <div className="flex items-start justify-between gap-4 py-1"><div className="text-gray-500 dark:text-slate-400">ریسک</div><div>{fmtNum(a.risk)}/5</div></div>
            <div className="flex items-start justify-between gap-4 py-1"><div className="text-gray-500 dark:text-slate-400">برچسب‌ها</div><div className="flex flex-wrap gap-2">{a.tags.map(t => <span key={t} className="px-2 py-1 rounded-full border dark:border-slate-700 text-xs">{t}</span>)}</div></div>
            {a.regionLocks?.length > 0 && <div className="flex items-start justify-between gap-4 py-1"><div className="text-gray-500 dark:text-slate-400">محدودیت</div><div className="text-red-600">{a.regionLocks.join("، ")}</div></div>}
            {a.kyc && <div className="flex items-start justify-between gap-4 py-1"><div className="text-gray-500 dark:text-slate-400">هشدار</div><div className="text-amber-600">KYC موردنیاز است.</div></div>}
          </div>
          <div className="space-y-3 text-sm">
            <div className="font-bold">تسک‌ها</div>
            <ol className="space-y-2 list-decimal pr-5">
              {a.tasks.map(t => (
                <li key={t.label} className="flex items-center flex-wrap gap-2">
                  <span>{t.label}</span>
                  <span className="flex items-center gap-1">
                    {t.types.map(tp => <span key={tp} className="px-2 py-0.5 rounded-full text-[10px] border border-gray-300 dark:border-slate-700">{tp}</span>)}
                  </span>
                </li>
              ))}
            </ol>
            <div className="font-bold mt-4">لینک‌ها</div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(a.links).map(([k, v]) => (
                <a key={k} href={v || "#"} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-center">{k}</a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button className="px-4 py-2 rounded-xl border border-gray-300 dark:border-slate-700" onClick={onClose}>بستن</button>
          <a href={a.links.website || "#"} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-2xl bg-sky-600 text-white hover:bg-sky-700">رفتن به وبسایت</a>
        </div>
      </div>
    </div>
  );
}