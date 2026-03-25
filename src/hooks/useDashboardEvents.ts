"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { CalendarEvent } from "@/types";
import { getUserEvents, addEvent, updateEventData, deleteEventData } from "@/lib/firebase/events";
import { EventFormData } from "@/components/EventModal";

export type EventImportanceFilter = "all" | "звичайна" | "важлива" | "критична";

export function useDashboardEvents() {
  const { user } = useAppSelector((state) => state.auth);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const [viewMode, setViewMode] = useState<"calendar" | "list">((searchParams.get("view") as "calendar" | "list") || "calendar");
  const [filterImportance, setFilterImportance] = useState<EventImportanceFilter>((searchParams.get("importance") as EventImportanceFilter) || "all");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const filteredEvents = events.filter((evt) => {
    const matchesImportance = filterImportance === "all" || evt.importance === filterImportance;
    const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (evt.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return matchesImportance && matchesSearch;
  });

  const loadEvents = useCallback(async () => {
    if (!user) return;
    setIsLoadingEvents(true);
    try {
      const fetchedEvents = await getUserEvents(user.uid);
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Failed to load events:", error);
    } finally {
      setIsLoadingEvents(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.uid) {
      loadEvents();
    }
  }, [user, loadEvents]);

  const updateUrl = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    router.replace(url, { scroll: false });
  }, [pathname, router, searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateUrl({ 
        view: viewMode !== "calendar" ? viewMode : null, 
        importance: filterImportance !== "all" ? filterImportance : null,
        q: searchQuery || null 
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [viewMode, filterImportance, searchQuery, updateUrl]);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedDate(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setSelectedEvent(null);
  };

  const handleSaveEvent = async (data: EventFormData) => {
    if (!user) return;
    setIsSaving(true);
    try {
      if (selectedEvent) {
        await updateEventData(selectedEvent.id, data);
      } else {
        await addEvent({
          title: data.title,
          date: data.date,
          time: data.time || "",
          description: data.description || "",
          importance: data.importance,
          userId: user.uid,
        });
      }
      
      await loadEvents();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save event:", error);
      alert("Не вдалося зберегти подію. Спробуйте ще раз.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    
    const confirmDelete = window.confirm("Ви дійсно хочете видалити цю подію?");
    if (!confirmDelete) return;

    setIsSaving(true);
    try {
      await deleteEventData(selectedEvent.id);
      await loadEvents();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to delete event:", error);
      alert("Не вдалося видалити подію.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    events,
    filteredEvents,
    isLoadingEvents,
    isSaving,
    viewMode,
    setViewMode,
    filterImportance,
    setFilterImportance,
    searchQuery,
    setSearchQuery,
    isModalOpen,
    selectedDate,
    selectedEvent,
    handleDayClick,
    handleEventClick,
    handleCloseModal,
    handleSaveEvent,
    handleDeleteEvent
  };
}
