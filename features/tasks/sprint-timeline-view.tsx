"use client";

import { useMemo, useState } from "react";
import {
  addDays,
  addWeeks,
  differenceInDays,
  format,
  getYear,
  parseISO,
  startOfDay,
  startOfWeek,
} from "date-fns";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pencil, MoreVertical, Trash2, X } from "lucide-react";

type ViewMode = "week" | "month";

export type SprintItem = {
  id?: string;
  name: string;
  start: string;
  end: string;
  state?: string;
};

interface SprintTimelineViewProps {
  sprints: SprintItem[];
  isLeader?: boolean;
  onEditSprint?: (sprint: SprintItem) => void;
  onDeleteSprint?: (sprint: SprintItem) => void;
}

/** Parse date string (ISO hoặc yyyy-MM-dd) thành Date */
function parseDate(str: string | undefined): Date | null {
  if (!str) return null;
  try {
    const d = str.includes("T") ? parseISO(str) : new Date(str + "T00:00:00");
    return Number.isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}

const MONTH_NAMES = ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"];

function getSprintBarColors(state?: string) {
  switch (state) {
    case "active":
      return "bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-400";
    case "closed":
      return "bg-slate-500 hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-500";
    case "future":
      return "bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-400";
    default:
      return "bg-[#0052CC] hover:bg-[#0747A6] dark:bg-blue-500 dark:hover:bg-blue-400";
  }
}

function getStateBadgeColors(state?: string) {
  switch (state) {
    case "active":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300";
    case "closed":
      return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
    case "future":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
  }
}

export function SprintTimelineView({ sprints, isLeader = false, onEditSprint, onDeleteSprint }: SprintTimelineViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [zoomedSprint, setZoomedSprint] = useState<SprintItem | null>(null);

  const parsedSprints = useMemo(() => {
    return sprints
      .map((s) => {
        const start = parseDate(s.start) ?? new Date();
        const end = parseDate(s.end) ?? addDays(start, 14);
        return {
          ...s,
          startDate: startOfDay(start),
          endDate: startOfDay(end),
        };
      })
      .filter((s) => s.startDate && s.endDate);
  }, [sprints]);

  const timelineRange = useMemo(() => {
    if (parsedSprints.length === 0) {
      const now = new Date();
      return { yearStart: startOfDay(new Date(getYear(now), 0, 1)), yearEnd: startOfDay(new Date(getYear(now), 11, 31)), weekStart: startOfWeek(now, { weekStartsOn: 1 }) };
    }
    const minStart = new Date(Math.min(...parsedSprints.map((s) => s.startDate.getTime())));
    const maxEnd = new Date(Math.max(...parsedSprints.map((s) => s.endDate.getTime())));
    const year = getYear(minStart);
    return {
      yearStart: startOfDay(new Date(year, 0, 1)),
      yearEnd: startOfDay(new Date(year, 11, 31)),
      weekStart: startOfWeek(minStart, { weekStartsOn: 1 }),
    };
  }, [parsedSprints]);

  const { yearStart, yearEnd, weekStart } = timelineRange;
  const yearDays = differenceInDays(yearEnd, yearStart) + 1;

  const monthViewData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({ month: i, label: MONTH_NAMES[i] }));
  }, []);

  const weekViewData = useMemo(() => {
    const offsetStart = addWeeks(weekStart, weekOffset);
    const numWeeks = 12;
    const days: Date[] = [];
    for (let w = 0; w < numWeeks; w++) {
      const ws = addWeeks(offsetStart, w);
      for (let d = 0; d < 7; d++) {
        days.push(addDays(ws, d));
      }
    }
    return { days, weekStart: offsetStart };
  }, [weekStart, weekOffset]);

  const totalDays = weekViewData.days.length;

  const getMonthBarStyle = (sprint: (typeof parsedSprints)[0]) => {
    const barStart = sprint.startDate < yearStart ? yearStart : sprint.startDate;
    const barEnd = sprint.endDate > yearEnd ? yearEnd : sprint.endDate;
    const leftPct = yearDays > 0 ? (differenceInDays(barStart, yearStart) / yearDays) * 100 : 0;
    const widthPct =
      yearDays > 0 ? (Math.max(1, differenceInDays(barEnd, barStart) + 1) / yearDays) * 100 : 0;
    return { left: `${leftPct}%`, width: `${Math.min(widthPct, 100 - leftPct)}%` };
  };

  const getWeekBarStyle = (sprint: (typeof parsedSprints)[0]) => {
    const startIdx = Math.max(0, differenceInDays(sprint.startDate, weekViewData.weekStart));
    const endIdx = Math.min(totalDays - 1, differenceInDays(sprint.endDate, weekViewData.weekStart));
    const leftPct = totalDays > 0 ? (startIdx / totalDays) * 100 : 0;
    const widthPct =
      totalDays > 0 ? Math.max(2, ((endIdx - startIdx + 1) / totalDays) * 100) : 100;
    return { left: `${leftPct}%`, width: `${widthPct}%` };
  };

  const isStartOfWeek = (d: Date) => format(d, "EEE") === "Mon";
  const isDateSelected = (d: Date) =>
    selectedDate && format(d, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");

  if (parsedSprints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl border-2 border-dashed border-slate-200/80 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-sm">
        <p className="text-muted-foreground text-center text-sm">Chưa có sprint để hiển thị</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* View mode toggle - pill style */}
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Chế độ xem
        </span>
        <div className="inline-flex p-1 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
          <button
            type="button"
            onClick={() => setViewMode("week")}
            className={cn(
              "px-4 py-2 text-xs font-semibold rounded-full transition-all duration-200",
              viewMode === "week"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            )}
          >
            Tuần
          </button>
          <button
            type="button"
            onClick={() => setViewMode("month")}
            className={cn(
              "px-4 py-2 text-xs font-semibold rounded-full transition-all duration-200",
              viewMode === "month"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            )}
          >
            Tháng
          </button>
        </div>
        {viewMode === "week" && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setWeekOffset((p) => p - 1)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
            >
              ← Tuần trước
            </button>
            <button
              type="button"
              onClick={() => setWeekOffset((p) => p + 1)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
            >
              Tuần sau →
            </button>
          </div>
        )}
      </div>

      {/* Timeline container - glassmorphism */}
      <div className="overflow-x-auto overflow-y-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 scroll-smooth">
        {viewMode === "month" ? (
          <div className="min-w-full">
            <div className="flex border-b border-slate-200 dark:border-slate-800">
              <div className="w-[140px] shrink-0 border-r border-slate-200 dark:border-slate-800 px-3 py-3" />
              <div className="flex-1 flex">
                {monthViewData.map((m) => (
                  <div
                    key={m.month}
                    className="flex-1 min-w-[60px] text-center py-2 text-xs font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800 last:border-r-0"
                  >
                    {m.label}
                  </div>
                ))}
              </div>
            </div>
            {parsedSprints.map((sprint) => {
              const style = getMonthBarStyle(sprint);
              return (
                <div
                  key={sprint.id ?? sprint.name}
                  className="flex border-b border-slate-200/80 dark:border-slate-800/80 last:border-b-0"
                >
                  <div className="w-[140px] shrink-0 border-r border-slate-200/80 dark:border-slate-800/80 px-3 py-3">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate block">
                      {sprint.name}
                    </span>
                  </div>
                  <div className="flex-1 relative min-h-[48px] px-1 py-2">
                    <button
                      type="button"
                      onClick={() => setZoomedSprint(sprint)}
                      className={cn(
                        "absolute inset-y-2 rounded-lg flex items-center justify-center px-3 overflow-hidden cursor-pointer text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.99]",
                        getSprintBarColors(sprint.state)
                      )}
                      style={{ left: style.left, width: style.width, boxShadow: "0 2px 8px rgb(0 0 0 / 0.15)" }}
                    >
                      <span className="text-xs font-bold text-white truncate text-center drop-shadow-sm">
                        {sprint.name}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="min-w-max">
            <div className="flex border-b border-slate-200 dark:border-slate-800">
              <div className="w-[140px] shrink-0 border-r border-slate-200 dark:border-slate-800 px-3 py-2" />
              <div className="flex">
                {weekViewData.days.map((d) => (
                  <div
                    key={d.toISOString()}
                    className={cn(
                      "w-10 shrink-0 text-center py-2 text-[10px] font-semibold border-r border-slate-100 dark:border-slate-800/50",
                      isStartOfWeek(d) && "border-l-2 border-l-slate-300 dark:border-l-slate-600",
                      format(d, "EEE") === "Sun" && "bg-slate-50/80 dark:bg-slate-900/50"
                    )}
                  >
                    {format(d, "MMM")}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex border-b border-slate-200 dark:border-slate-800">
              <div className="w-[140px] shrink-0 border-r border-slate-200 dark:border-slate-800" />
              <div className="flex">
                {weekViewData.days.map((d) => (
                  <button
                    key={d.toISOString()}
                    type="button"
                    onClick={() => setSelectedDate(d)}
                    className={cn(
                      "w-10 shrink-0 text-center py-2 text-[10px] font-semibold border-r border-slate-100 dark:border-slate-800/50 transition-colors",
                      isStartOfWeek(d) && "border-l-2 border-l-slate-300 dark:border-l-slate-600",
                      format(d, "EEE") === "Sun"
                        ? "bg-slate-50/80 dark:bg-slate-900/50 text-slate-400"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100",
                      isDateSelected(d) && "bg-blue-500 text-white hover:bg-blue-600"
                    )}
                  >
                    {format(d, "d")}
                  </button>
                ))}
              </div>
            </div>
            {parsedSprints.map((sprint) => {
              const style = getWeekBarStyle(sprint);
              return (
                <div
                  key={sprint.id ?? sprint.name}
                  className="flex border-b border-slate-200/80 dark:border-slate-800/80 last:border-b-0"
                >
                  <div className="w-[140px] shrink-0 border-r border-slate-200/80 dark:border-slate-800/80 px-3 py-2">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate block">
                      {sprint.name}
                    </span>
                  </div>
                  <div
                    className="relative min-h-[48px] flex-1 px-1 py-2"
                    style={{ width: totalDays * 40 }}
                  >
                    <button
                      type="button"
                      onClick={() => setZoomedSprint(sprint)}
                      className={cn(
                        "absolute inset-y-2 rounded-lg flex items-center justify-center px-3 overflow-hidden cursor-pointer text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.99]",
                        getSprintBarColors(sprint.state)
                      )}
                      style={{ left: style.left, width: style.width, boxShadow: "0 2px 8px rgb(0 0 0 / 0.15)" }}
                    >
                      <span className="text-xs font-bold text-white truncate text-center drop-shadow-sm">
                        {sprint.name}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {zoomedSprint && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setZoomedSprint(null)}
        >
          <div
            className="relative mx-4 w-full max-w-md rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-900/20 p-6 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4 flex items-center gap-1">
              {isLeader && (onEditSprint || onDeleteSprint) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200"
                      aria-label="Menu"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    {onEditSprint && (
                      <DropdownMenuItem
                        onClick={() => {
                          onEditSprint(zoomedSprint);
                          setZoomedSprint(null);
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                    )}
                    {onDeleteSprint && (
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => {
                          onDeleteSprint(zoomedSprint);
                          setZoomedSprint(null);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <button
                type="button"
                onClick={() => setZoomedSprint(null)}
                className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200"
                aria-label="Đóng"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 pr-16">
              {zoomedSprint.name}
            </h3>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500 dark:text-slate-400">Bắt đầu</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {format(parseDate(zoomedSprint.start) ?? new Date(), "dd/MM/yyyy")}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500 dark:text-slate-400">Kết thúc</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {format(parseDate(zoomedSprint.end) ?? new Date(), "dd/MM/yyyy")}
                </span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="text-slate-500 dark:text-slate-400">Trạng thái</span>
                <span
                  className={cn(
                    "inline-flex px-2.5 py-1 rounded-md text-xs font-medium",
                    getStateBadgeColors(zoomedSprint.state)
                  )}
                >
                  {zoomedSprint.state ?? "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
