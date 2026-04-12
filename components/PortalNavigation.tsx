"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, LogOut, Map } from "lucide-react";
import { useState } from "react";

interface PortalNavigationProps {
  variant?: "light" | "dark";
}

const navigationItems = [
  { href: "/map", label: "Map View", icon: Map },
  { href: "/canvas", label: "Dashboard", icon: BarChart3 },
];

export default function PortalNavigation({
  variant = "light",
}: PortalNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isDark = variant === "dark";
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await fetch("/api/logout", {
        method: "POST",
      });
    } finally {
      router.replace("/");
      router.refresh();
      setIsLoggingOut(false);
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-[20px] border p-1.5 ${
        isDark
          ? "border-slate-200/70 bg-white/88 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.25)]"
          : "border-white/75 bg-white/82 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.24)] backdrop-blur"
      }`}
    >
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`inline-flex items-center gap-2 rounded-2xl px-3.5 py-2 text-sm font-semibold transition ${
              active
                ? "bg-slate-950 text-white shadow-[0_14px_32px_-20px_rgba(15,23,42,0.55)]"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="inline-flex items-center gap-2 rounded-2xl px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LogOut className="h-4 w-4" />
        <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
      </button>
    </div>
  );
}
