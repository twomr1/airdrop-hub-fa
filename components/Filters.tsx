// components/Filters.tsx
'use client'
import React from "react";
import ChainIcon from "@/components/ChainIcon";

export default function Filters({ status, setStatus, chains, setChains, chainOptions, verified, setVerified, kyc, setKyc, riskMax, setRiskMax, valueMin, setValueMin, sortBy, setSortBy }:
  { status: string[]; setStatus: (v: string[]) => void; chains: string[]; setChains: (v: string[]) => void; chainOptions: string[]; verified: boolean | null; setVerified: (v: boolean | null) => void; kyc: boolean | null; setKyc: (v: boolean | null) => void; riskMax: number; setRiskMax: (v: number) => void; valueMin: number; setValueMin: (v: number) => void; sortBy: string; setSortBy: (v: string) => void; }) {
  const toggle = (arr: string[], v: string, set: (a: string[]) => void) => set(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);
  return (
    <div className="lg:sticky lg:top-20 space-y-4">
      <div className="p-4 card">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">فیلترها</h3>
          <button onClick={() => { setStatus(["active", "upcoming"]); setChains([]); setVerified(null); setKyc(null); setRiskMax(5); setValueMin(0); setSortBy("trending"); }} className="text-sm text-sky-700">بازنشانی</button>
        </div>
        <div className="mt-3 space-y-3">
          <div>
            <div className="text-sm mb-1">وضعیت</div>
            <div className="flex flex-wrap gap-2">
              {["active", "upcoming", "ended"].map(s => (
                <button key={s} onClick={() => toggle(status, s, setStatus)} className={`px-3 py-1.5 rounded-full text-sm border ${status.includes(s) ? "bg-sky-600 text-white border-sky-700" : "border-gray-300 dark:border-slate-700"}`}>{s === "active" ? "فعال" : s === "upcoming" ? "آینده" : "پایان‌یافته"}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm mb-1">شبکه</div>
            <div className="flex flex-wrap gap-2">
              {chainOptions.length ? chainOptions.map(c => (
                <button key={c} onClick={() => toggle(chains, c, setChains)} className={`px-3 py-1.5 rounded-full text-sm border ${chains.includes(c) ? "bg-black text-white border-black" : "border-gray-300 dark:border-slate-700"}`}>
                  <span className="inline-flex items-center gap-1"><ChainIcon name={c} className="w-3.5 h-3.5" />{c}</span>
                </button>
              )) : <div className="text-xs text-gray-500 dark:text-slate-400">—</div>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="text-sm">فقط تاییدشده</div>
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${verified === true ? "bg-sky-600" : "bg-gray-300 dark:bg-slate-700"}`}>
                  <input type="checkbox" className="sr-only" checked={verified === true} onChange={e => setVerified((e.target as HTMLInputElement).checked ? true : null)} />
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white dark:bg-slate-200 transition ${verified === true ? "translate-x-6" : "translate-x-1"}`} />
                </div>
                <span className="text-sm">{verified === true ? "بله" : "هر دو"}</span>
              </label>
            </div>
            <div className="space-y-2">
              <div className="text-sm">بدون KYC</div>
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${kyc === false ? "bg-sky-600" : "bg-gray-300 dark:bg-slate-700"}`}>
                  <input type="checkbox" className="sr-only" checked={kyc === false} onChange={e => setKyc((e.target as HTMLInputElement).checked ? false : null)} />
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white dark:bg-slate-200 transition ${kyc === false ? "translate-x-6" : "translate-x-1"}`} />
                </div>
                <span className="text-sm">{kyc === false ? "فقط بدون KYC" : "هر دو"}</span>
              </label>
            </div>
          </div>
          <div>
            <label className="text-sm block mb-1">حداکثر ریسک: {new Intl.NumberFormat("fa-IR").format(riskMax)}</label>
            <input type="range" min={1} max={5} value={riskMax} onChange={e => setRiskMax(Number((e.target as HTMLInputElement).value))} className="w-full" />
          </div>
          <div>
            <label className="text-sm block mb-1">حداقل ارزش دلاری: {valueMin > 0 ? new Intl.NumberFormat("fa-IR", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(valueMin) : "—"}</label>
            <input type="range" min={0} max={2000} step={50} value={valueMin} onChange={e => setValueMin(Number((e.target as HTMLInputElement).value))} className="w-full" />
          </div>
          <div>
            <label className="text-sm block mb-1">مرتب‌سازی</label>
            <select value={sortBy} onChange={e => setSortBy((e.target as HTMLSelectElement).value)} className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-transparent px-3 py-2">
              <option value="trending">ترند</option>
              <option value="newest">جدیدترین</option>
              <option value="value">ارزش دلاری</option>
              <option value="deadline">نزدیک‌ترین ددلاین</option>
            </select>
          </div>
        </div>
      </div>
      <div className="p-4 card">
        <h4 className="font-bold mb-2">نکات سریع</h4>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-slate-400">
          <li>✅ همیشه از کیف‌پول ثانویه استفاده کنید.</li>
          <li>🚫 از لینک‌های ناشناس پرهیز کنید.</li>
          <li>🧭 ریسک ۴ و ۵ فقط برای حرفه‌ای‌ها.</li>
        </ul>
      </div>
    </div>
  );
}