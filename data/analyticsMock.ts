"use client";

import type { MapSelection, PillarStatus } from "@/types/gis";

export type AnalyticsTone = "emerald" | "amber" | "sky" | "slate";

export interface AnalyticsMetricData {
  label: string;
  value: string;
  helper: string;
  tone: AnalyticsTone;
}

export interface SurveyStatusDatum {
  name: PillarStatus;
  value: number;
  color: string;
}

export interface PillarsByVillageDatum {
  name: string;
  pillars: number;
}

export interface TimelineDatum {
  month: string;
  completed: number;
}

export interface InfoRow {
  label: string;
  value: string;
}

export interface AnalyticsPanelData {
  entityLabel: string;
  title: string;
  subtitle: string;
  description: string;
  completionRate: number;
  metrics: AnalyticsMetricData[];
  surveyStatus: SurveyStatusDatum[];
  pillarsByVillage: PillarsByVillageDatum[];
  timeline: TimelineDatum[];
  infoRows: InfoRow[];
  focusRows: InfoRow[];
}

interface AnalyticsProfile {
  totalPillars: number;
  verified: number;
  pending: number;
  disputed: number;
  forestAreaHa: number;
  villagesCovered: number;
  pillarsByVillage: PillarsByVillageDatum[];
  timeline: TimelineDatum[];
  infoRows: InfoRow[];
}

const surveyStatusColors: Record<PillarStatus, string> = {
  Verified: "#16a34a",
  Pending: "#f59e0b",
  Disputed: "#dc2626",
};

