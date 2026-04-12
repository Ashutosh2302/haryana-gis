import type { Metadata } from "next";

import CanvasDashboardContent from "@/components/CanvasDashboardContent";
import { requirePortalAuth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Haryana Forest Analytics Canvas",
  description:
    "Executive canvas dashboard for Haryana forest survey and demarcation monitoring.",
};

export default async function CanvasPage() {
  await requirePortalAuth();

  return <CanvasDashboardContent />;
}
