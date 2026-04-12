"use client";

import Image from "next/image";
import { useEffect } from "react";
import {
  BarChart3,
  Building2,
  Camera,
  CheckCircle2,
  MapPinned,
  Trees,
  X,
} from "lucide-react";

import MetricCard from "@/components/MetricCard";
import AnalyticsPieChart from "@/components/PieChart";
import { getAnalyticsPanelData } from "@/data/analyticsMock";
import type { MapSelection } from "@/types/gis";

interface AnalyticsPanelProps {
  selection: MapSelection | null;
  onClose: () => void;
}

const metricIcons = [MapPinned, Trees, Building2, CheckCircle2];

function formatCoordinates(selection: MapSelection) {
  return `${selection.coordinates.lat.toFixed(5)}, ${selection.coordinates.lng.toFixed(5)}`;
}

function getImageSection(selection: MapSelection) {
  switch (selection.kind) {
    case "forestPillar":
      return {
        src: selection.pillar.image_url,
        title: "Pillar Image",
        caption: "Field photo placeholder. Replace with actual survey imagery later.",
      };
    case "villagePillar":
      return {
        src: selection.pillar.image_url,
        title: "Boundary Pillar Image",
        caption: "Village boundary photo placeholder for future uploads.",
      };
    case "forest":
      return {
        src: null,
        title: "Forest Area Image",
        caption: "Reserved for forest parcel imagery or drone capture.",
      };
    case "village":
      return {
        src: null,
        title: "Village Parcel Image",
        caption: "Reserved for parcel reference image or cadastral snapshot.",
      };
  }
}

export default function AnalyticsPanel({
  selection,
  onClose,
}: AnalyticsPanelProps) {
  const panelData = selection ? getAnalyticsPanelData(selection) : null;
  const imageSection = selection ? getImageSection(selection) : null;
  const selectedFeature = selection;

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
        className={`pointer-events-none absolute inset-y-3 right-3 z-[830] flex w-[calc(100%-1.5rem)] max-w-[390px] justify-end transition-all duration-300 ease-out md:inset-y-5 md:right-5 ${
          selection
            ? "translate-x-0 opacity-100"
            : "translate-x-[calc(100%+1.5rem)] opacity-0"
        }`}
        aria-hidden={!selection}
      >
        <div className="pointer-events-auto flex h-full w-full flex-col overflow-hidden rounded-[28px] border border-white/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98)_0%,_rgba(248,250,252,0.98)_100%)] shadow-[0_30px_80px_-46px_rgba(15,23,42,0.46)] backdrop-blur">
          {panelData ? (
            <>
              <div className="relative overflow-hidden border-b border-slate-200/80 px-4 pb-4 pt-4">
                <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.16),_transparent_44%),radial-gradient(circle_at_top_left,_rgba(34,197,94,0.14),_transparent_34%)]" />
                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-800">
                        <BarChart3 className="h-3.5 w-3.5" />
                        {panelData.entityLabel}
                      </span>
                      <h2 className="mt-3 text-[1.2rem] font-semibold tracking-tight text-slate-950">
                        {panelData.title}
                      </h2>
                      <p className="mt-1 text-sm font-medium text-slate-600">
                        {panelData.subtitle}
                      </p>
                      <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        <MapPinned className="h-3.5 w-3.5 text-slate-500" />
                        <span>Coordinates: {formatCoordinates(selectedFeature!)}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/80 bg-white/95 text-slate-500 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.45)] transition hover:border-slate-200 hover:text-slate-950"
                      aria-label="Close analytics panel"
                    >
                      <X className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {panelData.description}
                  </p>

                  <div className="mt-4 rounded-[22px] border border-slate-200/80 bg-white/88 p-3.5 shadow-[0_18px_40px_-40px_rgba(15,23,42,0.35)]">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                          Survey Completion
                        </p>
                        <p className="mt-1.5 text-[1.6rem] font-semibold tracking-tight text-slate-950">
                          {panelData.completionRate}%
                        </p>
                      </div>
                      <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        On-track review
                      </div>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,_#16a34a_0%,_#0ea5e9_100%)]"
                        style={{ width: `${panelData.completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 pb-4 pt-4">
                <section className="rounded-[22px] border border-slate-200/80 bg-white p-3 shadow-[0_20px_44px_-42px_rgba(15,23,42,0.38)]">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                      <Camera className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                        Image Section
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-950">
                        {imageSection?.title}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 overflow-hidden rounded-[20px] border border-slate-200 bg-slate-50">
                    {imageSection?.src ? (
                      <Image
                        src={imageSection.src}
                        alt={imageSection.title}
                        width={640}
                        height={360}
                        className="h-36 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-36 w-full items-center justify-center bg-[linear-gradient(135deg,_#f8fafc_0%,_#e2e8f0_100%)]">
                        <div className="text-center">
                          <Camera className="mx-auto h-7 w-7 text-slate-400" />
                          <p className="mt-2 text-sm font-medium text-slate-600">
                            Image placeholder
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {imageSection?.caption}
                  </p>
                </section>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                        compact
                      />
                    );
                  })}
                </div>

                <div className="mt-4">
                  <AnalyticsPieChart
                    data={panelData.surveyStatus}
                    eyebrow="Status Mix"
                    title="Verification snapshot"
                    badge="Cluster overview"
                    centerLabel="Status"
                    tooltipSuffix="records"
                  />
                </div>

                <section className="mt-4 rounded-[22px] border border-slate-200/80 bg-white p-3.5 shadow-[0_20px_44px_-42px_rgba(15,23,42,0.38)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Selected Details
                  </p>
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    {[...panelData.focusRows, ...panelData.infoRows].slice(0, 4).map((row) => (
                      <div
                        key={row.label}
                        className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-3 py-2.5"
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                          {row.label}
                        </p>
                        <p className="mt-1.5 text-sm font-semibold leading-6 text-slate-900">
                          {row.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </>
          ) : null}
        </div>
      </aside>
    </>
  );
}
