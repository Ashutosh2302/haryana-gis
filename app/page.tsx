import type { Metadata } from "next";
import { redirect } from "next/navigation";

// import LoginPageContent from "@/components/LoginPageContent";
// import { redirectAuthenticatedUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Haryana Forest Analytics Canvas",
  description:
    "Executive canvas dashboard for Haryana forest survey and demarcation monitoring.",
};

export default async function Home() {
  // await redirectAuthenticatedUser();
  // return <LoginPageContent />;
  redirect("/canvas");
}
