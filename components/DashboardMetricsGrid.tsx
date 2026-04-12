"use client";

import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  MapPinned,
  Trees,
} from "lucide-react";

import MetricCard from "@/components/MetricCard";
import type { DashboardMetric } from "@/data/dashboardMock";

interface DashboardMetricsGridProps {
  metrics: DashboardMetric[];
}

const metricIcons = [Trees, MapPinned, Building2, CheckCircle2, AlertTriangle];

export default function DashboardMetricsGrid({
  metrics,
}: DashboardMetricsGridProps) {
  return (
    <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
      {metrics.map((metric, index) => {
        const Icon = metricIcons[index];

        return (
          <MetricCard
            key={metric.label}
            icon={Icon}
            label={metric.label}
            value={metric.value}
            helper={metric.helper}
            tone={metric.tone}
          />
        );
      })}
    </section>
  );
}
