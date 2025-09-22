// lib/types.ts
export type TaskType = "wallet" | "onchain" | "social" | "technical";

export type Airdrop = {
  id: string;
  title: string;
  project: string;
  chain: string;
  reward: string;
  estValueUSD: number;
  start: string;
  end: string;
  statusOverride?: "active" | "upcoming" | "ended" | null;
  status: "active" | "upcoming" | "ended";
  kyc: boolean;
  regionLocks: string[];
  risk: 1 | 2 | 3 | 4 | 5;
  verified: boolean;
  tags: string[];
  tasks: { label: string; types: TaskType[] }[];
  links: Partial<Record<"website" | "twitter" | "discord" | "docs", string>>;
  createdAt: string;
  trend?: number;
  logoUrl?: string;
};

export type FiltersState = {
  q: string;
  status: string[];
  chains: string[];
  verified: boolean | null;
  kyc: boolean | null;
  riskMax: number;
  valueMin: number;
  sortBy: string;
  page: number;
};

export type Theme = "light" | "dark";