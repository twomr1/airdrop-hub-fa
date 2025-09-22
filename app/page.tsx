// app/page.tsx
'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Airdrop, FiltersState, TaskType, Theme } from "@/lib/types";
import { MOCK_AIRDROPS } from "@/lib/mock";
import { daysLeft, filtersFromSearch, fmtMoney, fmtNum, statusOf, trendScore, useSEO, upsertMetaTag } from "@/lib/utils";
import AirdropCard from "@/components/AirdropCard";
import Filters from "@/components/Filters";
import Pagination from "@/components/Pagination";
import SummaryBar from "@/components/SummaryBar";
import DetailModal from "@/components/DetailModal";
import AdminPanel from "@/components/AdminPanel";

function Header({ theme, onToggleTheme, onOpenSubmit, onSearch }: { theme: Theme; onToggleTheme: () => void; onOpenSubmit: () => void; onSearch: (v: string) => void }) {
  const [val, setVal] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => { const t = setTimeout(() => onSearch(val), 300); return () => clearTimeout(t); }, [val, onSearch]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); inputRef.current?.focus(); } };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, []);
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-slate-900/70 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <img src="/favicon.svg" alt="لوگو" className="h-10 w-10 rounded-2xl" />
          <div className="font-black text-xl">مرجع ایردراپ</div>
          <div className="hidden sm:block text-gray-500 dark:text-slate-400">| مرجع ایردراپ فارسی</div>
        </div>
        <div className="flex-1" />
        <div className="relative w-full max-w-md">
          <input
            ref={inputRef}
            value={val}
            onChange={e => setVal((e.target as HTMLInputElement).value)}
            placeholder="جستجو: نام پروژه، شبکه، تگ…"
            className="w-full rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-10 py-2 outline-none focus:ring-4 ring-sky-300/50"
            aria-label="جستجوی ایردراپ"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">⌘K</span>
        </div>
        <button onClick={onToggleTheme} aria-label="toggle theme" className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800">
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
        <button onClick={onOpenSubmit} className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition">پنل ادمین</button>
      </div>
    </header>
  );
}

