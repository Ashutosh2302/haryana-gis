"use client";

import { Search } from "lucide-react";

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
    <div className="pointer-events-auto w-full max-w-[460px] rounded-[28px] border border-white/70 bg-white/94 p-3 shadow-[0_24px_60px_-34px_rgba(15,23,42,0.45)] backdrop-blur md:max-w-[500px]">
      <div className="flex items-center gap-3 rounded-[22px] border border-slate-200 bg-slate-50/95 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
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
      <p className="mt-2 px-2 text-sm text-slate-500">{searchMessage}</p>
    </div>
  );
}
