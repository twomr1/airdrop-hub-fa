// components/StatusBadge.tsx
import React from "react";
export default function StatusBadge({ s }: { s: "active" | "upcoming" | "ended" }) {
  const map: Record<string, [string, string]> = { active: ["emerald", "فعال"], upcoming: ["brand", "آینده"], ended: ["red", "پایان"] };
  const [tone, label] = map[s] || ["slate", "نامشخص"];
  const classes = tone === "red" ? "bg-red-100 text-red-700" : tone === "emerald" ? "bg-emerald-100 text-emerald-700" : "bg-sky-100 text-sky-700";
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${classes}`}>● {label}</span>;
}