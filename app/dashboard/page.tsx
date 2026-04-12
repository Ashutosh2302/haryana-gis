import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { requirePortalAuth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Haryana Forest Analytics Dashboard",
  description:
    "State-level analytics dashboard for forest survey and demarcation monitoring in Haryana.",
};

export default async function DashboardPage() {
  await requirePortalAuth();

  redirect("/canvas");
}
