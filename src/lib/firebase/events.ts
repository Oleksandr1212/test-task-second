import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "./config";
import { CalendarEvent } from "@/types";

const EVENTS_COLLECTION = "events";

export const addEvent = async (eventData: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  const now = Date.now();
  const docRef = await addDoc(collection(db, EVENTS_COLLECTION), {
    ...eventData,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
};

export const getUserEvents = async (userId: string): Promise<CalendarEvent[]> => {
  const q = query(
    collection(db, EVENTS_COLLECTION),
    where("userId", "==", userId)
  );
  
  const querySnapshot = await getDocs(q);
  const events: CalendarEvent[] = [];
  
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    events.push({
      id: docSnap.id,
      title: data.title,
      date: data.date,
      time: data.time || "",
      description: data.description || "",
      importance: data.importance,
      userId: data.userId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  });
  
  return events.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time || "00:00"}`).getTime();
    const dateB = new Date(`${b.date}T${b.time || "00:00"}`).getTime();
    return dateA - dateB;
  });
};

export const updateEventData = async (eventId: string, data: Partial<Omit<CalendarEvent, "id" | "createdAt" | "userId">>): Promise<void> => {
  const eventRef = doc(db, EVENTS_COLLECTION, eventId);
  await updateDoc(eventRef, {
    ...data,
    updatedAt: Date.now(),
  });
};

export const deleteEventData = async (eventId: string): Promise<void> => {
  const eventRef = doc(db, EVENTS_COLLECTION, eventId);
  await deleteDoc(eventRef);
};
