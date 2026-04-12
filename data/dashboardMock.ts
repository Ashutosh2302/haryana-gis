import type { AnalyticsTone, SurveyStatusDatum } from "@/data/analyticsMock";

export interface DashboardMetric {
  label: string;
  value: string;
  helper: string;
  tone: AnalyticsTone;
}

export interface DistrictBarDatum {
  name: string;
  pillars: number;
}

export interface DashboardProgressDatum {
  month: string;
  completed: number;
  target: number;
}

export interface DistrictTableRow {
  district: string;
  forestAreaHa: number;
  totalPillars: number;
  verified: number;
  pending: number;
}

export const dashboardMetrics: DashboardMetric[] = [
  {
    label: "Total Forest Area",
    value: "12,540 ha",
    helper: "Forest settlement area under active GIS monitoring",
    tone: "emerald",
  },
  {
    label: "Total Pillars Mapped",
    value: "1,240",
    helper: "Field and parcel reference pillars captured in the system",
    tone: "sky",
  },
  {
    label: "Villages Covered",
    value: "85",
    helper: "Revenue villages linked to forest demarcation activity",
    tone: "slate",
  },
  {
    label: "Survey Completion",
    value: "78%",
    helper: "Current statewide verification progress against plan",
    tone: "amber",
  },
  {
    label: "Pending Cases",
    value: "120",
    helper: "Cases awaiting verification, review, or dispute resolution",
    tone: "slate",
  },
];

export const stateSurveyStatus: SurveyStatusDatum[] = [
  { name: "Verified", value: 820, color: "#16a34a" },
  { name: "Pending", value: 280, color: "#f59e0b" },
  { name: "Disputed", value: 140, color: "#dc2626" },
];

export const pillarsByDistrict: DistrictBarDatum[] = [
  { name: "Panchkula", pillars: 420 },
  { name: "Yamunanagar", pillars: 365 },
  { name: "Ambala", pillars: 295 },
  { name: "Kurukshetra", pillars: 160 },
];

export const surveyProgressTimeline: DashboardProgressDatum[] = [
  { month: "Nov", completed: 42, target: 48 },
  { month: "Dec", completed: 49, target: 55 },
  { month: "Jan", completed: 58, target: 64 },
  { month: "Feb", completed: 66, target: 71 },
  { month: "Mar", completed: 73, target: 77 },
  { month: "Apr", completed: 78, target: 82 },
];

export const districtBreakdown: DistrictTableRow[] = [
  {
    district: "Panchkula",
    forestAreaHa: 4380,
    totalPillars: 420,
    verified: 310,
    pending: 72,
  },
  {
    district: "Yamunanagar",
    forestAreaHa: 3760,
    totalPillars: 365,
    verified: 252,
    pending: 81,
  },
  {
    district: "Ambala",
    forestAreaHa: 2510,
    totalPillars: 295,
    verified: 192,
    pending: 68,
  },
  {
    district: "Kurukshetra",
    forestAreaHa: 1890,
    totalPillars: 160,
    verified: 66,
    pending: 59,
  },
];
