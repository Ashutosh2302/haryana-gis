"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  BarChart3,
  CheckCircle2,
  Clock3,
  FileSearch,
  ShieldAlert,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import {
  pillarsCollection,
  villagePillarsCollection,
  villagesCollection,
} from "@/data/mockData";
import type { LayerVisibility } from "@/types/gis";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[520px] items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.08),_transparent_38%),linear-gradient(180deg,_#f8fafc_0%,_#e2e8f0_100%)]">
      <div className="w-full max-w-lg rounded-[28px] border border-white/70 bg-white/80 p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)] backdrop-blur">
        <div className="h-4 w-40 animate-pulse rounded-full bg-slate-200" />
        <div className="mt-5 h-64 animate-pulse rounded-[24px] bg-slate-200/80" />
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="h-14 animate-pulse rounded-2xl bg-slate-200/80" />
          <div className="h-14 animate-pulse rounded-2xl bg-slate-200/80" />
          <div className="h-14 animate-pulse rounded-2xl bg-slate-200/80" />
        </div>
      </div>
    </div>
  ),
});

const defaultLayers: LayerVisibility = {
  forest: true,
  villages: true,
  pillars: true,
  villagePillars: true,
  admin: true,
};

export default function Home() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [basemap, setBasemap] = useState<"street" | "satellite">("street");
  const [layers, setLayers] = useState<LayerVisibility>(defaultLayers);
  const [query, setQuery] = useState("");
  const [searchMessage, setSearchMessage] = useState(
    "Ready for search. Try `HR-PILLAR-001`, `Kaimbwala`, or `HR-VP-001`.",
  );
  const [focusRequest, setFocusRequest] = useState<{
    type: "forestPillar" | "villagePillar" | "village";
    targetId: string;
    nonce: number;
  } | null>(null);

  const statusMetrics = useMemo(() => {
    return [...pillarsCollection.features, ...villagePillarsCollection.features].reduce(
      (accumulator, feature) => {
        accumulator[feature.properties.status] += 1;
        return accumulator;
      },
      {
        Verified: 0,
        Pending: 0,
        Disputed: 0,
      },
    );
  }, []);

  const handleLayerToggle = (layer: keyof LayerVisibility) => {
    setLayers((current) => ({
      ...current,
      [layer]: !current[layer],
    }));
  };

  const handleSearch = () => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      setSearchMessage(
        "Enter a village land name, pillar ID, or survey number to locate a feature.",
      );
      return;
    }

    const villageMatch = villagesCollection.features.find((feature) => {
      const { id, name } = feature.properties;
      return (
        id.toLowerCase().includes(normalized) ||
        name.toLowerCase().includes(normalized)
      );
    });

    if (villageMatch) {
      setLayers((current) => ({
        ...current,
        villages: true,
      }));

      setFocusRequest({
        type: "village",
        targetId: villageMatch.properties.id,
        nonce: Date.now(),
      });
      setSearchMessage(
        `Zoomed to ${villageMatch.properties.name} • ${villageMatch.properties.tehsil}, ${villageMatch.properties.district}.`,
      );
      return;
    }

    const villagePillarMatch = villagePillarsCollection.features.find((feature) => {
      const { id, village, survey_no: surveyNo } = feature.properties;
      return (
        id.toLowerCase().includes(normalized) ||
        village.toLowerCase().includes(normalized) ||
        surveyNo.toLowerCase().includes(normalized)
      );
    });

    if (villagePillarMatch) {
      setLayers((current) => ({
        ...current,
        villagePillars: true,
      }));

      setFocusRequest({
        type: "villagePillar",
        targetId: villagePillarMatch.properties.id,
        nonce: Date.now(),
      });
      setSearchMessage(
        `Zoomed to ${villagePillarMatch.properties.id} • ${villagePillarMatch.properties.village}, ${villagePillarMatch.properties.district}.`,
      );
      return;
    }

    const match = pillarsCollection.features.find((feature) => {
      const { id, village, survey_no: surveyNo } = feature.properties;
      return (
        id.toLowerCase().includes(normalized) ||
        village.toLowerCase().includes(normalized) ||
        surveyNo.toLowerCase().includes(normalized)
      );
    });

    if (!match) {
      setSearchMessage(
        `No feature matched "${query}". Try HR-PILLAR-001, Kaimbwala, or HR-VP-001.`,
      );
      return;
    }

    setLayers((current) => ({
      ...current,
      pillars: true,
    }));

    setFocusRequest({
      type: "forestPillar",
      targetId: match.properties.id,
      nonce: Date.now(),
    });
    setSearchMessage(
      `Zoomed to ${match.properties.id} • ${match.properties.village}, ${match.properties.district}.`,
    );
  };

  return (
    <main className="flex min-h-screen bg-slate-200">
      <Sidebar
        collapsed={sidebarCollapsed}
        basemap={basemap}
        layers={layers}
        onToggleCollapse={() => setSidebarCollapsed((current) => !current)}
        onBasemapChange={setBasemap}
        onLayerToggle={handleLayerToggle}
      />

      <section className="flex min-w-0 flex-1 flex-col bg-[linear-gradient(180deg,_#eef4fb_0%,_#f8fafc_48%,_#f1f5f9_100%)] p-4 xl:p-5">
        <Topbar
          query={query}
          searchMessage={searchMessage}
          onQueryChange={setQuery}
          onSearch={handleSearch}
        />

        <div className="mt-4 grid min-h-0 flex-1 gap-4 2xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-h-[640px] overflow-hidden rounded-[32px] border border-white/60 bg-white shadow-[0_30px_90px_-45px_rgba(15,23,42,0.45)]">
            <MapView
              basemap={basemap}
              layers={layers}
              focusRequest={focusRequest}
              onFocusHandled={() => setFocusRequest(null)}
            />
          </div>

          <aside className="grid gap-4 xl:grid-cols-3 2xl:grid-cols-1">
            <section className="rounded-[28px] border border-white/70 bg-white/95 p-6 shadow-[0_20px_60px_-36px_rgba(15,23,42,0.35)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Core Analytics
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-950">
                    Survey Progress
                  </h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                  <BarChart3 className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                <div className="rounded-3xl bg-slate-950 px-5 py-4 text-white">
                  <p className="text-sm text-slate-300">Total Forest Area</p>
                  <p className="mt-2 text-3xl font-semibold">12,540 ha</p>
                </div>
                <div className="rounded-3xl bg-slate-50 px-5 py-4">
                  <p className="text-sm text-slate-500">Total Pillars</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950">
                    1,240
                  </p>
                </div>
                <div className="rounded-3xl bg-emerald-50 px-5 py-4">
                  <p className="text-sm text-emerald-700">Survey Completion</p>
                  <p className="mt-2 text-3xl font-semibold text-emerald-950">
                    78%
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-white/70 bg-white/95 p-6 shadow-[0_20px_60px_-36px_rgba(15,23,42,0.35)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Mock Survey Snapshot
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-950">
                    Pillar Status Mix
                  </h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <FileSearch className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                    <span className="font-medium text-emerald-950">Verified</span>
                  </div>
                  <span className="text-lg font-semibold text-emerald-950">
                    {statusMetrics.Verified}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-amber-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Clock3 className="h-5 w-5 text-amber-700" />
                    <span className="font-medium text-amber-950">Pending</span>
                  </div>
                  <span className="text-lg font-semibold text-amber-950">
                    {statusMetrics.Pending}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-rose-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="h-5 w-5 text-rose-700" />
                    <span className="font-medium text-rose-950">Disputed</span>
                  </div>
                  <span className="text-lg font-semibold text-rose-950">
                    {statusMetrics.Disputed}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-white/70 bg-slate-950 p-6 text-slate-100 shadow-[0_20px_60px_-36px_rgba(15,23,42,0.55)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Operational Notes
              </p>
              <h2 className="mt-2 text-xl font-semibold text-white">
                Demo Highlights
              </h2>

              <div className="mt-6 space-y-4 text-sm leading-6 text-slate-300">
                <p>
                  Layer toggles provide quick operational control across
                  basemaps, forest polygons, demarcation pillars, and district
                  boundaries.
                </p>
                <p>
                  Search recenters the map and opens a premium inspection card
                  for the selected survey pillar.
                </p>
                <p>
                  Draw tools support field review workflows for distance and area
                  measurement directly on the map canvas.
                </p>
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
