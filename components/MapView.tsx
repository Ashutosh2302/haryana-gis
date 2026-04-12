"use client";

import type { MutableRefObject } from "react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import L from "leaflet";
import "leaflet-draw";
import { ChevronDown, ChevronUp, Layers3 } from "lucide-react";
import {
  GeoJSON,
  MapContainer,
  Marker,
  Pane,
  ScaleControl,
  TileLayer,
  useMap,
} from "react-leaflet";

import MapSelectionDrawer from "@/components/MapSelectionDrawer";
import {
  adminCollection,
  forestCollection,
  pillarsCollection,
  villagePillarsCollection,
  villagesCollection,
} from "@/data/mockData";
import type {
  BasemapId,
  ForestProperties,
  LayerVisibility,
  MapSelection,
  PillarProperties,
  PillarFeatureCollection,
  PillarStatus,
  VillagePillarProperties,
  VillagePillarFeatureCollection,
  VillageProperties,
} from "@/types/gis";

interface MapViewProps {
  basemap: BasemapId;
  layers: LayerVisibility;
  focusRequest: {
    type: "forestPillar" | "villagePillar" | "village";
    targetId: string;
    nonce: number;
  } | null;
  onFocusHandled: () => void;
}

export interface MapViewHandle {
  exportCurrentView: () => Promise<{ ok: boolean; message: string }>;
}

const haryanaCenter: [number, number] = [29.0588, 76.0856];

const basemapConfig: Record<
  BasemapId,
  { url: string; attribution: string; subdomains?: string | string[] }
> = {
  street: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
    subdomains: "abc",
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
  },
};

const pillarMarkerStyles: Record<PillarStatus, string> = {
  Verified: "marker-verified",
  Pending: "marker-pending",
  Disputed: "marker-disputed",
};

function MeasurementControls() {
  const map = useMap();

  useEffect(() => {
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      position: "topleft",
      draw: {
        polyline: {
          metric: true,
          shapeOptions: {
            color: "#2563eb",
            weight: 4,
          },
        },
        polygon: {
          allowIntersection: false,
          showArea: true,
          shapeOptions: {
            color: "#15803d",
            weight: 3,
            fillColor: "#16a34a",
            fillOpacity: 0.12,
          },
        },
        rectangle: {
          showArea: true,
          shapeOptions: {
            color: "#0f766e",
            weight: 3,
            fillColor: "#14b8a6",
            fillOpacity: 0.1,
          },
        },
        circle: false,
        marker: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: drawnItems,
        edit: false,
        remove: true,
      },
    });

    const handleCreated = (event: L.LeafletEvent) => {
      const drawEvent = event as L.DrawEvents.Created;
      drawnItems.addLayer(drawEvent.layer);
    };

    map.addControl(drawControl);
    map.on(L.Draw.Event.CREATED, handleCreated);

    return () => {
      map.off(L.Draw.Event.CREATED, handleCreated);
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
    };
  }, [map]);

  return null;
}

function createForestSelection(
  forest: ForestProperties,
  polygonCoordinates: [number, number][],
): MapSelection {
  const coordinates = getPolygonCenter(polygonCoordinates);

  return {
    kind: "forest",
    forest,
    perimeterKm: getPolygonPerimeterKm(polygonCoordinates),
    boundaryPillars: getBoundaryPillarCount(
      polygonCoordinates,
      pillarsCollection.features,
    ),
    coordinates,
  };
}

function createVillageSelection(
  village: VillageProperties,
  polygonCoordinates: [number, number][],
): MapSelection {
  const coordinates = getPolygonCenter(polygonCoordinates);

  return {
    kind: "village",
    village,
    perimeterKm: getPolygonPerimeterKm(polygonCoordinates),
    boundaryPillars: getBoundaryPillarCount(
      polygonCoordinates,
      villagePillarsCollection.features,
    ),
    coordinates,
  };
}

function createForestPillarSelection(
  pillar: PillarProperties,
  coordinates: [number, number],
): MapSelection {
  const [lng, lat] = coordinates;

  return {
    kind: "forestPillar",
    pillar,
    coordinates: {
      lat,
      lng,
    },
  };
}

