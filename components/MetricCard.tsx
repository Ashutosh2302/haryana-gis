"use client";

import type { LucideIcon } from "lucide-react";

import type { AnalyticsTone } from "@/data/analyticsMock";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  helper: string;
  tone: AnalyticsTone;
}

const toneClasses: Record<
  AnalyticsTone,
  { iconWrap: string; icon: string; glow: string }
> = {
  emerald: {
    iconWrap: "bg-emerald-50",
    icon: "text-emerald-700",
    glow: "from-emerald-500/12 via-emerald-500/0 to-transparent",
  },
  amber: {
    iconWrap: "bg-amber-50",
    icon: "text-amber-700",
    glow: "from-amber-500/12 via-amber-500/0 to-transparent",
  },
  sky: {
    iconWrap: "bg-sky-50",
    icon: "text-sky-700",
    glow: "from-sky-500/12 via-sky-500/0 to-transparent",
  },
  slate: {
    iconWrap: "bg-slate-100",
    icon: "text-slate-700",
    glow: "from-slate-500/12 via-slate-500/0 to-transparent",
  },
};

export default function MetricCard({
  icon: Icon,
  label,
  value,
  helper,
  tone,
}: MetricCardProps) {
  const palette = toneClasses[tone];

  return (
    <div className="group relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-white px-4 py-4 shadow-[0_22px_50px_-38px_rgba(15,23,42,0.4)] transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_30px_60px_-36px_rgba(15,23,42,0.38)]">
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b ${palette.glow}`}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            {label}
          </p>
          <p className="mt-3 text-[1.7rem] font-semibold tracking-tight text-slate-950">
            {value}
          </p>
          <p className="mt-2 max-w-[18rem] text-xs leading-5 text-slate-500">
            {helper}
          </p>
        </div>
        <span
          className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${palette.iconWrap}`}
        >
          <Icon className={`h-5 w-5 ${palette.icon}`} strokeWidth={2} />
        </span>
      </div>
    </div>
  );
}
