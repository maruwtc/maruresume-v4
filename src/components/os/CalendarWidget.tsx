"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export function CalendarWidget({ dark, glassCard }: { dark: boolean; glassCard: string }) {
  const today = new Date();
  const [view, setView] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year  = view.getFullYear();
  const month = view.getMonth();

  const firstWeekday  = new Date(year, month, 1).getDay();
  const daysInMonth   = new Date(year, month + 1, 0).getDate();

  // Build cell array: leading nulls + day numbers
  const cells: (number | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to full rows
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (d: number | null) =>
    d !== null &&
    d === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const text     = dark ? "text-white"       : "text-slate-900";
  const mutedTxt = dark ? "text-white/45"    : "text-slate-400";
  const otherTxt = dark ? "text-white/70"    : "text-slate-700";

  return (
    <div className={`w-full h-full flex flex-col rounded-2xl p-4 ${glassCard}`}>

      {/* Month navigation */}
      <div className={`flex items-center justify-between mb-3 ${text}`}>
        <button
          type="button"
          onClick={() => setView(new Date(year, month - 1, 1))}
          className="h-8 w-8 flex items-center justify-center rounded-full transition-opacity active:opacity-50"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
        </button>

        <span className="text-[0.95rem] font-semibold tracking-tight">
          {MONTHS[month]} {year}
        </span>

        <button
          type="button"
          onClick={() => setView(new Date(year, month + 1, 1))}
          className="h-8 w-8 flex items-center justify-center rounded-full transition-opacity active:opacity-50"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className={`text-center text-[0.68rem] font-semibold uppercase tracking-wide py-1 ${mutedTxt}`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells — flex-1 so they expand to fill remaining height */}
      <div className="grid grid-cols-7 flex-1">
        {cells.map((day, i) => (
          <div
            key={i}
            className="flex items-center justify-center"
          >
            {day !== null && (
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-[0.85rem] font-medium select-none
                  ${isToday(day)
                    ? "bg-blue-500 text-white font-semibold"
                    : otherTxt
                  }`}
              >
                {day}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
