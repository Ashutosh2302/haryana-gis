import type { FeatureCollection } from "geojson";

import type {
  PillarFeatureCollection,
  PillarStatus,
  VillageFeatureCollection,
  VillagePillarFeatureCollection,
} from "@/types/gis";

// Mostly corner turns with a few infill vertices so the mock outline reads
// more like a surveyed forest boundary than a smoothed traced shape.
const morniForestBoundary: [number, number][] = [
  [76.818, 30.822],
  [76.824, 30.835],
  [76.829, 30.848],
  [76.838, 30.857],
  [76.851, 30.862],
  [76.864, 30.866],
  [76.878, 30.864],
  [76.891, 30.867],
  [76.904, 30.865],
  [76.916, 30.86],
  [76.928, 30.854],
  [76.941, 30.849],
  [76.952, 30.843],
  [76.964, 30.836],
  [76.975, 30.829],
  [76.982, 30.817],
  [76.981, 30.805],
  [76.979, 30.794],
  [76.978, 30.782],
  [76.976, 30.771],
  [76.973, 30.758],
  [76.971, 30.747],
  [76.968, 30.735],
  [76.958, 30.728],
  [76.946, 30.724],
  [76.934, 30.722],
  [76.922, 30.721],
  [76.909, 30.719],
  [76.897, 30.717],
  [76.884, 30.714],
  [76.872, 30.712],
  [76.86, 30.716],
  [76.849, 30.724],
  [76.839, 30.732],
  [76.829, 30.741],
  [76.82, 30.751],
  [76.811, 30.761],
  [76.812, 30.774],
  [76.814, 30.787],
  [76.816, 30.8],
];

const kaimbwalaVillageBoundary: [number, number][] = [
  [76.841, 30.762],
  [76.848, 30.771],
  [76.856, 30.776],
  [76.864, 30.771],
  [76.868, 30.758],
  [76.864, 30.746],
  [76.853, 30.741],
  [76.844, 30.747],
];

const mandhnaVillageBoundary: [number, number][] = [
  [76.892, 30.789],
  [76.9, 30.797],
  [76.909, 30.801],
  [76.919, 30.797],
  [76.927, 30.787],
  [76.925, 30.776],
  [76.917, 30.765],
  [76.906, 30.759],
  [76.896, 30.767],
];

function getMorniSurveyDate(index: number) {
  const dayNumber = index + 10;
  const month = dayNumber <= 28 ? "02" : "03";
  const day = dayNumber <= 28 ? dayNumber : dayNumber - 28;

  return `2026-${month}-${String(day).padStart(2, "0")}`;
}

function getVillageSurveyDate(index: number) {
  return `2026-03-${String(index + 3).padStart(2, "0")}`;
}

export const pillarsCollection: PillarFeatureCollection = {
  type: "FeatureCollection",
  features: [
    ...morniForestBoundary.map((coordinates, index) => ({
      type: "Feature" as const,
      properties: {
        id: `HR-PILLAR-${String(index + 1).padStart(3, "0")}`,
        village: "Morni",
        district: "Panchkula",
        survey_date: getMorniSurveyDate(index),
        survey_no: `MOR/2026/${String(index + 1).padStart(3, "0")}`,
        status: "Verified" as PillarStatus,
        image_url: "/pillar-placeholder.svg",
      },
      geometry: { type: "Point" as const, coordinates },
    })),
    {
      type: "Feature",
      properties: {
        id: "HR-PILLAR-041",
        village: "Sadhaura",
        district: "Yamunanagar",
        survey_date: "2026-03-22",
        survey_no: "SAD/2026/041",
        status: "Verified",
        image_url: "/pillar-placeholder.svg",
      },
      geometry: { type: "Point", coordinates: [77.15, 30.426] },
    },
    {
      type: "Feature",
      properties: {
        id: "HR-PILLAR-042",
        village: "Jagadhri",
        district: "Yamunanagar",
        survey_date: "2026-03-23",
        survey_no: "JAG/2026/042",
        status: "Verified",
        image_url: "/pillar-placeholder.svg",
      },
      geometry: { type: "Point", coordinates: [77.356, 30.383] },
    },
    {
      type: "Feature",
      properties: {
        id: "HR-PILLAR-043",
        village: "Bilaspur",
        district: "Yamunanagar",
        survey_date: "2026-03-24",
        survey_no: "BIL/2026/043",
        status: "Verified",
        image_url: "/pillar-placeholder.svg",
      },
      geometry: { type: "Point", coordinates: [77.412, 30.204] },
    },
    {
      type: "Feature",
      properties: {
        id: "HR-PILLAR-044",
        village: "Bilaspur",
        district: "Yamunanagar",
        survey_date: "2026-03-25",
        survey_no: "BIL/2026/044",
        status: "Verified",
        image_url: "/pillar-placeholder.svg",
      },
      geometry: { type: "Point", coordinates: [77.318, 30.033] },
    },
    {
      type: "Feature",
      properties: {
        id: "HR-PILLAR-045",
        village: "Jagadhri",
        district: "Yamunanagar",
        survey_date: "2026-03-26",
        survey_no: "JAG/2026/045",
        status: "Verified",
        image_url: "/pillar-placeholder.svg",
      },
      geometry: { type: "Point", coordinates: [77.162, 30.086] },
    },
    {
      type: "Feature",
      properties: {
        id: "HR-PILLAR-046",
        village: "Sadhaura",
        district: "Yamunanagar",
        survey_date: "2026-03-27",
        survey_no: "SAD/2026/046",
        status: "Verified",
        image_url: "/pillar-placeholder.svg",
      },
      geometry: { type: "Point", coordinates: [77.112, 30.255] },
    },
  ],
};

