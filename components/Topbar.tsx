"use client";

import { BadgeCheck, Search, Sparkles } from "lucide-react";

interface TopbarProps {
  query: string;
  searchMessage: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
}

export default function Topbar({
  query,
  searchMessage,
  onQueryChange,
  onSearch,
}: TopbarProps) {
  return (
    <header className="rounded-[28px] border border-slate-200/80 bg-white/95 px-6 py-5 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              <Sparkles className="h-3.5 w-3.5" />
              Pilot Demo
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <BadgeCheck className="h-3.5 w-3.5" />
              Forest Settlement Officer, Government of Haryana
            </span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 xl:text-[30px]">
            Haryana Forest Survey &amp; Demarcation GIS Portal
          </h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
            Spatial review interface for boundary verification, pillar tracking,
            and field survey monitoring across forest settlement jurisdictions in
            Haryana.
          </p>
        </div>

        <div className="xl:w-[420px]">
          <div className="flex items-center gap-3 rounded-[24px] border border-slate-200 bg-slate-50/90 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm">
              <Search className="h-4.5 w-4.5" />
            </div>
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onSearch();
                }
              }}
              placeholder="Search by Village / Pillar ID / Survey No"
              className="h-12 w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={onSearch}
              className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Search
            </button>
          </div>
          <p className="mt-3 pl-2 text-sm text-slate-500">{searchMessage}</p>
        </div>
      </div>
    </header>
  );
}
