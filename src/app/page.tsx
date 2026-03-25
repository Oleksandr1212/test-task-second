"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAppSelector } from "@/store/hooks";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";
import { Calendar } from "@/components/Calendar";
import { EventModal } from "@/components/EventModal";
import { EventListView } from "@/components/EventListView";
import { useDashboardEvents, EventImportanceFilter } from "@/hooks/useDashboardEvents";
import { LayoutGrid, List } from "lucide-react";
import { clsx } from "clsx";

export default function Dashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const {
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
  } = useDashboardEvents();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100">
          
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-6 border-b border-gray-100 pb-4 gap-4">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Мої події</h1>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full sm:w-auto gap-3">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Пошук подій..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors border-gray-200 bg-gray-50 text-gray-700 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={filterImportance}
                  onChange={(e) => setFilterImportance(e.target.value as EventImportanceFilter)}
                  className="w-full sm:w-auto px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors border-gray-200 bg-gray-50 text-gray-700 font-medium cursor-pointer appearance-none"
                >
                  <option value="all">Усі події</option>
                  <option value="важлива">Важливі</option>
                  <option value="критична">Критичні</option>
                  <option value="звичайна">Звичайні</option>
                </select>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setViewMode("calendar")}
                    className={clsx(
                      "p-1.5 rounded-md transition-all flex items-center justify-center focus:outline-none",
                      viewMode === "calendar" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
                    )}
                    title="Календар"
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={clsx(
                      "p-1.5 rounded-md transition-all flex items-center justify-center focus:outline-none",
                      viewMode === "list" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
                    )}
                    title="Список"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-3 border-l-0 sm:border-l pl-0 sm:pl-3 border-gray-200">
                  <div className="text-sm text-gray-600 hidden md:block">
                    Привіт, <span className="font-semibold text-gray-900">{user?.displayName || user?.email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:ring-2 focus:ring-red-500 focus:outline-none"
                    title="Вийти"
                  >
                    Вийти
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {isLoadingEvents ? (
            <div className="flex justify-center items-center py-24">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : viewMode === "calendar" ? (
            <Calendar 
              events={filteredEvents} 
              onDayClick={handleDayClick} 
              onEventClick={handleEventClick} 
            />
          ) : (
            <EventListView 
              events={filteredEvents} 
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
