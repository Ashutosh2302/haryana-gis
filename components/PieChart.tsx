"use client";

import {
  Cell,
  Label,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { SurveyStatusDatum } from "@/data/analyticsMock";

interface AnalyticsPieChartProps {
  data: SurveyStatusDatum[];
  eyebrow?: string;
  title?: string;
  badge?: string;
  centerLabel?: string;
  tooltipSuffix?: string;
}

export default function AnalyticsPieChart({
  data,
  eyebrow = "Survey Status",
  title = "Verification distribution",
  badge,
  centerLabel = "Total",
  tooltipSuffix = "pillars",
}: AnalyticsPieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

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
          {badge ?? `${total} ${tooltipSuffix}`}
        </span>
      </div>

      <div className="mt-3 h-[max(9rem,min(13.75rem,28dvh))] md:mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={62}
              outerRadius={84}
              paddingAngle={3}
              stroke="#ffffff"
              strokeWidth={4}
            >
              <Label
                position="center"
                content={() => (
                  <text x="50%" y="47%" textAnchor="middle" dominantBaseline="middle">
                    <tspan
                      x="50%"
                      dy="-0.1em"
                      className="fill-slate-950 text-[28px] font-semibold"
                    >
                      {total}
                    </tspan>
                    <tspan
                      x="50%"
                      dy="1.6em"
                      className="fill-slate-500 text-[11px] uppercase tracking-[0.22em]"
                    >
                      {centerLabel}
                    </tspan>
                  </text>
                )}
              />
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              cursor={false}
              content={({ active, payload }) => {
                if (!active || !payload?.length) {
                  return null;
                }

                const datum = payload[0].payload as SurveyStatusDatum;
                const share = total ? Math.round((datum.value / total) * 100) : 0;

                return (
                  <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-xl">
                    <p className="text-sm font-semibold text-slate-950">{datum.name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {datum.value} {tooltipSuffix} • {share}% share
                    </p>
                  </div>
                );
              }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {data.map((item) => {
          const share = total ? Math.round((item.value / total) * 100) : 0;

          return (
            <div
              key={item.name}
              className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-3 py-3"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium text-slate-700">{item.name}</span>
              </div>
              <div className="mt-2 flex items-end justify-between gap-3">
                <span className="text-lg font-semibold text-slate-950">
                  {item.value}
                </span>
                <span className="text-xs font-medium text-slate-500">{share}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
