// lib/utils.ts
'use client'
import { Airdrop, FiltersState, Theme } from "@/lib/types";
import { useEffect } from "react";

export const now = () => new Date();
export const daysLeft = (end: string) =>
  Math.max(0, Math.ceil((new Date(end).getTime() - now().getTime()) / 86400000));

export const statusOf = (start: string, end: string): Airdrop["status"] => {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  const t = now().getTime();
  if (t < s) return "upcoming";
  if (t > e) return "ended";
  return "active";
};

export const pct = (start: string, end: string) => {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  const t = now().getTime();
  if (e <= s) return t >= e ? 100 : 0;
  if (t <= s) return 0;
  if (t >= e) return 100;
  return Math.round(((t - s) / (e - s)) * 100);
};

export const fmtDate = (d: string) =>
  new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date(d));
export const fmtNum = (n: number) => new Intl.NumberFormat("fa-IR").format(n);
export const fmtMoney = (n: number) =>
  new Intl.NumberFormat("fa-IR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export const trendScore = (a: Airdrop) => {
  const s = statusOf(a.start, a.end);
  const base = (a.verified ? 20 : 0) + Math.max(0, 10 - a.risk * 2);
  const value = Math.min(30, Math.log10(Math.max(1, a.estValueUSD)) * 10);
  const urgency =
    s === "active" ? Math.max(0, 20 - daysLeft(a.end)) : s === "upcoming" ? 10 : -10;
  const tagBonus = Math.min(20, (a.tags?.length || 0) * 3);
  return Math.round(base + value + urgency + tagBonus);
};

export const filtersFromSearch = (search: string): FiltersState => {
  const p = new URLSearchParams(search);
  const statusRaw = (p.get("status") ?? "active,upcoming")
    .split(",")
    .filter(Boolean);
  const chains = (p.get("chains") ?? "").split(",").filter(Boolean);
  const verified =
    p.get("verified") === "true" ? true : p.get("verified") === "false" ? false : null;
  const kyc = p.get("kyc") === "true" ? true : p.get("kyc") === "false" ? false : null;
  const r = parseInt(p.get("riskMax") ?? "5", 10);
  const riskMax = Number.isFinite(r) ? Math.min(5, Math.max(1, r)) : 5;
  const vm = parseInt(p.get("valueMin") ?? "0", 10);
  const valueMin = Number.isFinite(vm) ? Math.max(0, vm) : 0;
  const sb = p.get("sortBy") ?? "trending";
  const sortBy = ["trending", "newest", "value", "deadline"].includes(sb)
    ? sb
    : "trending";
  const pr = parseInt(p.get("page") ?? "1", 10);
  const page = Number.isFinite(pr) && pr > 0 ? pr : 1;
  return { q: p.get("q") ?? "", status: statusRaw, chains, verified, kyc, riskMax, valueMin, sortBy, page };
};

export function upsertMetaTag(opts: {
  name?: string;
  property?: string;
  content: string;
  id?: string;
  rel?: string;
  href?: string;
}) {
  if (typeof document === "undefined") return;
  const { name, property, content, id, rel, href } = opts;
  if (rel && href) {
    let link = (id ? (document.getElementById(id) as HTMLLinkElement | null) : null);
    if (!link) {
      link = document.createElement("link");
      if (id) link.id = id;
      link.rel = rel;
      document.head.appendChild(link);
    }
    link.href = href;
    return;
  }
  const selector = id
    ? `#${id}`
    : name
    ? `meta[name='${name}']`
    : property
    ? `meta[property='${property}']`
    : "meta[data-ahub]";
  let el = id
    ? (document.querySelector(selector) as HTMLMetaElement | null)
    : (document.querySelector(selector) as HTMLMetaElement | null);
  if (!el) {
    el = document.createElement("meta");
    if (name) el.setAttribute("name", name);
    if (property) el.setAttribute("property", property);
    if (id) el.id = id;
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function upsertJsonLd(id: string, data: any) {
  if (typeof document === "undefined") return;
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function useSEO({
  theme,
  q,
  count,
  items,
}: {
  theme: Theme;
  q: string;
  count: number;
  items: Airdrop[];
}) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const base =
      typeof window !== "undefined" ? window.location.origin : "https://example.com";
    const url =
      typeof window !== "undefined" ? window.location.href : "https://example.com";
    const title = `مرجع ایردراپ فارسی — ${count} نتیجه${q ? ` برای «${q}»` : ""}`;
    document.title = title;
    const desc =
      "مرجع فارسی ایردراپ‌های کریپتو با فیلتر پیشرفته، سورت ترند/ارزش، و جزئیات کامل پروژه‌ها.";

    upsertMetaTag({ name: "description", content: desc, id: "meta-desc" });
    upsertMetaTag({ property: "og:title", content: title, id: "og-title" });
    upsertMetaTag({ property: "og:description", content: desc, id: "og-desc" });
    upsertMetaTag({ property: "og:type", content: "website", id: "og-type" });
    upsertMetaTag({ property: "og:url", content: url, id: "og-url" });
    upsertMetaTag({ name: "twitter:card", content: "summary", id: "tw-card" });
    upsertMetaTag({ name: "twitter:title", content: title, id: "tw-title" });
    upsertMetaTag({ name: "twitter:description", content: desc, id: "tw-desc" });
    upsertMetaTag({ name: "robots", content: "index,follow", id: "robots" });
    upsertMetaTag({ rel: "canonical", href: url, content: "", id: "link-canonical" });

    const list = items.slice(0, 10).map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${base}/airdrops/${a.id}`,
      name: `${a.project} — ${a.title}`,
    }));

    upsertJsonLd("ld-website", {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "مرجع ایردراپ فارسی",
      url: base,
      potentialAction: {
        "@type": "SearchAction",
        target: `${base}/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    });

    upsertJsonLd("ld-collection", {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: title,
      url,
      hasPart: {
        "@type": "ItemList",
        itemListElement: list,
      },
    });
  }, [theme, q, count, items]);
}
