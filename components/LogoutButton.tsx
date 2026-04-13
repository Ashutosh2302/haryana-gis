"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";

type LogoutButtonProps = {
  /** Map sidebar: icon-only when collapsed */
  collapsed?: boolean;
  /** Preset styling */
  layout?: "sidebar" | "dashboard";
};

export default function LogoutButton({
  collapsed = false,
  layout = "sidebar",
}: LogoutButtonProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/logout", { method: "POST" });
    } finally {
      router.replace("/");
      router.refresh();
      setIsLoggingOut(false);
    }
  };

  if (layout === "dashboard") {
    return (
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-3.5 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-white hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LogOut className="h-4 w-4" aria-hidden />
        <span>{isLoggingOut ? "Logging out…" : "Logout"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      title="Log out"
      aria-label={isLoggingOut ? "Logging out" : "Log out"}
      className={
        collapsed
          ? "mx-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          : "flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-2.5 text-left text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 md:py-3"
      }
    >
      <LogOut
        className={`shrink-0 ${collapsed ? "h-5 w-5" : "h-[1.15rem] w-[1.15rem] md:h-5 md:w-5"}`}
        aria-hidden
      />
      {!collapsed ? (
        <span>{isLoggingOut ? "Logging out…" : "Log out"}</span>
      ) : null}
    </button>
  );
}
