// components/ProjectLogo.tsx
'use client'
import React, { useState } from "react";
export default function ProjectLogo({ src, name, size = 48 }: { src?: string; name: string; size?: number }) {
  const [err, setErr] = useState(false);
  const letter = (name?.trim()?.[0] || "?").toUpperCase();
  return (
    <div style={{ width: size, height: size }} className="relative shrink-0 rounded-2xl overflow-hidden ring-1 ring-black/10 bg-gradient-to-br from-slate-100 to-slate-200 grid place-items-center">
      {src && !err ? (
        <img src={src} alt={name} className="h-full w-full object-cover" loading="lazy" onError={() => setErr(true)} />
      ) : (
        <span className="font-bold text-slate-700">{letter}</span>
      )}
    </div>
  );
}