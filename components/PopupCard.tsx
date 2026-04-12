"use client";

import Image from "next/image";
import { CalendarDays, Landmark, MapPinned, ShieldCheck } from "lucide-react";

import type { PillarProperties } from "@/types/gis";

const statusStyles = {
  Verified: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  Disputed: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
} satisfies Record<PillarProperties["status"], string>;

interface PopupCardProps {
  pillar: PillarProperties;
}

export default function PopupCard({ pillar }: PopupCardProps) {
  return (
    <div className="w-[296px] overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_24px_60px_-28px_rgba(15,23,42,0.45)]">
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-5 py-4 text-white">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
              Demarcation Pillar
            </p>
            <h3 className="mt-1 text-lg font-semibold tracking-tight">
              {pillar.id}
            </h3>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statusStyles[pillar.status]}`}
          >
            {pillar.status}
          </span>
        </div>
        <p className="text-sm text-slate-300">
          Field-verified survey reference for forest settlement review.
        </p>
      </div>

      <div className="space-y-4 p-5">
        <Image
          src={pillar.image_url}
          alt={`${pillar.id} reference`}
          width={640}
          height={400}
          className="h-32 w-full rounded-2xl border border-slate-200 object-cover"
        />

        <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
          <div className="rounded-2xl bg-slate-50 px-3 py-3">
            <div className="mb-1 flex items-center gap-2 text-slate-500">
              <MapPinned className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Village
              </span>
            </div>
            <p className="font-semibold text-slate-900">{pillar.village}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 px-3 py-3">
            <div className="mb-1 flex items-center gap-2 text-slate-500">
              <Landmark className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">
                District
              </span>
            </div>
            <p className="font-semibold text-slate-900">{pillar.district}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 px-3 py-3">
            <div className="mb-1 flex items-center gap-2 text-slate-500">
              <CalendarDays className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Survey Date
              </span>
            </div>
            <p className="font-semibold text-slate-900">{pillar.survey_date}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 px-3 py-3">
            <div className="mb-1 flex items-center gap-2 text-slate-500">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Survey No
              </span>
            </div>
            <p className="font-semibold text-slate-900">{pillar.survey_no}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
