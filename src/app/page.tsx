"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAppSelector } from "@/store/hooks";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";

export default function Dashboard() {
  const { user } = useAppSelector((state) => state.auth);

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
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Event Planner Dashboard</h1>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 hidden sm:block">
                Welcome, <span className="font-semibold text-gray-900">{user?.displayName || user?.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors focus:ring-2 focus:ring-red-500 focus:outline-none"
              >
                Sign out
              </button>
            </div>
          </div>
          
          <div className="h-64 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center bg-gray-50/50">
            <div className="text-center">
              <p className="text-gray-500 font-medium">Calendar Interface Coming Soon</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
