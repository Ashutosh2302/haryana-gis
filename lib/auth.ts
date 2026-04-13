import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const AUTH_COOKIE_NAME = "haryana_portal_session";
export const AUTH_COOKIE_VALUE = "authenticated";

export async function hasPortalSession() {
  const cookieStore = await cookies();

  return cookieStore.get(AUTH_COOKIE_NAME)?.value === AUTH_COOKIE_VALUE;
}

export async function requirePortalAuth() {
  // if (!(await hasPortalSession())) {
  //   redirect("/");
  // }
}

export async function redirectAuthenticatedUser() {
  if (await hasPortalSession()) {
    redirect("/canvas");
  }
}
