// components/AdminPanel.tsx
'use client'
import React, { useState } from "react";
import { Airdrop, TaskType } from "@/lib/types";

export default function AdminPanel({ onClose, onCreate }: { onClose: () => void; onCreate: (a: Airdrop) => void }) {
  const [form, setForm] = useState({
    title: "",
    project: "",
    chain: "Ethereum",
    reward: "",
    estValueUSD: 0,
    start: "",
    end: "",
    kyc: false,
    verified: false,
    tags: "",
    website: "",
    twitter: "",
    discord: "",
    docs: "",
    logoUrl: "",
    risk: 3 as 1|2|3|4|5,
  });
  const [tasks, setTasks] = useState<{ label: string; types: TaskType[] }[]>([]);
  const addTask = () => setTasks(prev => [...prev, { label: "", types: [] }]);
  const updateTask = (i: number, patch: Partial<{ label: string; types: TaskType[] }>) => setTasks(prev => prev.map((t, idx) => idx === i ? { ...t, ...patch } : t));
  const toggleType = (i: number, tp: TaskType) => setTasks(prev => prev.map((t, idx) => idx === i ? { ...t, types: t.types.includes(tp) ? t.types.filter(x => x !== tp) : [...t.types, tp] } : t));
  const removeTask = (i: number) => setTasks(prev => prev.filter((_, idx) => idx !== i));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = (form.title || form.project || "airdrop").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString(36);
    const item: Airdrop = {
      id,
      title: form.title.trim(),
      project: form.project.trim(),
      chain: form.chain.trim(),
      reward: form.reward.trim(),
      estValueUSD: Number(form.estValueUSD) || 0,
      start: form.start,
      end: form.end,
      statusOverride: null,
      status: "upcoming",
      kyc: !!form.kyc,
      regionLocks: [],
      risk: form.risk,
      verified: !!form.verified,
      tags: form.tags.split(",").map(s => s.trim()).filter(Boolean),
      tasks: tasks.filter(t => t.label.trim()).map(t => ({ label: t.label.trim(), types: t.types })),
      links: { website: form.website, twitter: form.twitter, discord: form.discord, docs: form.docs },
      createdAt: new Date().toISOString().slice(0,10),
      logoUrl: form.logoUrl || undefined,
    };
    onCreate(item);
  };

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <form onSubmit={submit} className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-start justify-between">
          <h3 className="font-black text-2xl">پنل ادمین • افزودن ایردراپ</h3>
          <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800">✖</button>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {(["title","project","chain","reward","estValueUSD","start","end","logoUrl","website","twitter","discord","docs"] as const).map((k) => (
            <div key={k} className="space-y-1">
              <label className="text-sm">{({ title: "عنوان", project: "نام پروژه", chain: "شبکه", reward: "نوع پاداش", estValueUSD: "ارزش تخمینی USD", start: "تاریخ شروع", end: "تاریخ پایان", logoUrl: "آدرس آیکون (URL)", website: "Website", twitter: "X/Twitter", discord: "Discord", docs: "Docs" } as any)[k]}</label>
              <input
                required={["title","project","chain","start","end"].includes(k)}
                type={k === "estValueUSD" ? "number" : (k === "start" || k === "end") ? "date" : "text"}
                className="input"
                value={(form as any)[k] as any}
                onChange={e => setForm(prev => ({ ...prev, [k]: k === "estValueUSD" ? Number((e.target as HTMLInputElement).value) : (e.target as HTMLInputElement).value }))}
              />
            </div>
          ))}
          <div className="space-y-1">
            <label className="text-sm">ریسک (۱ تا ۵)</label>
            <input type="range" min={1} max={5} value={form.risk} onChange={e => setForm(prev => ({ ...prev, risk: Number((e.target as HTMLInputElement).value) as 1|2|3|4|5 }))} className="w-full" />
          </div>
          <label className="flex items-center gap-3"><input type="checkbox" checked={form.kyc} onChange={e => setForm(prev => ({ ...prev, kyc: (e.target as HTMLInputElement).checked }))} />نیازمند KYC</label>
          <label className="flex items-center gap-3"><input type="checkbox" checked={form.verified} onChange={e => setForm(prev => ({ ...prev, verified: (e.target as HTMLInputElement).checked }))} />تاییدشده</label>
          <div className="md:col-span-2">
            <label className="text-sm block mb-1">تگ‌ها (با , جدا)</label>
            <input value={form.tags} onChange={e => setForm(prev => ({ ...prev, tags: (e.target as HTMLInputElement).value }))} className="input" />
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <div className="font-bold">تسک‌ها</div>
            <button type="button" onClick={addTask} className="px-3 py-1.5 rounded-xl border border-gray-300 dark:border-slate-700">افزودن تسک</button>
          </div>
          <div className="mt-3 space-y-3">
            {tasks.length === 0 && <div className="text-xs text-gray-500 dark:text-slate-400">هیچ تسکی اضافه نشده است.</div>}
            {tasks.map((t, i) => (
              <div key={i} className="p-3 rounded-xl border border-gray-200 dark:border-slate-700">
                <div className="grid md:grid-cols-3 gap-3 items-center">
                  <input placeholder="عنوان تسک" value={t.label} onChange={e => updateTask(i, { label: (e.target as HTMLInputElement).value })} className="rounded-lg border border-gray-300 dark:border-slate-700 bg-transparent px-3 py-2 md:col-span-1" />
                  <div className="flex flex-wrap gap-2 md:col-span-2">
                    {(["wallet","onchain","social","technical"] as TaskType[]).map(tp => (
                      <label key={tp} className="inline-flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={t.types.includes(tp)} onChange={() => toggleType(i, tp)} />{tp}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="mt-2 text-left">
                  <button type="button" onClick={() => removeTask(i)} className="text-red-600 text-xs">حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button type="button" className="px-4 py-2 rounded-xl border border-gray-300 dark:border-slate-700" onClick={onClose}>بستن</button>
          <button type="submit" className="btn bg-emerald-600 text-white hover:bg-emerald-700">ذخیره</button>
        </div>
      </form>
    </div>
  );
}