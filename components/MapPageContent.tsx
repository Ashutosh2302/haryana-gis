"use client";

import { useRef, useState } from "react";
import { toBlob as domToBlob } from "html-to-image";
import { Camera } from "lucide-react";
import dynamic from "next/dynamic";

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

export default function MapPageContent() {
  const pageRef = useRef<HTMLElement>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [basemap, setBasemap] = useState<"street" | "satellite">("street");
  const [layers, setLayers] = useState<LayerVisibility>(defaultLayers);
  const [query, setQuery] = useState("");
  const [capturing, setCapturing] = useState(false);
  const [searchMessage, setSearchMessage] = useState(
    "Ready for search. Try `HR-PILLAR-001`, `Kaimbwala`, or `HR-VP-001`.",
  );

  const handleCapture = async () => {
    if (!pageRef.current || capturing) return;
    setCapturing(true);
    try {
      await new Promise((resolve) => {
        window.setTimeout(resolve, 400);
      });

      const captureWidth = pageRef.current.scrollWidth;
      const captureHeight = window.innerHeight;

      const blob = await domToBlob(pageRef.current, {
        backgroundColor: "#e2e8f0",
        pixelRatio: Math.min(window.devicePixelRatio || 2, 2),
        cacheBust: true,
        includeQueryParams: true,
        skipFonts: true,
        width: captureWidth,
        height: captureHeight,
        style: {
          height: `${captureHeight}px`,
          minHeight: `${captureHeight}px`,
          maxHeight: `${captureHeight}px`,
          overflow: "hidden",
        },
        filter: (node: HTMLElement) => {
          if (node?.dataset && "captureIgnore" in node.dataset) return false;
          return true;
        },
      });

      if (!blob) {
        window.alert("Failed to create screenshot.");
        return;
      }

      const objectUrl = URL.createObjectURL(blob);
      const safeTimestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[T:]/g, "-");
      const filename = `haryana-gis-screenshot-${safeTimestamp}.png`;
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      link.rel = "noopener";
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
    } catch (error) {
      window.alert(
        error instanceof Error
          ? `Screenshot failed: ${error.message}`
          : "Screenshot capture failed unexpectedly.",
      );
    } finally {
      setCapturing(false);
    }
  };
  const [focusRequest, setFocusRequest] = useState<{
    type: "forestPillar" | "villagePillar" | "village";
    targetId: string;
    nonce: number;
  } | null>(null);

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

    const villagePillarMatch = villagePillarsCollection.features.find(
      (feature) => {
        const { id, village, survey_no: surveyNo } = feature.properties;
        return (
          id.toLowerCase().includes(normalized) ||
          village.toLowerCase().includes(normalized) ||
          surveyNo.toLowerCase().includes(normalized)
        );
      },
    );

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
    <main ref={pageRef} className="flex min-h-screen bg-slate-200">
      <Sidebar
        collapsed={sidebarCollapsed}
        basemap={basemap}
        layers={layers}
        onToggleCollapse={() => setSidebarCollapsed((current) => !current)}
        onBasemapChange={setBasemap}
        onLayerToggle={handleLayerToggle}
      />

      <section className="min-w-0 flex-1 bg-[linear-gradient(180deg,_#eef4fb_0%,_#f8fafc_48%,_#f1f5f9_100%)] p-3 xl:p-4">
        <div className="relative h-[calc(100vh-1.5rem)] overflow-hidden rounded-[32px] border border-white/60 bg-white shadow-[0_30px_90px_-45px_rgba(15,23,42,0.45)] xl:h-[calc(100vh-2rem)]">
          <div
            data-capture-ignore=""
            className="pointer-events-none absolute left-20 right-3 top-3 z-[900] flex items-start justify-between gap-2 md:left-24 md:top-4"
          >
            <Topbar
              query={query}
              searchMessage={searchMessage}
              onQueryChange={setQuery}
              onSearch={handleSearch}
            />
            <button
              type="button"
              onClick={handleCapture}
              disabled={capturing}
              className="pointer-events-auto inline-flex h-11 shrink-0 items-center gap-2 rounded-2xl border border-white/70 bg-white/92 px-3.5 text-sm font-semibold text-slate-700 shadow-[0_20px_50px_-34px_rgba(15,23,42,0.42)] backdrop-blur transition hover:bg-white hover:text-slate-950 disabled:opacity-60"
              aria-label="Capture current map view"
            >
              <Camera className={`h-4 w-4 ${capturing ? "animate-pulse" : ""}`} />
              <span className="hidden sm:inline">
                {capturing ? "Capturing…" : "Capture"}
              </span>
            </button>
          </div>

          <MapView
            basemap={basemap}
            layers={layers}
            focusRequest={focusRequest}
            onFocusHandled={() => setFocusRequest(null)}
          />
        </div>
      </section>
    </main>
  );
}
