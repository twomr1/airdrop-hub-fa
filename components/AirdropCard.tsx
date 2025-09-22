// components/AirdropCard.tsx
import React from "react";
import { Airdrop } from "@/lib/types";
import { daysLeft, fmtMoney, fmtNum, pct } from "@/lib/utils";
import ProjectLogo from "@/components/ProjectLogo";
import ChainIcon from "@/components/ChainIcon";
import StatusBadge from "@/components/StatusBadge";

export default function AirdropCard({ a, onOpen }: { a: Airdrop; onOpen: () => void }) {
  const left = daysLeft(a.end);
  const prog = pct(a.start, a.end);
  return (
    <article className="card shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition">
      <div className="h-1.5 bg-gradient-to-l from-emerald-500 to-sky-500 rounded-t-3xl" />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <ProjectLogo src={a.logoUrl} name={a.project} />
            <div className="min-w-0">
              <h3 className="font-extrabold text-base leading-6 truncate" title={a.title}>{a.title}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 border border-gray-200 dark:border-slate-700"><ChainIcon name={a.chain} />{a.chain}</span>
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 border border-gray-200 dark:border-slate-700">🎁 {a.reward}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge s={a.status} />
            {a.verified && <span className="px-2 py-1 rounded-full border border-gray-200 dark:border-slate-700 text-xs">✔️ تاییدشده</span>}
            {a.kyc && <span className="px-2 py-1 rounded-full border border-gray-200 dark:border-slate-700 text-xs">KYC</span>}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <div className="text-gray-500 dark:text-slate-400">ارزش تخمینی</div>
            <div className="font-bold">{fmtMoney(a.estValueUSD)}</div>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <div className="text-gray-500 dark:text-slate-400">ریسک</div>
            <div className="font-bold">{fmtNum(a.risk)}/5</div>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <div className="text-gray-500 dark:text-slate-400">تا پایان</div>
            <div className="font-bold">{fmtNum(left)} روز</div>
          </div>
        </div>

        <div className="mt-3">
          <div className="h-2 w-full bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-600 transition-all" style={{ width: `${Math.min(100, Math.max(0, prog))}%` }} />
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-slate-400">پیشرفت بازه زمانی</div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {a.tags.map(t => <span key={t} className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200">{t}</span>)}
          </div>
          <div className="flex items-center gap-2">
            {a.links.website && <a href={a.links.website} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-xl border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-sm">وبسایت</a>}
            <button onClick={onOpen} className="px-3 py-1.5 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 text-sm">جزئیات</button>
          </div>
        </div>
      </div>
    </article>
  );
}