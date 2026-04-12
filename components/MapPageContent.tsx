"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toBlob as domToBlob } from "html-to-image";
import { jsPDF } from "jspdf";
import { Camera, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

import CaptureModal from "@/components/CaptureModal";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { getAnalyticsPanelData } from "@/data/analyticsMock";
import {
  pillarsCollection,
  villagePillarsCollection,
  villagesCollection,
} from "@/data/mockData";
import type { LayerVisibility, MapSelection, SurveyLayerId } from "@/types/gis";

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

const layerLabels: Record<SurveyLayerId, string> = {
  forest: "Forest Boundary",
  pillars: "Pillar Points",
  villages: "Village Lands",
  villagePillars: "Village Boundary Pillars",
  admin: "Administrative Boundary",
};

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function buildPdf(
  imageDataUrl: string,
  imageAspect: number,
  basemap: "street" | "satellite",
  layers: LayerVisibility,
  selection: MapSelection | null,
  notes: string,
  capturedAt: Date,
) {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 14;
  const contentW = pageW - margin * 2;
  const timestamp = capturedAt.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  let y = margin;

  // --- Header (minimal) ---
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(15, 23, 42);
  pdf.text("Haryana Forest Survey & Demarcation", margin, y + 4);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(100, 116, 139);
  pdf.text("GIS map export", margin, y + 9);
  pdf.setFontSize(7.5);
  pdf.text(`Captured ${timestamp}`, pageW - margin, y + 6, { align: "right" });
  y += 16;

  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(0.35);
  pdf.line(margin, y, pageW - margin, y);
  y += 8;

  // --- Map hero: fixed frame, image scaled to fit (contain) + centered ---
  const mapFrameH = 118;
  const mapFrameX = margin;
  const mapFrameY = y;
  const mapFrameW = contentW;

  pdf.setFillColor(241, 245, 249);
  pdf.setDrawColor(226, 232, 240);
  pdf.roundedRect(mapFrameX, mapFrameY, mapFrameW, mapFrameH, 2, 2, "FD");

  let drawW = mapFrameW - 2;
  let drawH = drawW / imageAspect;
  if (drawH > mapFrameH - 2) {
    drawH = mapFrameH - 2;
    drawW = drawH * imageAspect;
  }
  const imgDrawX = mapFrameX + (mapFrameW - drawW) / 2;
  const imgDrawY = mapFrameY + (mapFrameH - drawH) / 2;
  pdf.addImage(imageDataUrl, "PNG", imgDrawX, imgDrawY, drawW, drawH);

  y = mapFrameY + mapFrameH + 10;

  // --- Export summary (full width, compact) ---
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.setTextColor(71, 85, 105);
  pdf.text("Export summary", margin, y);
  y += 6;

  const labelCol = margin;
  const valueX = margin + 38;
  const valueW = contentW - (valueX - margin);

  const row = (label: string, value: string, valueFontSize = 8.5) => {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7);
    pdf.setTextColor(148, 163, 184);
    pdf.text(label.toUpperCase(), labelCol, y);
    pdf.setFontSize(valueFontSize);
    pdf.setTextColor(30, 41, 59);
    const lines = pdf.splitTextToSize(value, valueW);
    pdf.text(lines, valueX, y);
    y += Math.max(lines.length * 4.2, 5.5);
  };

  row(
    "Basemap",
    basemap === "street"
      ? "Street Map (OpenStreetMap)"
      : "Satellite (Esri World Imagery)",
  );

  const activeLayerNames = (Object.keys(layers) as SurveyLayerId[]).filter(
    (id) => layers[id],
  );
  row(
    "Active layers",
    activeLayerNames.length
      ? activeLayerNames.map((id) => layerLabels[id]).join(" · ")
      : "None",
    8,
  );

  if (selection) {
    const panelData = getAnalyticsPanelData(selection);
    y += 2;
    pdf.setDrawColor(226, 232, 240);
    pdf.line(margin, y, pageW - margin, y);
    y += 5;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(71, 85, 105);
    pdf.text("Selected feature", margin, y);
    y += 5;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7);
    pdf.setTextColor(14, 165, 233);
    pdf.text(panelData.entityLabel, margin, y);
    y += 4.5;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.setTextColor(15, 23, 42);
    const titleLines = pdf.splitTextToSize(panelData.title, contentW);
    pdf.text(titleLines, margin, y);
    y += titleLines.length * 4.8 + 1;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.5);
    pdf.setTextColor(71, 85, 105);
    pdf.text(panelData.subtitle, margin, y);
    y += 5;

    const coords = `${selection.coordinates.lat.toFixed(5)}, ${selection.coordinates.lng.toFixed(5)}`;
    pdf.setFontSize(7.5);
    pdf.setTextColor(100, 116, 139);
    pdf.text(coords, margin, y);
    y += 6;

    const detailRows = [...panelData.focusRows, ...panelData.infoRows].slice(
      0,
      8,
    );
    for (const r of detailRows) {
      if (y > pageH - margin - 8) break;
      row(r.label, r.value, 8);
    }
  }

  if (notes) {
    y += 3;
    pdf.setDrawColor(226, 232, 240);
    pdf.line(margin, y, pageW - margin, y);
    y += 6;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(71, 85, 105);
    pdf.text("Notes", margin, y);
    y += 5;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.5);
    pdf.setTextColor(51, 65, 85);
    const noteLines = pdf.splitTextToSize(notes, contentW);
    const room = pageH - margin - y;
    const maxLines = Math.max(1, Math.floor(room / 4.2));
    pdf.text(noteLines.slice(0, maxLines), margin, y);
  }

  return pdf;
}