function createVillagePillarSelection(
  pillar: VillagePillarProperties,
  coordinates: [number, number],
): MapSelection {
  const [lng, lat] = coordinates;

  return {
    kind: "villagePillar",
    pillar,
    coordinates: {
      lat,
      lng,
    },
  };
}

function MapLegend({
  basemap,
  layers,
}: {
  basemap: BasemapId;
  layers: LayerVisibility;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`absolute bottom-4 left-4 z-[700] rounded-[22px] ${
        expanded ? "w-[210px] p-2.5" : "w-auto p-2"
      }`}
      style={{
        border: "1px solid rgba(255,255,255,0.75)",
        background: "rgba(255,255,255,0.96)",
        boxShadow: "0 20px 50px -36px rgba(15,23,42,0.45)",
      }}
    >
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className={`flex w-full items-center justify-between gap-3 text-left transition hover:bg-slate-50 ${
          expanded ? "rounded-[18px] px-2 py-1.5" : "rounded-[18px] px-3 py-2"
        }`}
        aria-expanded={expanded}
        aria-label={expanded ? "Collapse map legend" : "Expand map legend"}
      >
        <div className="flex min-w-0 items-center gap-3">
          {expanded ? (
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
              <Layers3 className="h-4 w-4" />
            </span>
          ) : null}
          <div className="min-w-0">
            {expanded ? (
              <>
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                  style={{ color: "#64748b" }}
                >
                  Map Legend
                </p>
                <p
                  className="mt-1 truncate text-sm font-semibold"
                  style={{ color: "#020617" }}
                >
                  Basemap:{" "}
                  {basemap === "street" ? "Street Map" : "Satellite Map"}
                </p>
              </>
            ) : (
              <p className="text-sm font-semibold text-slate-900">Map Legend</p>
            )}
          </div>
        </div>
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </span>
      </button>

      {expanded ? (
        <div
          className="mt-2 space-y-2.5 px-2 pb-1 text-sm"
          style={{ color: "#334155" }}
        >
          {layers.forest && (
            <div className="flex items-center gap-3">
              <span
                className="inline-block h-3.5 w-5 rounded-sm border-2"
                style={{
                  borderColor: "#166534",
                  background: "rgba(74, 222, 128, 0.5)",
                }}
              />
              <span>Forest Boundary</span>
            </div>
          )}
          {layers.pillars && (
            <div className="flex items-center gap-3">
              <span
                className="inline-block h-3.5 w-3.5 rounded-full border-2"
                style={{
                  borderColor: "#166534",
                  background: "#4ade80",
                  boxShadow: "0 0 0 3px rgba(255,255,255,0.9)",
                }}
              />
              <span>Forest Pillar Point</span>
            </div>
          )}
          {layers.villages && (
            <div className="flex items-center gap-3">
              <span
                className="inline-block h-3.5 w-5 rounded-sm border-2"
                style={{
                  borderColor: "#b45309",
                  background: "rgba(251, 191, 36, 0.5)",
                }}
              />
              <span>Village Land Parcel</span>
            </div>
          )}
          {layers.villagePillars && (
            <div className="flex items-center gap-3">
              <span
                className="inline-block h-3 w-3 rounded-full border-2"
                style={{
                  borderColor: "#c2410c",
                  background: "#f97316",
                  boxShadow: "0 0 0 3px rgba(255,255,255,0.9)",
                }}
              />
              <span>Village Boundary Pillar</span>
            </div>
          )}
          {layers.admin && (
            <div className="flex items-center gap-3">
              <span
                className="inline-block h-0.5 w-5 rounded-full"
                style={{ background: "rgba(29, 78, 216, 0.9)" }}
              />
              <span>Administrative Boundary</span>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function getSelectionExportData(selection: MapSelection) {
  switch (selection.kind) {
    case "forest":
      return {
        label: "Forest Boundary",
        title: selection.forest.name,
        description:
          "Boundary parcel under active forest survey and demarcation review.",
        accent: [6, 95, 70] as const,
        fields: [
          ["Division", selection.forest.division],
          ["Area", `${selection.forest.area_ha.toLocaleString("en-IN")} ha`],
          ["Perimeter", `${selection.perimeterKm.toFixed(2)} km`],
          ["Boundary Pillars", String(selection.boundaryPillars)],
        ],
      };
    case "village":
      return {
        label: "Village Land Parcel",
        title: selection.village.name,
        description:
          "Revenue village land parcel falling within notified forest extent.",
        accent: [154, 52, 18] as const,
        fields: [
          ["Tehsil", selection.village.tehsil],
          ["District", selection.village.district],
          ["Area", `${selection.village.area_ha.toLocaleString("en-IN")} ha`],
          ["Perimeter", `${selection.perimeterKm.toFixed(2)} km`],
          ["Boundary Pillars", String(selection.boundaryPillars)],
          ["Settlement Stage", selection.village.settlement_stage],
        ],
      };
    case "forestPillar":
      return {
        label: "Demarcation Pillar",
        title: selection.pillar.id,
        description:
          "Field-verified survey reference for forest settlement review.",
        accent: [15, 23, 42] as const,
        fields: [
          ["Status", selection.pillar.status],
          ["Village", selection.pillar.village],
          ["District", selection.pillar.district],
          ["Survey Date", selection.pillar.survey_date],
          ["Survey No", selection.pillar.survey_no],
        ],
      };
    case "villagePillar":
      return {
        label: "Village Boundary Pillar",
        title: selection.pillar.id,
        description:
          "Boundary reference pillar for village land parcel demarcation inside forest limits.",
        accent: [194, 65, 12] as const,
        fields: [
          ["Status", selection.pillar.status],
          ["Village", selection.pillar.village],
          ["District", selection.pillar.district],
          ["Survey Date", selection.pillar.survey_date],
          ["Survey No", selection.pillar.survey_no],
        ],
      };
  }
}

function FocusController({
  forestPillars,
  villagePillars,
  villageLayerRefs,
  focusRequest,
  onSelectionChange,
  onFocusHandled,
}: {
  forestPillars: PillarFeatureCollection["features"];
  villagePillars: VillagePillarFeatureCollection["features"];
  villageLayerRefs: MutableRefObject<Record<string, L.Layer | null>>;
  focusRequest: MapViewProps["focusRequest"];
  onSelectionChange: (selection: MapSelection | null) => void;
  onFocusHandled: () => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!focusRequest) {
      return;
    }

    if (focusRequest.type === "village") {
      const villageLayer = villageLayerRefs.current[focusRequest.targetId] as
        | (L.Layer & {
            getBounds: () => L.LatLngBounds;
            openPopup: () => void;
          })
        | null;

      if (!villageLayer) {
        onFocusHandled();
        return;
      }

      map.fitBounds(villageLayer.getBounds(), {
        animate: true,
        duration: 1,
        padding: [80, 80],
      });
      const villageFeature = villagesCollection.features.find(
        (feature) => feature.properties.id === focusRequest.targetId,
      );

      if (villageFeature?.geometry.type === "Polygon") {
        onSelectionChange(
          createVillageSelection(
            villageFeature.properties,
            villageFeature.geometry.coordinates[0] as [number, number][],
          ),
        );
      }

      onFocusHandled();
      return;
    }

    if (focusRequest.type === "villagePillar") {
      const target = villagePillars.find(
        (feature) => feature.properties.id === focusRequest.targetId,
      );

      if (!target) {
        onFocusHandled();
        return;
      }

      const [lng, lat] = target.geometry.coordinates;
      map.flyTo([lat, lng], 12, {
        animate: true,
        duration: 1,
      });
      onSelectionChange(
        createVillagePillarSelection(
          target.properties,
          target.geometry.coordinates,
        ),
      );
      onFocusHandled();
      return;
    }

    const target = forestPillars.find(
      (feature) => feature.properties.id === focusRequest.targetId,
    );

    if (!target) {
      onFocusHandled();
      return;
    }

    const [lng, lat] = target.geometry.coordinates;
    map.flyTo([lat, lng], 12, {
      animate: true,
      duration: 1,
    });
    onSelectionChange(
      createForestPillarSelection(
        target.properties,
        target.geometry.coordinates,
      ),
    );

    onFocusHandled();
  }, [
    focusRequest,
    forestPillars,
    map,
    onSelectionChange,
    onFocusHandled,
    villageLayerRefs,
    villagePillars,
  ]);

  return null;
}

function createPillarIcon(status: PillarStatus) {
  return L.divIcon({
    className: "custom-pillar-icon",
    html: `<span class="pillar-marker ${pillarMarkerStyles[status]}"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8],
  });
}

function createHighlightedPillarIcon(status: PillarStatus) {
  return L.divIcon({
    className: "custom-pillar-icon",
    html: `<span class="pillar-marker pillar-marker-selected ${pillarMarkerStyles[status]}"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8],
  });
}

function createVillagePillarIcon() {
  return L.divIcon({
    className: "custom-pillar-icon",
    html: '<span class="village-pillar-marker village-pillar-complete"></span>',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -8],
  });
}

function createHighlightedVillagePillarIcon() {
  return L.divIcon({
    className: "custom-pillar-icon",
    html: '<span class="village-pillar-marker village-pillar-complete village-pillar-marker-selected"></span>',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -8],
  });
}