const analyticsProfiles: Record<string, AnalyticsProfile> = {
  morni: {
    totalPillars: 42,
    verified: 30,
    pending: 8,
    disputed: 4,
    forestAreaHa: 1240,
    villagesCovered: 5,
    pillarsByVillage: [
      { name: "Morni", pillars: 42 },
      { name: "Pinjore", pillars: 34 },
      { name: "Kalka", pillars: 29 },
      { name: "Raipur Rani", pillars: 24 },
      { name: "Bhoj Koti", pillars: 18 },
    ],
    timeline: [
      { month: "Jan", completed: 8 },
      { month: "Feb", completed: 16 },
      { month: "Mar", completed: 24 },
      { month: "Apr", completed: 30 },
    ],
    infoRows: [
      { label: "Range Office", value: "Morni Forest Range" },
      { label: "Jurisdiction", value: "Panchkula District" },
      { label: "Last Joint Inspection", value: "08 Apr 2026" },
      { label: "Data Confidence", value: "High spatial alignment" },
    ],
  },
  bhojKoti: {
    totalPillars: 28,
    verified: 19,
    pending: 6,
    disputed: 3,
    forestAreaHa: 860,
    villagesCovered: 3,
    pillarsByVillage: [
      { name: "Bhoj Koti", pillars: 28 },
      { name: "Morni", pillars: 24 },
      { name: "Tikkar Tal", pillars: 17 },
      { name: "Dhaman", pillars: 14 },
    ],
    timeline: [
      { month: "Jan", completed: 5 },
      { month: "Feb", completed: 10 },
      { month: "Mar", completed: 15 },
      { month: "Apr", completed: 19 },
    ],
    infoRows: [
      { label: "Range Office", value: "Morni Forest Range" },
      { label: "Jurisdiction", value: "Panchkula District" },
      { label: "Last Joint Inspection", value: "04 Apr 2026" },
      { label: "Data Confidence", value: "Moderate field validation" },
    ],
  },
  yamunanagar: {
    totalPillars: 31,
    verified: 21,
    pending: 7,
    disputed: 3,
    forestAreaHa: 2140,
    villagesCovered: 4,
    pillarsByVillage: [
      { name: "Sadhaura", pillars: 18 },
      { name: "Jagadhri", pillars: 20 },
      { name: "Bilaspur", pillars: 16 },
      { name: "Chhachhrauli", pillars: 13 },
    ],
    timeline: [
      { month: "Jan", completed: 6 },
      { month: "Feb", completed: 11 },
      { month: "Mar", completed: 17 },
      { month: "Apr", completed: 21 },
    ],
    infoRows: [
      { label: "Range Office", value: "Yamunanagar Forest Circle" },
      { label: "Jurisdiction", value: "Yamunanagar District" },
      { label: "Last Joint Inspection", value: "06 Apr 2026" },
      { label: "Data Confidence", value: "Targeted dispute review active" },
    ],
  },
  sadhaura: {
    totalPillars: 18,
    verified: 12,
    pending: 4,
    disputed: 2,
    forestAreaHa: 970,
    villagesCovered: 3,
    pillarsByVillage: [
      { name: "Sadhaura", pillars: 18 },
      { name: "Chhachhrauli", pillars: 12 },
      { name: "Mustafabad", pillars: 10 },
    ],
    timeline: [
      { month: "Jan", completed: 4 },
      { month: "Feb", completed: 7 },
      { month: "Mar", completed: 10 },
      { month: "Apr", completed: 12 },
    ],
    infoRows: [
      { label: "Range Office", value: "Sadhaura Beat" },
      { label: "Jurisdiction", value: "Yamunanagar District" },
      { label: "Last Joint Inspection", value: "31 Mar 2026" },
      { label: "Data Confidence", value: "Dispute review scheduled" },
    ],
  },
  jagadhri: {
    totalPillars: 20,
    verified: 15,
    pending: 3,
    disputed: 2,
    forestAreaHa: 1110,
    villagesCovered: 4,
    pillarsByVillage: [
      { name: "Jagadhri", pillars: 20 },
      { name: "Bilaspur", pillars: 14 },
      { name: "Sadhaura", pillars: 11 },
      { name: "Radaur", pillars: 9 },
    ],
    timeline: [
      { month: "Jan", completed: 5 },
      { month: "Feb", completed: 9 },
      { month: "Mar", completed: 12 },
      { month: "Apr", completed: 15 },
    ],
    infoRows: [
      { label: "Range Office", value: "Jagadhri Survey Unit" },
      { label: "Jurisdiction", value: "Yamunanagar District" },
      { label: "Last Joint Inspection", value: "02 Apr 2026" },
      { label: "Data Confidence", value: "High alignment with record map" },
    ],
  },
  bilaspur: {
    totalPillars: 16,
    verified: 10,
    pending: 4,
    disputed: 2,
    forestAreaHa: 890,
    villagesCovered: 2,
    pillarsByVillage: [
      { name: "Bilaspur", pillars: 16 },
      { name: "Jagadhri", pillars: 12 },
      { name: "Sadhaura", pillars: 8 },
    ],
    timeline: [
      { month: "Jan", completed: 3 },
      { month: "Feb", completed: 6 },
      { month: "Mar", completed: 8 },
      { month: "Apr", completed: 10 },
    ],
    infoRows: [
      { label: "Range Office", value: "Bilaspur Survey Unit" },
      { label: "Jurisdiction", value: "Yamunanagar District" },
      { label: "Last Joint Inspection", value: "29 Mar 2026" },
      { label: "Data Confidence", value: "Partial pending ground-truthing" },
    ],
  },
};

function formatNumber(value: number) {
  return value.toLocaleString("en-IN");
}

function formatSurveyDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getProfileKey(selection: MapSelection) {
  switch (selection.kind) {
    case "forest":
      if (selection.forest.name.includes("Morni")) {
        return "morni";
      }
      if (selection.forest.name.includes("Yamunanagar")) {
        return "yamunanagar";
      }
      return "morni";
    case "village":
      if (selection.village.name.includes("Bhoj Koti")) {
        return "bhojKoti";
      }
      if (selection.village.name.includes("Morni")) {
        return "morni";
      }
      return "morni";
    case "forestPillar":
    case "villagePillar":
      if (selection.pillar.village.includes("Bhoj Koti")) {
        return "bhojKoti";
      }
      if (selection.pillar.village.includes("Sadhaura")) {
        return "sadhaura";
      }
      if (selection.pillar.village.includes("Jagadhri")) {
        return "jagadhri";
      }
      if (selection.pillar.village.includes("Bilaspur")) {
        return "bilaspur";
      }
      if (selection.pillar.village.includes("Morni")) {
        return "morni";
      }
      return "yamunanagar";
  }
}

