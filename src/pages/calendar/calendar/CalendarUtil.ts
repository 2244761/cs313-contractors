// CalendarUtil.ts
import { addDays, addWeeks, format, startOfWeek } from "date-fns";

// --- Types ---
export interface CalendarEvent {
  title: string;
  day: number;
  startTime: string;
  endTime: string;
  color: string;
}

export interface CalendarProps {
  events?: CalendarEvent[];
  startHour?: number;
  endHour?: number;
}

export interface Room {
  id: number;
  name: string;
}

// --- Time utilities ---
export function parseTime(timeStr: string): number {
  const [time, modifier] = timeStr.split(" ");
  // eslint-disable-next-line prefer-const
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return hours + minutes / 60;
}

export function getTop(time: string): number {
  return parseTime(time);
}

export function getDuration(start: string, end: string): number {
  return parseTime(end) - parseTime(start);
}

// --- Week utilities ---
export function generateWeekOptions(baseWeek: Date) {
  return Array.from({ length: 9 }).map((_, i) => {
    const offset = i - 4;
    const weekStart = addWeeks(baseWeek, offset);
    const weekEnd = addDays(weekStart, 6);
    const label = `${format(weekStart, "MMMM d")} - ${format(
      weekEnd,
      "MMMM d, yyyy"
    )}`;
    return { label, offset };
  });
}

// --- New: Time formatting ---
export function formatTo12Hour(time24: string) {
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
}

// --- New: Format events fetched from Supabase ---
export function formatEvents(data: unknown[]): CalendarEvent[] {
  return (
    data?.map((item: any) => ({
      id: item.schedule_id,
      day: new Date(item.date).getDay(),
      title: item.purpose || "No Title",
      startTime: formatTo12Hour(item.start_time.slice(0, 5)),
      endTime: formatTo12Hour(item.end_time.slice(0, 5)),
      color: "bg-blue-500",
    })) || []
  );
}

export const getBaseWeek = () => startOfWeek(new Date(), { weekStartsOn: 0 });
