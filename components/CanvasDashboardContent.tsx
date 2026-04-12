import AnalyticsBarChart from "@/components/BarChart";
import DataTable from "@/components/DataTable";
import DashboardMetricsGrid from "@/components/DashboardMetricsGrid";
import AnalyticsLineChart from "@/components/LineChart";
import AnalyticsPieChart from "@/components/PieChart";
import PortalNavigation from "@/components/PortalNavigation";
import {
  dashboardMetrics,
  districtBreakdown,
  pillarsByDistrict,
  surveyProgressTimeline,
  stateSurveyStatus,
} from "@/data/dashboardMock";

export default function CanvasDashboardContent() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#edf4fb_0%,_#f8fafc_44%,_#eef2f7_100%)] px-4 py-4 lg:px-6 lg:py-6">
      <div className="mx-auto max-w-[1500px]">
        <section className="relative overflow-hidden rounded-[34px] border border-white/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98)_0%,_rgba(248,250,252,0.98)_100%)] p-6 shadow-[0_35px_90px_-46px_rgba(15,23,42,0.45)] lg:p-8">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(34,197,94,0.14),_transparent_36%)]" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                State Command Dashboard
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 lg:text-4xl">
                Haryana Forest Analytics Dashboard
              </h1>
              <p className="mt-3 text-lg font-medium text-slate-600">
                Forest Settlement Officer, Government of Haryana
              </p>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600">
                Executive monitoring view for statewide forest settlement, demarcation
                progress, and district-level survey performance. Built for review meetings,
                supervisory follow-up, and operational decision-making.
              </p>
            </div>

            <div className="flex flex-col items-start gap-4 lg:items-end">
              <PortalNavigation variant="dark" />
              <div className="rounded-[24px] border border-slate-200/80 bg-white/88 px-4 py-4 shadow-[0_22px_50px_-40px_rgba(15,23,42,0.3)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Review Focus
                </p>
                <p className="mt-2 text-base font-semibold text-slate-950">
                  Panchkula and Yamunanagar are leading current field verification output.
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Pending load remains concentrated in Ambala and Kurukshetra dispute review.
                </p>
              </div>
            </div>
          </div>
        </section>

        <DashboardMetricsGrid metrics={dashboardMetrics} />

        <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_1.05fr_1.3fr]">
          <AnalyticsPieChart
            data={stateSurveyStatus}
            eyebrow="Survey Status"
            title="Statewide verification mix"
            badge="1,240 mapped pillars"
            centerLabel="State"
            tooltipSuffix="records"
          />
          <AnalyticsBarChart
            data={pillarsByDistrict}
            eyebrow="District Comparison"
            title="Pillars by district"
            badge="District spread"
            tooltipLabel="pillars mapped in the district"
          />
          <AnalyticsLineChart
            data={surveyProgressTimeline}
            eyebrow="Survey Progress"
            title="Monthly completion vs target"
            badge="Nov 2025 to Apr 2026"
          />
        </section>

        <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[1.55fr_0.85fr]">
          <DataTable rows={districtBreakdown} />

          <div className="rounded-[30px] border border-slate-200/80 bg-white p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.42)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Executive Notes
            </p>
            <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-950">
              State-level monitoring highlights
            </h3>

            <div className="mt-5 space-y-3">
              <div className="rounded-[24px] border border-emerald-100 bg-emerald-50/80 p-4">
                <p className="text-sm font-semibold text-emerald-900">
                  Verification lead
                </p>
                <p className="mt-2 text-sm leading-6 text-emerald-800">
                  Panchkula has crossed 300 verified pillar references, reflecting sustained
                  joint field coverage and faster record reconciliation.
                </p>
              </div>

              <div className="rounded-[24px] border border-amber-100 bg-amber-50/80 p-4">
                <p className="text-sm font-semibold text-amber-900">
                  Pending review pressure
                </p>
                <p className="mt-2 text-sm leading-6 text-amber-800">
                  Ambala and Kurukshetra require focused review camps to reduce pending
                  parcel verification and accelerate settlement closure.
                </p>
              </div>

              <div className="rounded-[24px] border border-sky-100 bg-sky-50/80 p-4">
                <p className="text-sm font-semibold text-sky-900">
                  Action recommended
                </p>
                <p className="mt-2 text-sm leading-6 text-sky-800">
                  Prioritize cross-department inspection scheduling for disputed corridors and
                  align district teams against the April completion target.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
