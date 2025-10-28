import Calendar from "./calendar/Calendar";

const events = [
    { title: "CS123 7735", day: 1, startTime: "7:30 AM", endTime: "9:00 AM", color: "bg-blue-700" },
    { title: "Maintenance", day: 5, startTime: "7:30 AM", endTime: "1:30 PM", color: "bg-orange-600" },
];

export default function StudentCalendar() {
    return(
        <div>
            <Calendar events={events}/>
        </div>
    )
}