export default function MapPageContent() {
  const pageRef = useRef<HTMLElement>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [basemap, setBasemap] = useState<"street" | "satellite">("street");
  const [layers, setLayers] = useState<LayerVisibility>(defaultLayers);
  const [query, setQuery] = useState("");
  const [capturing, setCapturing] = useState(false);
  const [expandLegendForCapture, setExpandLegendForCapture] = useState(false);
  const [showCaptureModal, setShowCaptureModal] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<MapSelection | null>(
    null,
  );
  const selectionRef = useRef<MapSelection | null>(null);

  useEffect(() => {
    selectionRef.current = currentSelection;
  }, [currentSelection]);

  const [searchMessage, setSearchMessage] = useState(
    "Ready for search. Try `HR-PILLAR-001`, `Kaimbwala`, or `HR-VP-001`.",
  );
  const [focusRequest, setFocusRequest] = useState<{
    type: "forestPillar" | "villagePillar" | "village";
    targetId: string;
    nonce: number;
  } | null>(null);

  const handleSelectionChange = useCallback(
    (selection: MapSelection | null) => {
      setCurrentSelection(selection);
    },
    [],
  );

  const handleCaptureConfirm = async (notes: string) => {
    setShowCaptureModal(false);
    if (!pageRef.current) return;

    setCapturing(true);
    setExpandLegendForCapture(true);
    try {
      await new Promise((resolve) => {
        window.setTimeout(resolve, 500);
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
        window.alert("Failed to capture the map view.");
        return;
      }

      const imageDataUrl = await blobToDataUrl(blob);
      const imageAspect = captureWidth / captureHeight;
      const capturedAt = new Date();

      const pdf = buildPdf(
        imageDataUrl,
        imageAspect,
        basemap,
        layers,
        selectionRef.current,
        notes,
        capturedAt,
      );

      const pdfBlob = pdf.output("blob");
      const objectUrl = URL.createObjectURL(pdfBlob);
      const safeTimestamp = capturedAt
        .toISOString()
        .slice(0, 19)
        .replace(/[T:]/g, "-");
      const filename = `haryana-gis-export-${safeTimestamp}.pdf`;
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
          ? `PDF export failed: ${error.message}`
          : "PDF export failed unexpectedly.",
      );
    } finally {
      setExpandLegendForCapture(false);
      setCapturing(false);
    }
  };

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
            className="pointer-events-none absolute left-20 right-3 top-3 z-[900] flex items-start justify-start gap-2 md:left-24 md:top-4"
          >
            <Topbar
              query={query}
              searchMessage={searchMessage}
              onQueryChange={setQuery}
              onSearch={handleSearch}
            />
          </div>

          <MapView
            basemap={basemap}
            layers={layers}
            focusRequest={focusRequest}
            onFocusHandled={() => setFocusRequest(null)}
            onSelectionChange={handleSelectionChange}
            legendForceExpanded={expandLegendForCapture}
          />

          {/* After MapView; sits in Leaflet top-left column under zoom (draw tools removed). */}
          <button
            type="button"
            data-capture-ignore=""
            onClick={() => setShowCaptureModal(true)}
            disabled={capturing}
            className="pointer-events-auto absolute left-[7px] top-[78px] z-[5000] flex h-9 w-9 items-center justify-center rounded-full border border-slate-300/90 bg-white text-slate-800 shadow-sm ring-1 ring-slate-900/5 transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-950 disabled:pointer-events-none"
            aria-label={
              capturing ? "Exporting map view" : "Export map view as PDF"
            }
          >
            {capturing ? (
              <Loader2
                className="h-[18px] w-[18px] shrink-0 animate-spin"
                aria-hidden
              />
            ) : (
              <Camera className="h-[18px] w-[18px] shrink-0" aria-hidden />
            )}
          </button>
        </div>
      </section>

      <CaptureModal
        open={showCaptureModal}
        onConfirm={handleCaptureConfirm}
        onCancel={() => setShowCaptureModal(false)}
      />
    </main>
  );
}
