"use client";

import { useRef } from "react";
import { Search } from "lucide-react";

import PortalNavigation from "@/components/PortalNavigation";

interface TopbarProps {
  query: string;
  searchMessage: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
  /** When the map detail panel is open, use a narrower search strip so the bar stays clear of it. */
  detailPanelOpen?: boolean;
}

export default function Topbar({
  query,
  searchMessage,
  onQueryChange,
  onSearch,
  detailPanelOpen = false,
}: TopbarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  /* Fixed width so the field doesn’t balloon or collapse; narrower when detail panel is open. */
  const searchWidthClass = detailPanelOpen
    ? "w-[11.5rem] sm:w-[12.5rem]"
    : "w-[12.5rem] sm:w-[14rem] md:w-[15rem]";

  const handleSearchStripClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button")) {
      return;
    }
    inputRef.current?.focus();
  };

  return (
    <div className="pointer-events-auto w-fit max-w-full rounded-[1.5rem] border border-white/70 bg-white/92 p-1.5 shadow-[0_20px_50px_-34px_rgba(15,23,42,0.42)] backdrop-blur md:p-2">
      <div
        className="flex min-w-0 flex-nowrap items-stretch gap-1.5 md:gap-2"
        title={searchMessage}
      >
        <div className="shrink-0">
          <PortalNavigation />
        </div>
        <div
          role="search"
          className={`flex min-h-10 shrink-0 cursor-text items-center gap-1 rounded-[1.25rem] border border-slate-200 bg-slate-50/95 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] md:min-h-11 md:gap-1.5 md:p-1.5 ${searchWidthClass}`}
          onClick={handleSearchStripClick}
        >
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onSearch();
              }
            }}
            placeholder="Village, pillar ID…"
            className="h-9 min-w-0 w-0 flex-1 cursor-text bg-transparent pl-1.5 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 md:h-10 md:pl-2"
            aria-label="Search map features"
            aria-describedby="topbar-search-hint"
          />
          <button
            type="button"
            onClick={() => onSearch()}
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 md:h-9 md:w-9 md:rounded-2xl"
            aria-label="Run search"
          >
            <Search className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
      <p id="topbar-search-hint" className="sr-only">
        {searchMessage}
      </p>
    </div>
  );
}