export const forestCollection: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Morni Hills Forest",
        division: "Panchkula Forest Division",
        area_ha: 4280,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            ...morniForestBoundary,
            morniForestBoundary[0],
          ],
        ],
      },
    },
    // {
    //   type: "Feature",
    //   properties: {
    //     name: "Panchkula Forest Division",
    //     division: "Panchkula Forest Division",
    //     area_ha: 3860,
    //   },
    //   geometry: {
    //     type: "Polygon",
    //     coordinates: [
    //       [
    //         [76.861, 30.833],
    //         [77.007, 30.835],
    //         [77.035, 30.748],
    //         [76.938, 30.688],
    //         [76.838, 30.734],
    //         [76.861, 30.833],
    //       ],
    //     ],
    //   },
    // },
    {
      type: "Feature",
      properties: {
        name: "Yamunanagar Range",
        division: "Yamunanagar Forest Circle",
        area_ha: 4400,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [77.15, 30.426],
            [77.356, 30.383],
            [77.412, 30.204],
            [77.318, 30.033],
            [77.162, 30.086],
            [77.112, 30.255],
            [77.15, 30.426],
          ],
        ],
      },
    },
  ],
};

export const villagesCollection: VillageFeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "HR-VLG-001",
        name: "Morni Village Lands",
        tehsil: "Morni",
        district: "Panchkula",
        area_ha: 118,
        settlement_stage: "Boundary verification under review",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            ...kaimbwalaVillageBoundary,
            kaimbwalaVillageBoundary[0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "HR-VLG-002",
        name: "Bhoj Koti Village Lands",
        tehsil: "Morni",
        district: "Panchkula",
        area_ha: 96,
        settlement_stage: "Settlement record cross-check in progress",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            ...mandhnaVillageBoundary,
            mandhnaVillageBoundary[0],
          ],
        ],
      },
    },
  ],
};

export const villagePillarsCollection: VillagePillarFeatureCollection = {
  type: "FeatureCollection",
  features: [
    ...kaimbwalaVillageBoundary.map((coordinates, index) => ({
      type: "Feature" as const,
      properties: {
        id: `HR-VP-${String(index + 1).padStart(3, "0")}`,
        village: "Morni",
        district: "Panchkula",
        survey_date: getVillageSurveyDate(Math.floor(index / 2)),
        survey_no: `MOR-VLG/2026/${String(index + 1).padStart(3, "0")}`,
        status: "Verified" as PillarStatus,
        image_url: "/pillar-placeholder.svg",
        boundary_type: "Village Boundary Pillar" as const,
      },
      geometry: { type: "Point" as const, coordinates },
    })),
    ...mandhnaVillageBoundary.map((coordinates, index) => ({
      type: "Feature" as const,
      properties: {
        id: `HR-VP-${String(index + kaimbwalaVillageBoundary.length + 1).padStart(3, "0")}`,
        village: "Bhoj Koti",
        district: "Panchkula",
        survey_date: getVillageSurveyDate(2 + Math.floor(index / 2)),
        survey_no: `BHK/2026/${String(index + 1).padStart(3, "0")}`,
        status: "Verified" as PillarStatus,
        image_url: "/pillar-placeholder.svg",
        boundary_type: "Village Boundary Pillar" as const,
      },
      geometry: { type: "Point" as const, coordinates },
    })),
  ],
};

export const adminCollection: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Panchkula District Boundary",
        category: "Administrative Boundary",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [76.745, 30.919],
            [77.087, 30.92],
            [77.125, 30.775],
            [77.037, 30.616],
            [76.761, 30.639],
            [76.705, 30.798],
            [76.745, 30.919],
          ],
        ],
      },
    },
  ],
};
