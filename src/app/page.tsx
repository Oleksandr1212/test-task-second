"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAppSelector } from "@/store/hooks";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";
import { Calendar } from "@/components/Calendar";
import { EventModal, EventFormData } from "@/components/EventModal";
import { CalendarEvent } from "@/types";
import { getUserEvents, addEvent, updateEventData, deleteEventData } from "@/lib/firebase/events";

export default function Dashboard() {
  const { user } = useAppSelector((state) => state.auth);
  
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      loadEvents();
    }
  }, [user]);

  const loadEvents = async () => {
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
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100">
          
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-6 border-b border-gray-100 pb-4 gap-4">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Календар подій</h1>
            <div className="flex items-center justify-between w-full sm:w-auto gap-4">
              <div className="text-sm text-gray-600 hidden sm:block">
                Привіт, <span className="font-semibold text-gray-900">{user?.displayName || user?.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors focus:ring-2 focus:ring-red-500 focus:outline-none"
              >
                Вийти
              </button>
            </div>
          </div>
          
          {isLoadingEvents ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <Calendar 
              events={events} 
              onDayClick={handleDayClick} 
              onEventClick={handleEventClick} 
            />
          )}

        </div>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        selectedDate={selectedDate}
        existingEvent={selectedEvent}
        isLoading={isSaving}
      />
    </ProtectedRoute>
  );
}
