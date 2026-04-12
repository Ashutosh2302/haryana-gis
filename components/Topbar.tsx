"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

import PortalNavigation from "@/components/PortalNavigation";

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
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="pointer-events-auto w-full max-w-[560px] rounded-[24px] border border-white/70 bg-white/92 p-2.5 shadow-[0_20px_50px_-34px_rgba(15,23,42,0.42)] backdrop-blur md:max-w-[620px]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <PortalNavigation />
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white hover:text-slate-950"
            aria-expanded={expanded}
            aria-label={
              expanded ? "Collapse search panel" : "Expand search panel"
            }
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">
              {expanded ? "Hide Search" : "Search"}
            </span>
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {expanded ? (
        <>
          <div className="mt-3 flex items-center gap-2 rounded-[20px] border border-slate-200 bg-slate-50/95 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm">
              <Search className="h-4 w-4" />
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
              className="h-11 w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={onSearch}
              className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Search
            </button>
          </div>
          <p className="mt-2 px-1 text-xs text-slate-500">{searchMessage}</p>
        </>
      ) : null}
    </div>
  );
}
