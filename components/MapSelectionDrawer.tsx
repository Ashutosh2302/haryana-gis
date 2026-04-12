"use client";

import { X } from "lucide-react";

import ForestPopupCard from "@/components/ForestPopupCard";
import PopupCard from "@/components/PopupCard";
import VillagePillarPopupCard from "@/components/VillagePillarPopupCard";
import VillagePopupCard from "@/components/VillagePopupCard";
import type {
  ForestProperties,
  PillarProperties,
  VillagePillarProperties,
  VillageProperties,
} from "@/types/gis";

export type MapSelection =
  | {
      kind: "forest";
      forest: ForestProperties;
      perimeterKm: number;
      boundaryPillars: number;
    }
  | {
      kind: "village";
      village: VillageProperties;
      perimeterKm: number;
      boundaryPillars: number;
    }
  | {
      kind: "forestPillar";
      pillar: PillarProperties;
    }
  | {
      kind: "villagePillar";
      pillar: VillagePillarProperties;
    };

interface MapSelectionDrawerProps {
  selection: MapSelection | null;
  onClose: () => void;
}

function renderSelectionCard(selection: MapSelection) {
  switch (selection.kind) {
    case "forest":
      return (
        <ForestPopupCard
          forest={selection.forest}
          perimeterKm={selection.perimeterKm}
          boundaryPillars={selection.boundaryPillars}
        />
      );
    case "village":
      return (
        <VillagePopupCard
          village={selection.village}
          perimeterKm={selection.perimeterKm}
          boundaryPillars={selection.boundaryPillars}
        />
      );
    case "forestPillar":
      return <PopupCard pillar={selection.pillar} />;
    case "villagePillar":
      return <VillagePillarPopupCard pillar={selection.pillar} />;
  }
}

export default function MapSelectionDrawer({
  selection,
  onClose,
}: MapSelectionDrawerProps) {
  if (!selection) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-x-3 bottom-3 z-[800] md:inset-x-auto md:bottom-4 md:right-4 md:top-4 md:w-[360px]">
      <div className="pointer-events-auto relative flex max-h-full flex-col">
        <div className="absolute right-4 top-4 z-10">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/96 text-slate-500 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)] backdrop-blur transition hover:border-slate-200 hover:text-slate-900"
            aria-label="Close details panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto p-1 md:p-0">{renderSelectionCard(selection)}</div>
      </div>
    </div>
  );
}
