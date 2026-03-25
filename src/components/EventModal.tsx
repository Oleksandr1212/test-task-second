"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X } from "lucide-react";
import { CalendarEvent } from "@/types";
import { useEffect } from "react";
import { format } from "date-fns";

const eventSchema = z.object({
  title: z.string().min(1, { message: "Введіть назву події" }),
  date: z.string().min(1, { message: "Дата обов'язкова" }),
  time: z.string().optional(),
  description: z.string().optional(),
  importance: z.enum(["звичайна", "важлива", "критична"] as const),
});

export type EventFormData = z.infer<typeof eventSchema>;

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EventFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
  selectedDate?: Date | null;
  existingEvent?: CalendarEvent | null;
  isLoading?: boolean;
}

export function EventModal({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  selectedDate, 
  existingEvent,
  isLoading = false 
}: EventModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      date: "",
      time: "",
      description: "",
      importance: "звичайна",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (existingEvent) {
        reset({
          title: existingEvent.title,
          date: existingEvent.date,
          time: existingEvent.time || "",
          description: existingEvent.description || "",
          importance: existingEvent.importance,
        });
      } else if (selectedDate) {
        reset({
          title: "",
          date: format(selectedDate, "yyyy-MM-dd"),
          time: "",
          description: "",
          importance: "звичайна",
        });
      }
    }
  }, [isOpen, existingEvent, selectedDate, reset]);

  if (!isOpen) return null;

  const isEditing = !!existingEvent;
  const todayString = format(new Date(), "yyyy-MM-dd");

  const handleFormSubmit = async (data: EventFormData) => {
    if (!isEditing) {
      if (data.date < todayString) {
        setError("date", { type: "manual", message: "Дата не може бути в минулому" });
        return;
      }
      
      if (data.date === todayString && data.time) {
        const eventDateTime = new Date(`${data.date}T${data.time}`);
        if (eventDateTime < new Date()) {
          setError("time", {
            type: "manual",
            message: "Цей час уже минув",
          });
          return;
        }
      }
    }
    
    await onSave(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? "Редагувати подію" : "Нова подія"}
          </h2>
          <button 
            onClick={onClose}
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="event-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Назва події *</label>
              <input
                type="text"
                {...register("title")}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors border-gray-200"
                placeholder="Наприклад: Зустріч з клієнтом"
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Дата *</label>
                <input
                  type="date"
                  {...register("date")}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors border-gray-200"
                />
                {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Час</label>
                <input
                  type="time"
                  {...register("time")}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors border-gray-200"
                />
                {errors.time && <p className="mt-1 text-sm text-red-500">{errors.time.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Важливість</label>
              <select
                {...register("importance")}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors border-gray-200 bg-white"
              >
                <option value="звичайна">Звичайна</option>
                <option value="важлива">Важлива</option>
                <option value="критична">Критична</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Опис</label>
              <textarea
                {...register("description")}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors border-gray-200 resize-none"
                placeholder="Деталі події..."
              />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
          {isEditing && onDelete ? (
             <button
              onClick={onDelete}
              disabled={isLoading}
              type="button"
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Видалити
            </button>
          ) : (
            <div></div>
          )}
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50"
            >
              Скасувати
            </button>
            <button
              type="submit"
              form="event-form"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 shadow-sm shadow-blue-200"
            >
              {isLoading ? "Збереження..." : isEditing ? "Оновити" : "Створити"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
