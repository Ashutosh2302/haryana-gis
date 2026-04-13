"use client";

import {
  Check,
  ChevronLeft,
  ChevronRight,
  LandPlot,
  Layers3,
  Map,
  MapPinned,
  Satellite,
  Trees,
} from "lucide-react";

import type { BasemapId, LayerVisibility, SurveyLayerId } from "@/types/gis";

interface SidebarProps {
  collapsed: boolean;
  basemap: BasemapId;
  layers: LayerVisibility;
  onToggleCollapse: () => void;
  onBasemapChange: (basemap: BasemapId) => void;
  onLayerToggle: (layer: SurveyLayerId) => void;
}

const basemapOptions: {
  id: BasemapId;
  label: string;
  caption: string;
  icon: typeof Map;
}[] = [
  {
    id: "street",
    label: "Street Map",
    caption: "OpenStreetMap base",
    icon: Map,
  },
  {
    id: "satellite",
    label: "Satellite Map",
    caption: "ESRI imagery base",
    icon: Satellite,
  },
];

const surveyLayers: {
  id: SurveyLayerId;
  label: string;
  caption: string;
  icon: typeof Trees;
}[] = [
  {
    id: "forest",
    label: "Forest Boundary",
    caption: "Survey polygons",
    icon: Trees,
  },
  {
    id: "pillars",
    label: "Pillar Points",
    caption: "Demarcation markers",
    icon: MapPinned,
  },
  {
    id: "villages",
    label: "Village Lands",
    caption: "Revenue parcels",
    icon: LandPlot,
  },
  {
    id: "villagePillars",
    label: "Village Boundary Pillars",
    caption: "Parcel corner markers",
    icon: MapPinned,
  },
  {
    id: "admin",
    label: "Administrative Boundary",
    caption: "District reference extent",
    icon: Layers3,
  },
];

function SectionLabel({
  collapsed,
  title,
}: {
  collapsed: boolean;
  title: string;
}) {
  if (collapsed) {
    return null;
  }

  return (
    <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
      {title}
    </p>
  );
}

export default function Sidebar({
  collapsed,
  basemap,
  layers,
  onToggleCollapse,
  onBasemapChange,
  onLayerToggle,
}: SidebarProps) {
  return (
    <aside
      className={`sticky top-0 flex h-dvh max-h-dvh min-h-0 shrink-0 flex-col border-r border-slate-800 bg-slate-950 px-3 py-3 text-slate-100 transition-all duration-300 md:py-4 ${
        collapsed ? "w-[92px]" : "w-[320px]"
      }`}
    >
      <div className="mb-4 flex shrink-0 items-center justify-between gap-2 px-2 md:mb-5 md:gap-3 [@media(max-height:700px)]:mb-3">
        <div className={`min-w-0 ${collapsed ? "hidden" : "block"}`}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-400 md:text-xs">
            Haryana GIS
          </p>
          <h2 className="mt-0.5 text-base font-semibold text-white md:mt-1 md:text-lg [@media(max-height:700px)]:text-[0.95rem]">
            Operational Layers
          </h2>
        </div>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white md:h-11 md:w-11"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-y-contain pb-3 md:space-y-5 md:pb-4 [@media(max-height:700px)]:space-y-3">
        <div className="space-y-2 md:space-y-3">
          <SectionLabel collapsed={collapsed} title="Basemaps" />
          <div className="space-y-2">
            {basemapOptions.map((option) => {
              const Icon = option.icon;
              const active = basemap === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onBasemapChange(option.id)}
                  className={`group flex w-full items-center gap-2 rounded-2xl border px-3 py-2.5 text-left transition md:gap-3 md:py-3 [@media(max-height:700px)]:py-2 [@media(max-height:700px)]:px-2.5 ${
                    active
                      ? "border-emerald-500/40 bg-emerald-500/10 text-white shadow-[inset_0_0_0_1px_rgba(16,185,129,0.15)]"
                      : "border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900 hover:text-white"
                  }`}
                  title={collapsed ? option.label : undefined}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl md:h-11 md:w-11 [@media(max-height:700px)]:h-9 [@media(max-height:700px)]:w-9 ${
                      active
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-slate-800 text-slate-300 group-hover:bg-slate-700"
                    }`}
                  >
                    <Icon className="h-[1.15rem] w-[1.15rem] md:h-5 md:w-5" />
                  </div>
                  {!collapsed && (
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold md:text-base">
                        {option.label}
                      </p>
                      <p className="truncate text-xs text-slate-400 md:text-sm">
                        {option.caption}
                      </p>
                    </div>
                  )}
                  <span
                    className={`ml-auto inline-flex h-6 w-6 shrink-0 self-center items-center justify-center rounded-md border transition ${
                      active
                        ? "border-emerald-300 bg-emerald-300 text-slate-950"
                        : "border-slate-600 bg-slate-900 text-transparent"
                    }`}
                    aria-hidden="true"
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2 md:space-y-3">
          <SectionLabel collapsed={collapsed} title="Survey Layers" />
          <div className="space-y-2">
            {surveyLayers.map((layer) => {
              const Icon = layer.icon;
              const active = layers[layer.id];

              return (
                <button
                  key={layer.id}
                  type="button"
                  onClick={() => onLayerToggle(layer.id)}
                  className={`group flex w-full items-center gap-2 rounded-2xl border px-3 py-2.5 text-left transition md:gap-3 md:py-3 [@media(max-height:700px)]:py-2 [@media(max-height:700px)]:px-2.5 ${
                    active
                      ? "border-sky-400/35 bg-sky-400/10 text-white"
                      : "border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-700 hover:bg-slate-900 hover:text-white"
                  }`}
                  title={collapsed ? layer.label : undefined}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl md:h-11 md:w-11 [@media(max-height:700px)]:h-9 [@media(max-height:700px)]:w-9 ${
                      active
                        ? "bg-sky-400/15 text-sky-300"
                        : "bg-slate-800 text-slate-300 group-hover:bg-slate-700"
                    }`}
                  >
                    <Icon className="h-[1.15rem] w-[1.15rem] md:h-5 md:w-5" />
                  </div>
                  {!collapsed && (
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 md:gap-3">
                        <p className="truncate text-sm font-semibold md:text-base">
                          {layer.label}
                        </p>
                        <span
                          className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                            active
                              ? "bg-sky-300/15 text-sky-200"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {active ? "Visible" : "Hidden"}
                        </span>
                      </div>
                      <p className="truncate text-xs text-slate-400 md:text-sm">
                        {layer.caption}
                      </p>
                    </div>
                  )}
                  <span
                    className={`ml-auto inline-flex h-6 w-6 shrink-0 self-center items-center justify-center rounded-md border transition ${
                      active
                        ? "border-sky-300 bg-sky-300 text-slate-950"
                        : "border-slate-600 bg-slate-900 text-transparent"
                    }`}
                    aria-hidden="true"
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