function buildMetrics(
  selection: MapSelection,
  profile: AnalyticsProfile,
): AnalyticsMetricData[] {
  const completionRate = Math.round((profile.verified / profile.totalPillars) * 100);

  if (selection.kind === "forestPillar") {
    return [
      {
        label: "Pillar Status",
        value: selection.pillar.status,
        helper: "Latest field verification state for this demarcation pillar",
        tone: selection.pillar.status === "Verified"
          ? "emerald"
          : selection.pillar.status === "Pending"
            ? "amber"
            : "slate",
      },
      {
        label: "Survey Reference",
        value: selection.pillar.survey_no,
        helper: "Primary survey number linked to this pillar record",
        tone: "sky",
      },
      {
        label: "Inspection Date",
        value: formatSurveyDate(selection.pillar.survey_date),
        helper: "Most recent field visit captured in the GIS record",
        tone: "slate",
      },
      {
        label: "Linked Cluster",
        value: selection.pillar.village,
        helper: `${completionRate}% completion across the related pillar cluster`,
        tone: "amber",
      },
    ];
  }

  if (selection.kind === "villagePillar") {
    return [
      {
        label: "Pillar Status",
        value: selection.pillar.status,
        helper: "Latest field verification state for this village boundary pillar",
        tone: selection.pillar.status === "Verified"
          ? "emerald"
          : selection.pillar.status === "Pending"
            ? "amber"
            : "slate",
      },
      {
        label: "Boundary Type",
        value: selection.pillar.boundary_type,
        helper: "Classification used for settlement and parcel monitoring",
        tone: "sky",
      },
      {
        label: "Survey Reference",
        value: selection.pillar.survey_no,
        helper: "Village parcel survey number tied to this point",
        tone: "slate",
      },
      {
        label: "Linked Village",
        value: selection.pillar.village,
        helper: `${completionRate}% completion across the related boundary cluster`,
        tone: "amber",
      },
    ];
  }

  return [
    {
      label: "Total Pillars",
      value: formatNumber(profile.totalPillars),
      helper: "Demarcation references in active scope",
      tone: "sky",
    },
    {
      label: "Forest Area",
      value: `${formatNumber(profile.forestAreaHa)} ha`,
      helper: "Mapped area under current review",
      tone: "emerald",
    },
    {
      label: "Villages Covered",
      value: formatNumber(profile.villagesCovered),
      helper: "Revenue villages linked to this cluster",
      tone: "slate",
    },
    {
      label: "Survey Completion",
      value: `${completionRate}%`,
      helper: `${formatNumber(profile.verified)} pillars field-verified`,
      tone: "amber",
    },
  ];
}

function buildSurveyStatus(profile: AnalyticsProfile): SurveyStatusDatum[] {
  return [
    {
      name: "Verified",
      value: profile.verified,
      color: surveyStatusColors.Verified,
    },
    {
      name: "Pending",
      value: profile.pending,
      color: surveyStatusColors.Pending,
    },
    {
      name: "Disputed",
      value: profile.disputed,
      color: surveyStatusColors.Disputed,
    },
  ];
}