function getPolygonPerimeterKm(coordinates: [number, number][]) {
  let perimeterMeters = 0;

  for (let index = 0; index < coordinates.length - 1; index += 1) {
    const [startLng, startLat] = coordinates[index];
    const [endLng, endLat] = coordinates[index + 1];

    perimeterMeters += L.latLng(startLat, startLng).distanceTo(
      L.latLng(endLat, endLng),
    );
  }

  return perimeterMeters / 1000;
}

function getCoordinateKey([lng, lat]: [number, number]) {
  return `${lng.toFixed(6)},${lat.toFixed(6)}`;
}

function getPolygonCenter(coordinates: [number, number][]) {
  const vertices = coordinates.slice(0, -1);
  const total = vertices.length || 1;

  const sums = vertices.reduce(
    (accumulator, [lng, lat]) => ({
      lng: accumulator.lng + lng,
      lat: accumulator.lat + lat,
    }),
    { lng: 0, lat: 0 },
  );

  return {
    lat: sums.lat / total,
    lng: sums.lng / total,
  };
}

function getBoundaryPillarCount(
  polygonCoordinates: [number, number][],
  pillars: PillarFeatureCollection["features"],
) {
  const boundaryVertices = new Set(
    polygonCoordinates.slice(0, -1).map(getCoordinateKey),
  );

  return pillars.filter((pillar) => {
    return boundaryVertices.has(getCoordinateKey(pillar.geometry.coordinates));
  }).length;
}

