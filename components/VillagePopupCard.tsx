import { BadgeCheck, LandPlot, Map, MapPinned } from "lucide-react";

import type { VillageProperties } from "@/types/gis";

interface VillagePopupCardProps {
  village: VillageProperties;
  perimeterKm: number;
  boundaryPillars: number;
}

export default function VillagePopupCard({
  village,
  perimeterKm,
  boundaryPillars,
}: VillagePopupCardProps) {
  return (
    <div className="w-[300px] overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_24px_60px_-28px_rgba(15,23,42,0.45)]">
      <div className="border-b border-slate-200 bg-gradient-to-r from-amber-950 via-amber-800 to-slate-900 px-5 py-4 text-white">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-200">
          Village Land Parcel
        </p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight">
          {village.name}
        </h3>
        <p className="mt-2 text-sm text-amber-100/90">
          Revenue village land parcel falling within notified forest extent.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 p-5 text-sm text-slate-600">
        <div className="rounded-2xl bg-slate-50 px-3 py-3">
          <div className="mb-1 flex items-center gap-2 text-slate-500">
            <MapPinned className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Tehsil
            </span>
          </div>
          <p className="font-semibold text-slate-900">{village.tehsil}</p>
        </div>

        <div className="rounded-2xl bg-slate-50 px-3 py-3">
          <div className="mb-1 flex items-center gap-2 text-slate-500">
            <LandPlot className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Area
            </span>
          </div>
          <p className="font-semibold text-slate-900">
            {village.area_ha.toLocaleString("en-IN")} ha
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
            <BadgeCheck className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Boundary Pillars
            </span>
          </div>
          <p className="font-semibold text-slate-900">{boundaryPillars}</p>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-600">
        <span className="font-medium text-slate-900">Settlement Stage:</span>{" "}
        {village.settlement_stage}
      </div>
    </div>
  );
}
