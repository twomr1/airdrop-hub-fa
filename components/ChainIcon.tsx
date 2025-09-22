// components/ChainIcon.tsx
import React from "react";
export default function ChainIcon({ name, className = "w-4 h-4" }: { name: string; className?: string }) {
  const n = name.toLowerCase();
  if (n.includes("ethereum")) return (
    <svg viewBox="0 0 256 417" className={className} aria-hidden="true"><path d="M127.6 0L0 213.1 127.6 297l127.3-83.9L127.6 0z" fill="currentColor"/><path d="M127.6 416.2l127.6-179-127.6 83.9L0 237.2l127.6 179z" fill="currentColor"/></svg>
  );
  if (n.includes("solana")) return (
    <svg viewBox="0 0 398 311" className={className}><path d="M64 0h306L334 52H28L64 0zM0 130h306l-36 52H-36l36-52zM64 259h306l-36 52H28l36-52z" fill="currentColor"/></svg>
  );
  if (n.includes("aptos")) return (
    <svg viewBox="0 0 256 256" className={className}><circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="20" fill="none"/><path d="M56 96h144M40 128h176M56 160h144" stroke="currentColor" strokeWidth="20"/></svg>
  );
  if (n.includes("stark")) return (
    <svg viewBox="0 0 256 256" className={className}><path d="M128 16l80 224-80-48-80 48 80-224z" fill="currentColor"/></svg>
  );
  return <span className={className}>⛓️</span>;
}