function buildFocusRows(selection: MapSelection): InfoRow[] {
  switch (selection.kind) {
    case "forest":
      return [
        { label: "Division", value: selection.forest.division },
        { label: "Forest Area", value: `${formatNumber(selection.forest.area_ha)} ha` },
        { label: "Measured Perimeter", value: `${selection.perimeterKm.toFixed(2)} km` },
        { label: "Boundary Pillars", value: formatNumber(selection.boundaryPillars) },
      ];
    case "village":
      return [
        { label: "Tehsil", value: selection.village.tehsil },
        { label: "District", value: selection.village.district },
        { label: "Measured Perimeter", value: `${selection.perimeterKm.toFixed(2)} km` },
        { label: "Settlement Stage", value: selection.village.settlement_stage },
      ];
    case "forestPillar":
      return [
        { label: "Pillar ID", value: selection.pillar.id },
        { label: "Status", value: selection.pillar.status },
        { label: "Survey No.", value: selection.pillar.survey_no },
        { label: "Survey Date", value: selection.pillar.survey_date },
      ];
    case "villagePillar":
      return [
        { label: "Pillar ID", value: selection.pillar.id },
        { label: "Boundary Type", value: selection.pillar.boundary_type },
        { label: "Status", value: selection.pillar.status },
        { label: "Survey Date", value: selection.pillar.survey_date },
      ];
  }
}

function buildInfoRows(
  selection: MapSelection,
  profile: AnalyticsProfile,
): InfoRow[] {
  const completionRate = Math.round((profile.verified / profile.totalPillars) * 100);

  if (selection.kind === "forestPillar") {
    return [
      { label: "Village", value: selection.pillar.village },
      { label: "District", value: selection.pillar.district },
      { label: "Cluster Completion", value: `${completionRate}%` },
      { label: "Review Note", value: "Use surrounding charts for related cluster context." },
    ];
  }

  if (selection.kind === "villagePillar") {
    return [
      { label: "Village", value: selection.pillar.village },
      { label: "District", value: selection.pillar.district },
      { label: "Boundary Type", value: selection.pillar.boundary_type },
      { label: "Review Note", value: "Village-level charts below show linked parcel progress." },
    ];
  }

  return profile.infoRows;
}

function buildHeader(selection: MapSelection) {
  switch (selection.kind) {
    case "forest":
      return {
        entityLabel: "Forest Analytics",
        title: selection.forest.name,
        subtitle: selection.forest.division,
        description:
          "Aggregated demarcation performance for the selected forest boundary, combining verification status, active survey load, and nearby village spread.",
      };
    case "village":
      return {
        entityLabel: "Village Analytics",
        title: selection.village.name,
        subtitle: `${selection.village.tehsil}, ${selection.village.district}`,
        description:
          "Village-level demarcation dashboard summarizing pillar verification, parcel-linked forest area, and operational progress for settlement review.",
      };
    case "forestPillar":
      return {
        entityLabel: "Pillar Analytics",
        title: selection.pillar.id,
        subtitle: `${selection.pillar.village}, ${selection.pillar.district}`,
        description:
          "Selected pillar details with surrounding cluster performance to support on-ground verification, dispute screening, and supervisory review.",
      };
    case "villagePillar":
      return {
        entityLabel: "Village Pillar Analytics",
        title: selection.pillar.id,
        subtitle: `${selection.pillar.village}, ${selection.pillar.district}`,
        description:
          "Village boundary pillar dashboard with linked survey status and nearby parcel metrics for settlement and demarcation monitoring.",
      };
  }
}

export function getAnalyticsPanelData(selection: MapSelection): AnalyticsPanelData {
  const profile = analyticsProfiles[getProfileKey(selection)] ?? analyticsProfiles.morni;
  const completionRate = Math.round((profile.verified / profile.totalPillars) * 100);
  const header = buildHeader(selection);

  return {
    ...header,
    completionRate,
    metrics: buildMetrics(selection, profile),
    surveyStatus: buildSurveyStatus(profile),
    pillarsByVillage: profile.pillarsByVillage,
    timeline: profile.timeline,
    infoRows: buildInfoRows(selection, profile),
    focusRows: buildFocusRows(selection),
  };
}
