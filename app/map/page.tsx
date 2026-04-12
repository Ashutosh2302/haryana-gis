import type { Metadata } from "next";

import MapPageContent from "@/components/MapPageContent";
import { requirePortalAuth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Haryana GIS Map View",
  description:
    "Interactive Web GIS map for Haryana forest survey and demarcation operations.",
};

export default async function MapPage() {
  await requirePortalAuth();

  return <MapPageContent />;
}