export default function Page() {
  const [all, setAll] = useState<Airdrop[]>([]);
  const [loading, setLoading] = useState(true);

  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    const saved = (localStorage.getItem("ahub-theme") as Theme) || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    return saved === "dark" ? "dark" : "light";
  });

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string[]>(["active", "upcoming"]);
  const [chains, setChains] = useState<string[]>([]);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [kyc, setKyc] = useState<boolean | null>(null);
  const [riskMax, setRiskMax] = useState<number>(5);
  const [valueMin, setValueMin] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("trending");
  const [page, setPage] = useState<number>(1);
  const [detail, setDetail] = useState<Airdrop | null>(null);
  const [openAdmin, setOpenAdmin] = useState(false);
  const PAGE_SIZE = 8;

  useEffect(() => {
    const enriched = MOCK_AIRDROPS.map(a => ({ ...a, status: a.statusOverride ?? statusOf(a.start, a.end), trend: trendScore(a) }));
    setAll(enriched);
    const fromUrl = filtersFromSearch(typeof window !== "undefined" ? window.location.search : "");
    const lsRaw = typeof window !== "undefined" ? localStorage.getItem("ahub-filters") : null;
    const fromLs: Partial<FiltersState> = lsRaw ? JSON.parse(lsRaw) : {};
    setQ(fromUrl.q || fromLs.q || "");
    setStatus((fromUrl.status.length ? fromUrl.status : (fromLs.status as string[])) || ["active", "upcoming"]);
    setChains((fromUrl.chains.length ? fromUrl.chains : (fromLs.chains as string[])) || []);
    setVerified(fromUrl.verified !== null ? fromUrl.verified : (typeof fromLs.verified === "boolean" ? fromLs.verified : null));
    setKyc(fromUrl.kyc !== null ? fromUrl.kyc : (typeof fromLs.kyc === "boolean" ? fromLs.kyc : null));
    setRiskMax(fromUrl.riskMax ?? (typeof fromLs.riskMax === "number" ? fromLs.riskMax : 5));
    setValueMin(fromUrl.valueMin ?? (typeof fromLs.valueMin === "number" ? fromLs.valueMin : 0));
    setSortBy(fromUrl.sortBy || (fromLs.sortBy as string) || "trending");
    setPage(fromUrl.page || 1);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const s: FiltersState = { q, status, chains, verified, kyc, riskMax, valueMin, sortBy, page };
    localStorage.setItem("ahub-filters", JSON.stringify(s));
  }, [q, status, chains, verified, kyc, riskMax, valueMin, sortBy, page]);

  useEffect(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    p.set("status", status.join(","));
    if (chains.length) p.set("chains", chains.join(","));
    if (verified !== null) p.set("verified", String(verified));
    if (kyc !== null) p.set("kyc", String(kyc));
    if (riskMax !== 5) p.set("riskMax", String(riskMax));
    if (valueMin !== 0) p.set("valueMin", String(valueMin));
    if (sortBy !== "trending") p.set("sortBy", sortBy);
    if (page !== 1) p.set("page", String(page));
    const qstr = p.toString();
    if (typeof window !== "undefined") window.history.replaceState(null, "", qstr ? `?${qstr}` : window.location.pathname);
  }, [q, status, chains, verified, kyc, riskMax, valueMin, sortBy, page]);

  useEffect(() => { setPage(1); }, [q, status, chains, verified, kyc, riskMax, valueMin, sortBy]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("ahub-theme", theme);
    const tc = theme === "dark" ? "#0f172a" : "#ffffff";
    upsertMetaTag({ name: "theme-color", content: tc, id: "meta-theme-color" });
  }, [theme]);

  const onSearchCb = useCallback((v: string) => setQ(v), []);
  const uniqueChains = useMemo(() => Array.from(new Set(all.map(a => a.chain))).sort(), [all]);

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    let items = all.filter(a => {
      if (status.length && !status.includes(a.status)) return false;
      if (chains.length && !chains.includes(a.chain)) return false;
      if (verified !== null && a.verified !== verified) return false;
      if (kyc !== null && a.kyc !== kyc) return false;
      if (a.risk > riskMax) return false;
      if (a.estValueUSD < valueMin) return false;
      if (k && ![a.title, a.project, a.chain, a.tags.join(" ")].some(x => x.toLowerCase().includes(k))) return false;
      return true;
    });
    switch (sortBy) {
      case "value": items.sort((a, b) => b.estValueUSD - a.estValueUSD); break;
      case "deadline": items.sort((a, b) => new Date(a.end).getTime() - new Date(b.end).getTime()); break;
      case "newest": items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      default: items.sort((a, b) => (b.trend ?? 0) - (a.trend ?? 0));
    }
    return items;
  }, [all, q, status, chains, verified, kyc, riskMax, valueMin, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useSEO({ theme, q, count: filtered.length, items: pageItems });

  return (
    <div>
      <Header theme={theme} onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")} onOpenSubmit={() => setOpenAdmin(true)} onSearch={onSearchCb} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-3">
          <Filters
            status={status} setStatus={setStatus}
            chains={chains} setChains={setChains}
            chainOptions={uniqueChains}
            verified={verified} setVerified={setVerified}
            kyc={kyc} setKyc={setKyc}
            riskMax={riskMax} setRiskMax={setRiskMax}
            valueMin={valueMin} setValueMin={setValueMin}
            sortBy={sortBy} setSortBy={setSortBy}
          />
        </aside>
        <section className="lg:col-span-9 space-y-4">
          <SummaryBar count={filtered.length} total={all.length} />
          {loading ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="animate-pulse rounded-3xl p-6 bg-gray-100 dark:bg-slate-800" />)}
            </div>
          ) : pageItems.length ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {pageItems.map(a => <AirdropCard key={a.id} a={a} onOpen={() => setDetail(a)} />)}
            </div>
          ) : (
            <div className="text-center p-10 border border-dashed rounded-2xl border-gray-300 dark:border-slate-700">
              <div className="text-2xl font-bold mb-2">🪂 ایردراپی مطابق فیلترها نیست</div>
              <div className="text-gray-500 dark:text-slate-400">کمی فیلترها را بازتر کنید یا جستجو را پاک کنید.</div>
            </div>
          )}
          {totalPages > 1 && <Pagination page={page} total={totalPages} onPage={setPage} />}
        </section>
      </main>
      <footer className="mt-12 py-10 border-t border-gray-200 dark:border-slate-700 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-gray-500 dark:text-slate-400">© 2025 مرجع ایردراپ فارسی — ساخته‌شده با ❤️</div>
          <div className="flex items-center gap-3">
            <a className="hover:underline" href="#">راهنما</a>
            <a className="hover:underline" href="#">قوانین و سلب‌مسئولیت</a>
            <a className="hover:underline" href="#">ارتباط</a>
          </div>
        </div>
      </footer>
      {detail && <DetailModal a={detail} onClose={() => setDetail(null)} />}
      {openAdmin && <AdminPanel onClose={() => setOpenAdmin(false)} onCreate={(item) => {
        const enriched: Airdrop = { ...item, status: item.statusOverride ?? statusOf(item.start, item.end), trend: trendScore(item) };
        setAll(prev => [enriched, ...prev]);
        setOpenAdmin(false);
      }} />}
    </div>
  );
}