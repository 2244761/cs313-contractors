// INITIAL CODE
import { format, addDays, startOfWeek } from "date-fns";
import { forwardRef } from "react";
import { IoAddCircleSharp } from "react-icons/io5";
import { BiDownArrow } from "react-icons/bi";

interface CalendarEvent {
    title: string;
    day: number;
    startTime: string;
    endTime: string;
    color: string;
}

interface CalendarProps {
    events?: CalendarEvent[];
    startHour?: number;
    endHour?: number;
}

const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
    ({ events = [], startHour = 7, endHour = 20 }, ref) => {
        const start = startOfWeek(new Date(), { weekStartsOn: 0 });
        const days = Array.from({ length: 7 }).map((_, i) => addDays(start, i));
        const today = new Date();

        const rowHeight = 24; // px per 30 minutes
        const totalHalfHours = (endHour - startHour) * 2;

    // const events = [
    //     {
    //         title: "CS123 7735",
    //         day: 1, // Monday
    //         startTime: "7:30 AM",
    //         endTime: "9:00 AM",
    //         color: "bg-blue-700",
    //     },
    //     {
    //         title: "CS313 9325",
    //         day: 1,
    //         startTime: "12:00 PM",
    //         endTime: "1:30 PM",
    //         color: "bg-rose-500",
    //     },
    //     {
    //         title: "<Purpose>",
    //         day: 2,
    //         startTime: "7:30 AM",
    //         endTime: "8:00 AM",
    //         color: "bg-green-600",
    //     },
    //     {
    //         title: "MAINTENANCE",
    //         day: 5,
    //         startTime: "7:30 AM",
    //         endTime: "1:30 PM",
    //         color: "bg-orange-600",
    //     }
    // ];
    return (

        <div className="bg-white pt-8 rounded-md">
            {/* Header */}
            <div ref={ref} className="flex justify-between items-center mb-5 ml-8">
                <h2 className="text-lg font-semibold">
                    {format(start, "MMMM d, yyyy")} - {format(addDays(start, 6), "MMMM d, yyyy")}
                    <BiDownArrow />
                </h2>
                <div>
                    <IoAddCircleSharp />
                </div>
            </div>

            <div>
                {/* Header Row */}
                <div className="flex">
                    <div className="border-r border-t-2 border-b text-sm w-26 flex-shrink-0 border-gray-400">
                        {/* Top-left corner space */}
                        <div className="border-b border-gray-400"></div>
                    </div>
                    <div className="grid grid-cols-7 flex-1 border-t border-gray-400">

                        {/* Weekday headers */}
                        {days.map((day, dayIndex) => {
                            const isPast = day < new Date(today.getFullYear(), today.getMonth(), today.getDate());

                            return (
                                <div
                                    key={dayIndex}
                                    className={`flex flex-col justify-center text-center py-2 font-medium border-r border-b border-t-2 border-gray-400 transition-colors
                                    ${isPast ? "bg-gray-100 text-gray-400" : ""}`}
                                >
                                    <span className="uppercase font-light">{format(day, "EEE")}</span>
                                    <span className="font-black text-3xl">{format(day, "d")}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Main body (time + days) */}
                <div className="flex">
                    {/* Time Column */}
                    <div className="border-r border-gray-400 text-sm w-26 font-bold">
                        {Array.from({ length: totalHalfHours }).map((_, i) => {
                            const hour = Math.floor(i / 2) + startHour;
                            const minute = i % 2 === 0 ? "00" : "30";
                            const timeLabel = `${hour > 12 ? hour - 12 : hour}:${minute} ${
                                hour >= 12 ? "PM" : "AM"
                            }`;

                            return (
                                <div key={i} className="h-6 border-b text-center border-gray-400 text-gray-600">
                                    {timeLabel}
                                </div>
                            );
                        })}
                    </div>

                    {/* Day Columns */}
                    <div className="grid grid-cols-7 flex-1">
                        {days.map((day, dayIndex) => {
                            const isPast = day < new Date(today.getFullYear(), today.getMonth(), today.getDate());

                            return (
                                <div
                                    key={dayIndex}
                                    className={`border-r border-gray-400 relative ${
                                        isPast ? "bg-gray-50 opacity-60" : ""
                                    }`}
                                >
                                    {/* Background rows */}
                                    {Array.from({length: totalHalfHours}).map((_, i) => (
                                        <div key={i} className="h-6 border-b 0.5 border-gray-400"></div>
                                    ))}

                                    {/* Events */}
                                    {events
                                        .filter((e) => e.day === dayIndex)
                                        .map((event, idx) => {
                                            const topPx = (getTop(event.startTime) - startHour) * 2 * rowHeight;
                                            const heightPx = getDuration(event.startTime, event.endTime) * 2 * rowHeight;
                                            return (
                                                <div
                                                    key={idx}
                                                    className={`absolute left-1 right-1 text-white p-2 rounded ${event.color} shadow-md`}
                                                    style={{
                                                        top: `${topPx}px`,
                                                        height: `${heightPx}px`,
                                                    }}
                                                >
                                                    <div className="font-semibold text-sm">{event.title}</div>
                                                    <div className="text-xs">
                                                        {event.startTime} - {event.endTime}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
});

// Utility functions
function parseTime(timeStr: string): number {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return hours + minutes / 60;
}

function getTop(time: string): number {
    return parseTime(time);
}

function getDuration(start: string, end: string): number {
    return parseTime(end) - parseTime(start);
}

export default Calendar;