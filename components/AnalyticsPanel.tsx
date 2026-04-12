"use client";

import { useEffect } from "react";
import {
  BarChart3,
  Building2,
  CheckCircle2,
  Clock3,
  MapPinned,
  Trees,
  X,
} from "lucide-react";

import AnalyticsBarChart from "@/components/BarChart";
import MetricCard from "@/components/MetricCard";
import AnalyticsPieChart from "@/components/PieChart";
import { getAnalyticsPanelData } from "@/data/analyticsMock";
import type { MapSelection } from "@/types/gis";

interface AnalyticsPanelProps {
  selection: MapSelection | null;
  onClose: () => void;
}

const metricIcons = [MapPinned, Trees, Building2, CheckCircle2];

export default function AnalyticsPanel({
  selection,
  onClose,
}: AnalyticsPanelProps) {
  const panelData = selection ? getAnalyticsPanelData(selection) : null;

  useEffect(() => {
    if (!selection) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, selection]);

  const timelineMax = panelData
    ? Math.max(...panelData.timeline.map((item) => item.completed), 1)
    : 1;

  return (
    <>
      <div
        className={`absolute inset-0 z-[820] bg-slate-950/22 backdrop-blur-[2px] transition-opacity duration-300 md:hidden ${
          selection ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden={!selection}
      />

      <aside
        className={`pointer-events-none absolute inset-y-3 right-3 z-[830] flex w-[calc(100%-1.5rem)] max-w-[440px] justify-end transition-all duration-300 ease-out md:inset-y-4 md:right-4 ${
          selection
            ? "translate-x-0 opacity-100"
            : "translate-x-[calc(100%+1.5rem)] opacity-0"
        }`}
        aria-hidden={!selection}
      >
        <div className="pointer-events-auto flex h-full w-full flex-col overflow-hidden rounded-[30px] border border-white/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98)_0%,_rgba(248,250,252,0.98)_100%)] shadow-[0_35px_90px_-46px_rgba(15,23,42,0.5)] backdrop-blur">
          {panelData ? (
            <>
              <div className="relative overflow-hidden border-b border-slate-200/80 px-5 pb-5 pt-5">
                <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.16),_transparent_44%),radial-gradient(circle_at_top_left,_rgba(34,197,94,0.14),_transparent_34%)]" />
                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-800">
                        <BarChart3 className="h-3.5 w-3.5" />
                        {panelData.entityLabel}
                      </span>
                      <h2 className="mt-4 text-[1.65rem] font-semibold tracking-tight text-slate-950">
                        {panelData.title}
                      </h2>
                      <p className="mt-1 text-sm font-medium text-slate-600">
                        {panelData.subtitle}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/95 text-slate-500 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.45)] transition hover:border-slate-200 hover:text-slate-950"
                      aria-label="Close analytics panel"
                    >
                      <X className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {panelData.description}
                  </p>

                  <div className="mt-5 rounded-[24px] border border-slate-200/80 bg-white/88 p-4 shadow-[0_20px_45px_-40px_rgba(15,23,42,0.35)]">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                          Survey Completion
                        </p>
                        <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                          {panelData.completionRate}%
                        </p>
                      </div>
                      <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                        On-track review
                      </div>
                    </div>
                    <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,_#16a34a_0%,_#0ea5e9_100%)]"
                        style={{ width: `${panelData.completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-5 pb-5 pt-5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {panelData.metrics.map((metric, index) => {
                    const Icon = metricIcons[index];

                    return (
                      <MetricCard
                        key={metric.label}
                        icon={Icon}
                        label={metric.label}
                        value={metric.value}
                        helper={metric.helper}
                        tone={metric.tone}
                      />
                    );
                  })}
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-1">
                  <AnalyticsPieChart data={panelData.surveyStatus} />
                  <AnalyticsBarChart data={panelData.pillarsByVillage} />
                </div>

                <div className="mt-5 rounded-[26px] border border-slate-200/80 bg-white p-4 shadow-[0_22px_60px_-42px_rgba(15,23,42,0.42)]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                        Survey Timeline
                      </p>
                      <h3 className="mt-2 text-base font-semibold tracking-tight text-slate-950">
                        Monthly verification progress
                      </h3>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      <Clock3 className="h-3.5 w-3.5" />
                      Current cycle
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-4 gap-3">
                    {panelData.timeline.map((item) => {
                      const height = Math.max(
                        Math.round((item.completed / timelineMax) * 100),
                        18,
                      );

                      return (
                        <div key={item.month} className="text-center">
                          <div className="flex h-36 items-end justify-center rounded-[20px] bg-slate-50 px-3 py-3">
                            <div className="w-full">
                              <div
                                className="mx-auto w-full rounded-[14px] bg-[linear-gradient(180deg,_#38bdf8_0%,_#16a34a_100%)] shadow-[0_16px_32px_-18px_rgba(14,165,233,0.6)]"
                                style={{ height: `${height}%` }}
                              />
                            </div>
                          </div>
                          <p className="mt-3 text-sm font-semibold text-slate-800">
                            {item.completed}
                          </p>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                            {item.month}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
                  <section className="rounded-[26px] border border-slate-200/80 bg-white p-4 shadow-[0_22px_60px_-42px_rgba(15,23,42,0.42)]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Selected Feature
                    </p>
                    <h3 className="mt-2 text-base font-semibold tracking-tight text-slate-950">
                      Context and field details
                    </h3>
                    <div className="mt-4 space-y-3">
                      {panelData.focusRows.map((row) => (
                        <div
                          key={row.label}
                          className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-3 py-3"
                        >
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                            {row.label}
                          </p>
                          <p className="mt-2 text-sm font-semibold leading-6 text-slate-900">
                            {row.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-[26px] border border-slate-200/80 bg-white p-4 shadow-[0_22px_60px_-42px_rgba(15,23,42,0.42)]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Additional Info
                    </p>
                    <h3 className="mt-2 text-base font-semibold tracking-tight text-slate-950">
                      Operational notes
                    </h3>
                    <div className="mt-4 space-y-3">
                      {panelData.infoRows.map((row) => (
                        <div
                          key={row.label}
                          className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-3 py-3"
                        >
                          <p className="text-sm font-medium text-slate-600">
                            {row.label}
                          </p>
                          <p className="max-w-[11rem] text-right text-sm font-semibold text-slate-900">
                            {row.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </aside>
    </>
  );
}
