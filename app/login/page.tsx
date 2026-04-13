import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Haryana GIS Secure Login",
  description:
    "Secure login for the Haryana Forest Survey & Demarcation GIS Portal.",
};

export default function LoginPage() {
  // redirect("/");
  redirect("/canvas");
}
