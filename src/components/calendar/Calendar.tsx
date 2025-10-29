import { forwardRef, useEffect, useState } from "react";
import { format, addDays, addWeeks } from "date-fns";
import { IoAddCircleSharp } from "react-icons/io5";
import { BiDownArrow } from "react-icons/bi";
import { IoIosArrowDropleft, IoIosArrowDropright, IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router";
import supabase from "../../config/supabaseClient";

import {
    type CalendarEvent,
    type CalendarProps,
    type Room,
    getTop,
    getDuration,
    getBaseWeek,
    generateWeekOptions,
    formatEvents,
} from "./CalendarUtil";

const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
    ({startHour = 7, endHour = 20 }, ref) => {

        const [weekOffset, setWeekOffset] = useState(0);
        const [dropdownOpen, setDropdownOpen] = useState(false);
        const [roomDropdownOpen, setRoomDropdownOpen] = useState(false);
        const [selectedRoom, setSelectedRoom] = useState("");
        const [rooms, setRooms] = useState<Room[]>([]);
        const [loadingRooms, setLoadingRooms] = useState(true);
        const [events, setEvents] = useState<CalendarEvent[]>([]);
        const [loadingEvents, setLoadingEvents] = useState(false);

        // Fetch rooms from Supabase
        useEffect(() => {
            async function fetchRooms() {
                const { data, error } = await supabase.rpc("get_rooms") as {
                    data: Room[] | null;
                    error: any;
                };
                if (error) console.error("Error fetching rooms:", error);
                else {
                    setRooms(data || []);
                    if (data && data.length > 0) setSelectedRoom(data[0].name);
                }
                setLoadingRooms(false);
            }
            fetchRooms();
        }, []);

        const baseWeek = getBaseWeek();
        const start = addWeeks(baseWeek, weekOffset);
        const days = Array.from({ length: 7 }).map((_, i) => addDays(start, i));
        const today = new Date();
        const rowHeight = 24; // px per 30 minutes
        const totalHalfHours = (endHour - startHour) * 2;
        const weekOptions = generateWeekOptions(baseWeek);

        useEffect(() => {
            async function fetchSchedules() {
                if (loadingRooms || rooms.length === 0) return;
                setLoadingEvents(true);
                try {
                    const { data: userData, error: userError } =
                        await supabase.auth.getUser();
                    if (userError || !userData?.user) throw userError;
                    const user = userData.user;

                    console.log(user.id)

                    const startOfWeek = format(start, "yyyy-MM-dd");
                    const endOfWeek = format(addDays(start, 6), "yyyy-MM-dd");
                    const selectedRoomObj = rooms.find((r) => r.name === selectedRoom);
                    console.log(selectedRoomObj);

                    const { data, error } = await supabase.rpc("get_room_schedule", {
                        p_room_id: selectedRoomObj?.id,
                        p_user_id: user.id,
                        p_start: startOfWeek,
                        p_end: endOfWeek,
                    });

                    console.log(data)

                    if (error) throw error;

                    setEvents(formatEvents(data));
                } catch (err) {
                    console.error("Error fetching schedules:", err);
                } finally {
                    setLoadingEvents(false);
                }
            }

            fetchSchedules();
        }, [selectedRoom, weekOffset, rooms]);
        
    return (
        <div className="bg-white rounded-md">
            {/* Header */}
            <div ref={ref} className="flex justify-between items-center relative pt-3 pb-3 pl-0.5 pr-0.5">
                {/* Week Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen((prev) => !prev)}
                        className="flex items-center gap-2 px-3 py-2 bg-white"
                    >
                        <span className="font-bold text-lg">
                            {format(start, "MMMM d, yyyy")} -{" "}
                            {format(addDays(start, 6), "MMMM d, yyyy")}
                        </span>
                        <BiDownArrow
                            className={`transition-transform duration-200 ${
                                dropdownOpen ? "rotate-180" : ""
                            }`}
                        />
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                            {weekOptions.map((week) => (
                                <button
                                    key={week.offset}
                                    onClick={() => {
                                        setWeekOffset(week.offset);
                                        setDropdownOpen(false);
                                    }}
                                    className={`block w-full text-left px-4 py-2 hover:bg-blue-100 transition ${
                                        week.offset === weekOffset ? "bg-blue-50 font-semibold" : ""
                                    }`}
                                >
                                    <span className="text-lg">{week.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-3 mr-3 relative">
                    <Link to="/student-dashboard">
                        <IoAddCircleSharp
                            className="text-4xl cursor-pointer text-[var(--primary)] hover:text-[var(--primary-hover)] transition"
                        />
                    </Link>

                    {/* Room Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setRoomDropdownOpen((prev) => !prev)}
                            className="flex items-center justify-between w-52 px-3 py-1 bg-white border border-gray-300 rounded-md"
                        >
                            <span className="text-base">{selectedRoom}</span>
                            <IoIosArrowDown
                                className={`transition-transform duration-200 ${
                                    roomDropdownOpen ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        {roomDropdownOpen && !loadingRooms && (
                            <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                                {rooms.map((room) => (
                                    <button
                                        key={room.id}
                                        onClick={() => {
                                            setSelectedRoom(room.name);
                                            setRoomDropdownOpen(false);
                                        }}
                                        className={`block w-full text-left px-4 py-2 hover:bg-blue-100 transition ${
                                            room.name === selectedRoom
                                                ? "bg-blue-50 font-semibold"
                                                : ""
                                        }`}
                                    >
                                        {room.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Week navigation */}
                    <span className="flex gap-1">
                          <IoIosArrowDropleft
                              className="text-2xl cursor-pointer hover:text-gray-700 transition"
                              onClick={() => setWeekOffset((prev) => prev - 1)}
                          />
                          <IoIosArrowDropright
                              className="text-2xl cursor-pointer hover:text-gray-700 transition"
                              onClick={() => setWeekOffset((prev) => prev + 1)}
                          />
                    </span>
                </div>
            </div>

            <div>
                {/* Header Row */}
                <div className="flex">
                    <div className="border-r border-t-2 border-b text-sm w-26 flex-shrink-0 border-gray-400">
                        <div className="border-b border-gray-400"></div>
                    </div>

                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 flex-1 border-t border-gray-400">
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
                                                    className={`absolute left-1 right-1 text-white p-2 rounded ${event.color} transition-all shadow-md duration-100`}
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

export default Calendar;