import type { Metadata } from "next";

import LoginPageContent from "@/components/LoginPageContent";
import { redirectAuthenticatedUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Haryana GIS Secure Login",
  description:
    "Secure login for the Haryana Forest Survey & Demarcation GIS Portal.",
};

export default async function Home() {
  await redirectAuthenticatedUser();

  return <LoginPageContent />;
}
