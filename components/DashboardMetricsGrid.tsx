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
    <section className="mt-6 grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-x-4 lg:gap-y-4">
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