function isForestSelected(
  selection: MapSelection | null,
  forest: ForestProperties | undefined,
) {
  return Boolean(
    selection &&
    selection.kind === "forest" &&
    forest &&
    selection.forest.name === forest.name,
  );
}

function isVillageSelected(
  selection: MapSelection | null,
  village: VillageProperties | undefined,
) {
  return Boolean(
    selection &&
    selection.kind === "village" &&
    village &&
    selection.village.id === village.id,
  );
}

function isForestPillarSelected(
  selection: MapSelection | null,
  pillar: PillarProperties,
) {
  return Boolean(
    selection &&
    selection.kind === "forestPillar" &&
    selection.pillar.id === pillar.id,
  );
}

function isVillagePillarSelected(
  selection: MapSelection | null,
  pillar: VillagePillarProperties,
) {
  return Boolean(
    selection &&
    selection.kind === "villagePillar" &&
    selection.pillar.id === pillar.id,
  );
}

const MapView = forwardRef<MapViewHandle, MapViewProps>(function MapView(
  { basemap, layers, focusRequest, onFocusHandled }: MapViewProps,
  ref,
) {
  const villageLayerRefs = useRef<Record<string, L.Layer | null>>({});
  const captureRef = useRef<HTMLDivElement | null>(null);
  const activeBasemap = basemapConfig[basemap];
  const [selection, setSelection] = useState<MapSelection | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      exportCurrentView: async () => {
        if (!captureRef.current) {
          return {
            ok: false,
            message: "Unable to export PDF because the map view is not ready.",
          };
        }

        try {
          await new Promise((resolve) => {
            window.setTimeout(resolve, 250);
          });

          const canvas = await html2canvas(captureRef.current, {
            useCORS: true,
            allowTaint: false,
            backgroundColor: "#ffffff",
            scale: Math.min(window.devicePixelRatio || 2, 2),
            logging: false,
          });

          const imageData = canvas.toDataURL("image/png");
          const pdf = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4",
          });

          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const margin = 10;
          const headerHeight = 14;
          const detailWidth = selection ? 82 : 0;
          const gap = selection ? 8 : 0;
          const availableWidth = pageWidth - margin * 2 - detailWidth - gap;
          const availableHeight = pageHeight - margin * 2 - headerHeight;
          const imageRatio = canvas.width / canvas.height;

          let imageWidth = availableWidth;
          let imageHeight = imageWidth / imageRatio;

          if (imageHeight > availableHeight) {
            imageHeight = availableHeight;
            imageWidth = imageHeight * imageRatio;
          }

          const imageX = (pageWidth - imageWidth) / 2;
          const imageY = margin + headerHeight;
          const timestamp = new Date().toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          });

          pdf.setFontSize(15);
          pdf.text(
            "Haryana Forest Survey & Demarcation GIS Map Export",
            margin,
            12,
          );
          pdf.setFontSize(9);
          pdf.setTextColor(71, 85, 105);
          pdf.text(
            `Basemap: ${basemap === "street" ? "Street Map" : "Satellite Map"} | Exported: ${timestamp}`,
            margin,
            18,
          );
          pdf.addImage(
            imageData,
            "PNG",
            imageX,
            imageY,
            imageWidth,
            imageHeight,
          );

          if (selection) {
            const detail = getSelectionExportData(selection);
            const cardX = imageX + imageWidth + gap;
            const cardY = imageY;
            const cardHeight = Math.min(imageHeight, availableHeight);
            const [r, g, b] = detail.accent;
            let cursorY = cardY + 10;

            pdf.setDrawColor(226, 232, 240);
            pdf.setFillColor(255, 255, 255);
            pdf.roundedRect(cardX, cardY, detailWidth, cardHeight, 6, 6, "FD");

            pdf.setFillColor(r, g, b);
            pdf.roundedRect(cardX, cardY, detailWidth, 34, 6, 6, "F");
            pdf.setFillColor(255, 255, 255);
            pdf.rect(cardX, cardY + 28, detailWidth, 6, "F");

            pdf.setTextColor(226, 232, 240);
            pdf.setFontSize(8);
            pdf.text(detail.label.toUpperCase(), cardX + 6, cursorY);

            cursorY += 8;
            pdf.setFontSize(15);
            pdf.setTextColor(255, 255, 255);
            const titleLines = pdf.splitTextToSize(
              detail.title,
              detailWidth - 12,
            );
            pdf.text(titleLines, cardX + 6, cursorY);

            cursorY += titleLines.length * 6 + 4;
            pdf.setFontSize(9);
            pdf.setTextColor(226, 232, 240);
            const descLines = pdf.splitTextToSize(
              detail.description,
              detailWidth - 12,
            );
            pdf.text(descLines, cardX + 6, cursorY);

            cursorY = cardY + 42;
            pdf.setTextColor(15, 23, 42);
            pdf.setFontSize(9);

            detail.fields.forEach(([label, value]) => {
              const boxHeight = 18;

              if (cursorY + boxHeight > cardY + cardHeight - 8) {
                return;
              }

              pdf.setFillColor(248, 250, 252);
              pdf.setDrawColor(226, 232, 240);
              pdf.roundedRect(
                cardX + 4,
                cursorY,
                detailWidth - 8,
                boxHeight,
                4,
                4,
                "FD",
              );

              pdf.setFontSize(7);
              pdf.setTextColor(100, 116, 139);
              pdf.text(label.toUpperCase(), cardX + 8, cursorY + 5.5);

              pdf.setFontSize(10);
              pdf.setTextColor(15, 23, 42);
              const valueLines = pdf.splitTextToSize(value, detailWidth - 16);
              pdf.text(valueLines[0], cardX + 8, cursorY + 12);

              cursorY += boxHeight + 4;
            });
          }

          const safeTimestamp = new Date()
            .toISOString()
            .slice(0, 19)
            .replace(/[T:]/g, "-");
          const filename = `haryana-gis-map-export-${safeTimestamp}.pdf`;
          const blob = pdf.output("blob");
          const objectUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");

          link.href = objectUrl;
          link.download = filename;
          link.rel = "noopener";
          document.body.append(link);
          link.click();
          link.remove();

          window.setTimeout(() => {
            URL.revokeObjectURL(objectUrl);
          }, 1500);

          return {
            ok: true,
            message: "Map PDF exported successfully with legend and scale.",
          };
        } catch (error) {
          return {
            ok: false,
            message:
              error instanceof Error
                ? `Map PDF export failed: ${error.message}`
                : "Map PDF export failed. Please wait for tiles to finish loading and try again.",
          };
        }
      },
    }),
    [basemap, selection],
  );

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div ref={captureRef} className="absolute inset-0">
        <MapContainer
          center={haryanaCenter}
          zoom={8}
          zoomControl
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            attribution={activeBasemap.attribution}
            url={activeBasemap.url}
            crossOrigin="anonymous"
            {...(activeBasemap.subdomains
              ? { subdomains: activeBasemap.subdomains }
              : {})}
          />

          <ScaleControl position="bottomleft" imperial={false} />
          <MeasurementControls />
          <FocusController
            forestPillars={pillarsCollection.features}
            villagePillars={villagePillarsCollection.features}
            villageLayerRefs={villageLayerRefs}
            focusRequest={focusRequest}
            onSelectionChange={setSelection}
            onFocusHandled={onFocusHandled}
          />

          {layers.admin && (
            <Pane name="admin" style={{ zIndex: 350 }}>
              <GeoJSON
                data={adminCollection}
                style={() => ({
                  color: "#1d4ed8",
                  weight: 2.5,
                  dashArray: "8 8",
                  fillOpacity: 0.03,
                })}
                interactive={false}
              />
            </Pane>
          )}

          {layers.forest && (
            <Pane name="forest" style={{ zIndex: 400 }}>
              <GeoJSON
                data={forestCollection}
                style={(feature) => {
                  const forest = feature?.properties as
                    | ForestProperties
                    | undefined;
                  const selected = isForestSelected(selection, forest);

                  return {
                    color: selected ? "#065f46" : "#166534",
                    weight: selected ? 4.5 : 2.5,
                    fillColor: selected ? "#34d399" : "#22c55e",
                    fillOpacity: selected ? 0.28 : 0.18,
                    className: selected ? "selected-map-area" : undefined,
                  };
                }}
                onEachFeature={(feature, layer) => {
                  const forest = feature.properties as
                    | ForestProperties
                    | undefined;
                  const polygonCoordinates =
                    feature.geometry.type === "Polygon"
                      ? (feature.geometry.coordinates[0] as [number, number][])
                      : undefined;

                  const name = forest?.name;
                  if (name) {
                    layer.bindTooltip(name, {
                      sticky: true,
                      direction: "top",
                      className: "map-tooltip",
                    });
                  }

                  if (forest && polygonCoordinates) {
                    const handleForestSelect = (
                      event?: L.LeafletMouseEvent,
                    ) => {
                      if (event) {
                        L.DomEvent.stop(event);
                      }
                      setSelection(
                        createForestSelection(forest, polygonCoordinates),
                      );
                    };

                    layer.on("preclick", handleForestSelect);
                  }
                }}
              />
            </Pane>
          )}

          {layers.villages && (
            <Pane name="villages" style={{ zIndex: 430 }}>
              <GeoJSON
                data={villagesCollection}
                style={(feature) => {
                  const village = feature?.properties as
                    | VillageProperties
                    | undefined;
                  const selected = isVillageSelected(selection, village);

                  return {
                    color: selected ? "#9a3412" : "#b45309",
                    weight: selected ? 3.5 : 2,
                    fillColor: selected ? "#fb923c" : "#f59e0b",
                    fillOpacity: selected ? 0.28 : 0.2,
                    dashArray: selected ? undefined : "4 4",
                    className: selected
                      ? "selected-map-area selected-map-area-village"
                      : undefined,
                  };
                }}
                onEachFeature={(feature, layer) => {
                  const village = feature.properties as
                    | VillageProperties
                    | undefined;
                  const polygonCoordinates =
                    feature.geometry.type === "Polygon"
                      ? (feature.geometry.coordinates[0] as [number, number][])
                      : undefined;

                  if (village) {
                    villageLayerRefs.current[village.id] = layer;
                    layer.bindTooltip(village.name, {
                      sticky: true,
                      direction: "top",
                      className: "map-tooltip village-tooltip",
                    });
                  }

                  if (village && polygonCoordinates) {
                    const handleVillageSelect = (
                      event?: L.LeafletMouseEvent,
                    ) => {
                      if (event) {
                        L.DomEvent.stop(event);
                      }
                      setSelection(
                        createVillageSelection(village, polygonCoordinates),
                      );
                    };

                    layer.on("preclick", handleVillageSelect);
                  }
                }}
              />
            </Pane>
          )}

          {layers.pillars && (
            <Pane name="pillars">
              {pillarsCollection.features.map((feature) => {
                const [lng, lat] = feature.geometry.coordinates;
                const pillar = feature.properties;

                return (
                  <Marker
                    key={pillar.id}
                    position={[lat, lng]}
                    icon={
                      isForestPillarSelected(selection, pillar)
                        ? createHighlightedPillarIcon(pillar.status)
                        : createPillarIcon(pillar.status)
                    }
                    riseOnHover
                    eventHandlers={{
                      click: () => {
                        setSelection(
                          createForestPillarSelection(
                            pillar,
                            feature.geometry.coordinates,
                          ),
                        );
                      },
                    }}
                  />
                );
              })}
            </Pane>
          )}

          {layers.villagePillars && (
            <Pane name="village-pillars" style={{ zIndex: 470 }}>
              {villagePillarsCollection.features.map((feature) => {
                const [lng, lat] = feature.geometry.coordinates;
                const pillar = feature.properties;

                return (
                  <Marker
                    key={pillar.id}
                    position={[lat, lng]}
                    icon={
                      isVillagePillarSelected(selection, pillar)
                        ? createHighlightedVillagePillarIcon()
                        : createVillagePillarIcon()
                    }
                    riseOnHover
                    eventHandlers={{
                      click: () => {
                        setSelection(
                          createVillagePillarSelection(
                            pillar,
                            feature.geometry.coordinates,
                          ),
                        );
                      },
                    }}
                  />
                );
              })}
            </Pane>
          )}
        </MapContainer>

        <MapLegend basemap={basemap} layers={layers} />
      </div>

      <MapSelectionDrawer
        selection={selection}
        onClose={() => setSelection(null)}
      />

      {/* <div className="pointer-events-none absolute right-4 top-4 z-[500] rounded-2xl border border-white/70 bg-white/88 px-4 py-3 shadow-lg backdrop-blur">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
          Active Layers
        </p>
        <p className="mt-1 text-sm font-semibold text-slate-900">
          {visibleLayers.join(" • ") || "No layers visible"}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Basemap: {basemap === "street" ? "Street Map" : "Satellite Map"}
        </p>
      </div> */}

      {/* <div className="pointer-events-none absolute bottom-4 left-4 z-[500] rounded-2xl border border-slate-200/80 bg-slate-950/92 px-4 py-3 text-slate-100 shadow-xl backdrop-blur">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
          Map Tools
        </p>
        <p className="mt-1 text-sm text-slate-100">
          Use the draw toolbar for distance and area measurement.
        </p>
      </div> */}
    </div>
  );
});

export default MapView;
