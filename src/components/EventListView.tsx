"use client";

import { CalendarEvent } from "@/types";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { clsx } from "clsx";
import { Calendar, Clock } from "lucide-react";

interface EventListViewProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export function EventListView({ events, onEventClick }: EventListViewProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-500 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-lg font-bold text-gray-900">Немає подій для відображення</p>
        <p className="text-sm mt-1 text-gray-500">Змініть фільтри або додайте нові події у календарі</p>
      </div>
    );
  }

  const sortedEvents = [...events].sort((a, b) => {
    const timeA = new Date(`${a.date}T${a.time || "00:00"}`).getTime();
    const timeB = new Date(`${b.date}T${b.time || "00:00"}`).getTime();
    return timeA - timeB;
  });

  return (
    <div className="space-y-4">
      {sortedEvents.map((evt) => {
        const eventDate = new Date(evt.date);
        
        return (
          <div
            key={evt.id}
            onClick={() => onEventClick(evt)}
            className="group flex flex-col sm:flex-row sm:items-center bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
          >
            <div className={clsx(
              "absolute left-0 top-0 bottom-0 w-1.5 transition-all group-hover:w-2",
              evt.importance === "звичайна" && "bg-blue-500",
              evt.importance === "важлива" && "bg-amber-500",
              evt.importance === "критична" && "bg-red-500"
            )} />

            <div className="flex-1 pl-3 sm:pl-5">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div className="max-w-xl">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {evt.title}
                  </h3>
                  {evt.description && (
                    <p className="text-gray-600 text-sm mt-1.5 line-clamp-2 leading-relaxed">
                      {evt.description}
                    </p>
                  )}
                </div>
                
                <span className={clsx(
                  "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider self-start shrink-0",
                  evt.importance === "звичайна" && "bg-blue-50 text-blue-700",
                  evt.importance === "важлива" && "bg-amber-50 text-amber-700",
                  evt.importance === "критична" && "bg-red-50 text-red-700"
                )}>
                  {evt.importance === "звичайна" && "Звичайна"}
                  {evt.importance === "важлива" && "Важлива"}
                  {evt.importance === "критична" && "Критична"}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500 font-medium">
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{format(eventDate, "d MMMM yyyy", { locale: uk })}</span>
                </div>
                {evt.time && (
                  <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{evt.time}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
