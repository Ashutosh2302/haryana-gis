import { Gauge, LandPlot, Map, Trees } from "lucide-react";

import type { ForestProperties } from "@/types/gis";

interface ForestPopupCardProps {
  forest: ForestProperties;
  perimeterKm: number;
  boundaryPillars: number;
}

export default function ForestPopupCard({
  forest,
  perimeterKm,
  boundaryPillars,
}: ForestPopupCardProps) {
  return (
    <div className="w-[300px] overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_24px_60px_-28px_rgba(15,23,42,0.45)]">
      <div className="border-b border-slate-200 bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 px-5 py-4 text-white">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-200">
          Forest Boundary
        </p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight">
          {forest.name}
        </h3>
        <p className="mt-2 text-sm text-emerald-100/90">
          Boundary parcel under active forest survey and demarcation review.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 p-5 text-sm text-slate-600">
        <div className="rounded-2xl bg-slate-50 px-3 py-3">
          <div className="mb-1 flex items-center gap-2 text-slate-500">
            <Trees className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Division
            </span>
          </div>
          <p className="font-semibold text-slate-900">{forest.division}</p>
        </div>

        <div className="rounded-2xl bg-slate-50 px-3 py-3">
          <div className="mb-1 flex items-center gap-2 text-slate-500">
            <LandPlot className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Area
            </span>
          </div>
          <p className="font-semibold text-slate-900">
            {forest.area_ha.toLocaleString("en-IN")} ha
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 px-3 py-3">
          <div className="mb-1 flex items-center gap-2 text-slate-500">
            <Map className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Perimeter
            </span>
          </div>
          <p className="font-semibold text-slate-900">
            {perimeterKm.toFixed(2)} km
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 px-3 py-3">
          <div className="mb-1 flex items-center gap-2 text-slate-500">
            <Gauge className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Boundary Pillars
            </span>
          </div>
          <p className="font-semibold text-slate-900">{boundaryPillars}</p>
        </div>
      </div>
    </div>
  );
}
