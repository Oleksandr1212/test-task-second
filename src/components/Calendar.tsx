"use client";

import { useState } from "react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  eachDayOfInterval 
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import { CalendarEvent } from "@/types";

interface CalendarProps {
  events?: CalendarEvent[];
  onDayClick?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

export function Calendar({ events = [], onDayClick, onEventClick }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); 
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const weekDays = ["Пн", "Вв", "Ср", "Чт", "Пт", "Сб", "Нд"];

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-900 capitalize">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-lg hover:bg-gray-200 text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-gray-200 text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-gray-100 bg-white">
        {weekDays.map((day) => (
          <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 auto-rows-fr bg-gray-200 gap-px">
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());
          
          const dayString = format(day, "yyyy-MM-dd");
          const dayEvents = events.filter((e) => e.date === dayString);

          return (
            <div
              key={day.toString()}
              onClick={() => onDayClick && onDayClick(day)}
              className={clsx(
                "min-h-30 bg-white p-2 transition-colors cursor-pointer hover:bg-blue-50/50 group flex flex-col",
                !isCurrentMonth && "bg-gray-50/50 text-gray-400"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <span
                  className={clsx(
                    "w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium",
                    isToday
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                      : isCurrentMonth
                      ? "text-gray-900"
                      : "text-gray-400 group-hover:text-gray-600"
                  )}
                >
                  {format(day, "d")}
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                {dayEvents.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick?.(evt);
                    }}
                    className={clsx(
                      "text-xs px-2 py-1.5 rounded-md truncate cursor-pointer transition-colors shadow-sm font-medium border",
                      evt.importance === "звичайна" && "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100",
                      evt.importance === "важлива" && "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-100",
                      evt.importance === "критична" && "bg-red-50 text-red-700 hover:bg-red-100 border-red-100"
                    )}
                  >
                    {evt.time && <span className="opacity-75 mr-1">{evt.time}</span>}
                    {evt.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
