"use client";

import type { MutableRefObject } from "react";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet-draw";
import { renderToStaticMarkup } from "react-dom/server";
import {
  GeoJSON,
  MapContainer,
  Marker,
  Pane,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import ForestPopupCard from "@/components/ForestPopupCard";
import PopupCard from "@/components/PopupCard";
import VillagePillarPopupCard from "@/components/VillagePillarPopupCard";
import VillagePopupCard from "@/components/VillagePopupCard";
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
  PillarFeatureCollection,
  PillarStatus,
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

function PopupVisibilityController() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();

    const handlePopupOpen = () => {
      container.classList.add("popup-active");
    };

    const handlePopupClose = () => {
      container.classList.remove("popup-active");
    };

    map.on("popupopen", handlePopupOpen);
    map.on("popupclose", handlePopupClose);

    return () => {
      map.off("popupopen", handlePopupOpen);
      map.off("popupclose", handlePopupClose);
      container.classList.remove("popup-active");
    };
  }, [map]);

  return null;
}

function FocusController({
  forestPillars,
  villagePillars,
  forestPillarRefs,
  villagePillarRefs,
  villageLayerRefs,
  focusRequest,
  onFocusHandled,
}: {
  forestPillars: PillarFeatureCollection["features"];
  villagePillars: VillagePillarFeatureCollection["features"];
  forestPillarRefs: MutableRefObject<Record<string, L.Marker | null>>;
  villagePillarRefs: MutableRefObject<Record<string, L.Marker | null>>;
  villageLayerRefs: MutableRefObject<Record<string, L.Layer | null>>;
  focusRequest: MapViewProps["focusRequest"];
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
        duration: 1.15,
        padding: [80, 80],
      });

      window.setTimeout(() => {
        villageLayer.openPopup();
      }, 850);

      onFocusHandled();
      return;
    }

    const targetCollection =
      focusRequest.type === "villagePillar" ? villagePillars : forestPillars;
    const target = targetCollection.find(
      (feature) => feature.properties.id === focusRequest.targetId,
    );

    if (!target) {
      onFocusHandled();
      return;
    }

    const [lng, lat] = target.geometry.coordinates;
    map.flyTo([lat, lng], 12, {
      animate: true,
      duration: 1.25,
    });

    window.setTimeout(() => {
      if (focusRequest.type === "villagePillar") {
        villagePillarRefs.current[target.properties.id]?.openPopup();
      } else {
        forestPillarRefs.current[target.properties.id]?.openPopup();
      }
    }, 900);

    onFocusHandled();
  }, [
    focusRequest,
    forestPillarRefs,
    forestPillars,
    map,
    onFocusHandled,
    villageLayerRefs,
    villagePillarRefs,
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

function createVillagePillarIcon() {
  return L.divIcon({
    className: "custom-pillar-icon",
    html: '<span class="village-pillar-marker village-pillar-complete"></span>',
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

function getBoundaryPillarCount(
  polygonCoordinates: [number, number][],
  pillars: PillarFeatureCollection["features"],
) {
  const boundaryVertices = new Set(
    polygonCoordinates
      .slice(0, -1)
      .map(getCoordinateKey),
  );

  return pillars.filter((pillar) => {
    return boundaryVertices.has(getCoordinateKey(pillar.geometry.coordinates));
  }).length;
}

export default function MapView({
  basemap,
  layers,
  focusRequest,
  onFocusHandled,
}: MapViewProps) {
  const forestPillarRefs = useRef<Record<string, L.Marker | null>>({});
  const villagePillarRefs = useRef<Record<string, L.Marker | null>>({});
  const villageLayerRefs = useRef<Record<string, L.Layer | null>>({});
  const activeBasemap = basemapConfig[basemap];

  return (
    <div className="relative h-full w-full">
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
          {...(activeBasemap.subdomains
            ? { subdomains: activeBasemap.subdomains }
            : {})}
        />

        <MeasurementControls />
        <PopupVisibilityController />
        <FocusController
          forestPillars={pillarsCollection.features}
          villagePillars={villagePillarsCollection.features}
          forestPillarRefs={forestPillarRefs}
          villagePillarRefs={villagePillarRefs}
          villageLayerRefs={villageLayerRefs}
          focusRequest={focusRequest}
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
              style={() => ({
                color: "#166534",
                weight: 2.5,
                fillColor: "#22c55e",
                fillOpacity: 0.18,
              })}
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
                  const perimeterKm = getPolygonPerimeterKm(polygonCoordinates);
                  const boundaryPillars = getBoundaryPillarCount(
                    polygonCoordinates,
                    pillarsCollection.features,
                  );

                  layer.bindPopup(
                    renderToStaticMarkup(
                      <ForestPopupCard
                        forest={forest}
                        perimeterKm={perimeterKm}
                        boundaryPillars={boundaryPillars}
                      />,
                    ),
                    {
                      closeButton: false,
                      className: "premium-popup",
                      autoPanPadding: [40, 40],
                    },
                  );
                }
              }}
            />
          </Pane>
        )}

        {layers.villages && (
          <Pane name="villages" style={{ zIndex: 430 }}>
            <GeoJSON
              data={villagesCollection}
              style={() => ({
                color: "#b45309",
                weight: 2,
                fillColor: "#f59e0b",
                fillOpacity: 0.2,
                dashArray: "4 4",
              })}
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
                  const perimeterKm = getPolygonPerimeterKm(polygonCoordinates);
                  const boundaryPillars = getBoundaryPillarCount(
                    polygonCoordinates,
                    villagePillarsCollection.features,
                  );

                  layer.bindPopup(
                    renderToStaticMarkup(
                      <VillagePopupCard
                        village={village}
                        perimeterKm={perimeterKm}
                        boundaryPillars={boundaryPillars}
                      />,
                    ),
                    {
                      closeButton: false,
                      className: "premium-popup",
                      autoPanPadding: [40, 40],
                    },
                  );
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
                  icon={createPillarIcon(pillar.status)}
                  ref={(marker) => {
                    forestPillarRefs.current[pillar.id] = marker;
                  }}
                  riseOnHover
                >
                  <Popup
                    closeButton={false}
                    offset={[4, -18]}
                    className="premium-popup"
                    autoPanPadding={[40, 40]}
                  >
                    <PopupCard pillar={pillar} />
                  </Popup>
                </Marker>
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
                  icon={createVillagePillarIcon()}
                  ref={(marker) => {
                    villagePillarRefs.current[pillar.id] = marker;
                  }}
                  riseOnHover
                >
                  <Popup
                    closeButton={false}
                    offset={[4, -14]}
                    className="premium-popup"
                    autoPanPadding={[40, 40]}
                  >
                    <VillagePillarPopupCard pillar={pillar} />
                  </Popup>
                </Marker>
              );
            })}
          </Pane>
        )}
      </MapContainer>

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
}
