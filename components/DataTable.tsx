"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { DistrictTableRow } from "@/data/dashboardMock";

interface DataTableProps {
  rows: DistrictTableRow[];
}

function formatNumber(value: number) {
  return value.toLocaleString("en-IN");
}

export default function DataTable({ rows }: DataTableProps) {
  return (
    <div className="rounded-[30px] border border-slate-200/80 bg-white p-4 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.42)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            District Breakdown
          </p>
          <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-950">
            District-wise forest settlement monitoring
          </h3>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          Live review snapshot
        </span>
      </div>

      <div className="mt-5 overflow-hidden rounded-[24px] border border-slate-200/80">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-slate-50/90">
              <tr className="text-left">
                <th className="px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  District
                </th>
                <th className="px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Forest Area
                </th>
                <th className="px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Total Pillars
                </th>
                <th className="px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Verified
                </th>
                <th className="px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Pending
                </th>
                <th className="px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.district}
                  className="border-t border-slate-200/80 transition hover:bg-slate-50/70"
                >
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-semibold text-slate-950">{row.district}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        Progress {Math.round((row.verified / row.totalPillars) * 100)}%
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-slate-700">
                    {formatNumber(row.forestAreaHa)} ha
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-slate-950">
                    {formatNumber(row.totalPillars)}
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                      {formatNumber(row.verified)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
                      {formatNumber(row.pending)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href="/map"
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                    >
                      Open Map
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
