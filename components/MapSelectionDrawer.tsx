"use client";

import AnalyticsPanel from "@/components/AnalyticsPanel";
import type { MapSelection } from "@/types/gis";

interface MapSelectionDrawerProps {
  selection: MapSelection | null;
  onClose: () => void;
}

export default function MapSelectionDrawer({
  selection,
  onClose,
}: MapSelectionDrawerProps) {
  return <AnalyticsPanel selection={selection} onClose={onClose} />;
}
