"use client";

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { PillarsByVillageDatum } from "@/data/analyticsMock";

interface AnalyticsBarChartProps {
  data: PillarsByVillageDatum[];
  eyebrow?: string;
  title?: string;
  badge?: string;
  tooltipLabel?: string;
}

const barPalette = ["#0f766e", "#0ea5e9", "#14b8a6", "#22c55e", "#38bdf8"];

export default function AnalyticsBarChart({
  data,
  eyebrow = "Village Load",
  title = "Pillars per village",
  badge = "Comparative spread",
  tooltipLabel = "mapped pillars in current review cycle",
}: AnalyticsBarChartProps) {
  return (
    <div className="rounded-[26px] border border-slate-200/80 bg-white p-4 shadow-[0_22px_60px_-42px_rgba(15,23,42,0.42)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            {eyebrow}
          </p>
          <h3 className="mt-2 text-base font-semibold tracking-tight text-slate-950">
            {title}
          </h3>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {badge}
        </span>
      </div>

      <div className="mt-4 h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data} margin={{ top: 10, right: 6, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(148,163,184,0.08)" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) {
                  return null;
                }

                const datum = payload[0].payload as PillarsByVillageDatum;

                return (
                  <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-xl">
                    <p className="text-sm font-semibold text-slate-950">{datum.name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {datum.pillars} {tooltipLabel}
                    </p>
                  </div>
                );
              }}
            />
            <Bar dataKey="pillars" radius={[10, 10, 4, 4]} maxBarSize={42}>
              {data.map((entry, index) => (
                <Cell
                  key={`${entry.name}-${entry.pillars}`}
                  fill={barPalette[index % barPalette.length]}
                />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        {data.slice(0, 4).map((item, index) => (
          <div
            key={item.name}
            className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-3 py-3"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: barPalette[index % barPalette.length] }}
              />
              <span className="truncate text-sm font-medium text-slate-700">
                {item.name}
              </span>
            </div>
            <p className="mt-2 text-lg font-semibold text-slate-950">{item.pillars}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
