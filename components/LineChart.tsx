"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DashboardProgressDatum } from "@/data/dashboardMock";

interface AnalyticsLineChartProps {
  data: DashboardProgressDatum[];
  eyebrow?: string;
  title?: string;
  badge?: string;
}

export default function AnalyticsLineChart({
  data,
  eyebrow = "Survey Progress",
  title = "Monthly completion trend",
  badge = "Current cycle",
}: AnalyticsLineChartProps) {
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

      <div className="mt-4 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={data} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              domain={[0, 100]}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) {
                  return null;
                }

                const datum = payload[0].payload as DashboardProgressDatum;

                return (
                  <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-xl">
                    <p className="text-sm font-semibold text-slate-950">{label}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Completion: {datum.completed}% • Target: {datum.target}%
                    </p>
                  </div>
                );
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", color: "#475569", paddingTop: "14px" }}
            />
            <Line
              type="monotone"
              dataKey="target"
              name="Target"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="6 6"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="completed"
              name="Completed"
              stroke="#0f766e"
              strokeWidth={3}
              dot={{ r: 4, fill: "#0f766e", stroke: "#ffffff", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#0f766e", stroke: "#ffffff", strokeWidth: 2 }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
