export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export type EventImportance = "звичайна" | "важлива" | "критична";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  description?: string;
  importance: EventImportance;
  userId: string;
  createdAt: number; 
  updatedAt: number; 
}
