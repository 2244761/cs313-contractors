import { useImperativeHandle, useEffect, useState, forwardRef } from "react";
import {
  DatePickerInput,
  type DatePickerValue,
  getTimeRange,
  TimePicker,
} from "@mantine/dates";
import { MantineProvider, Select } from "@mantine/core";
import { TbCalendar } from "react-icons/tb";
import dayjs from "dayjs";
import supabaseClient from "../../config/supabaseClient";

interface Room {
  id: number;
  name: string;
}

const Details = forwardRef((props, ref) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [room, setRoom] = useState<string | null>(null);
  const [purpose, setPurpose] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string | undefined>();
  const [endTime, setEndTime] = useState<string | undefined>();
  const [advisor, setAdvisor] = useState("");

  const [errors, setErrors] = useState({ // Handling empty fields in form
    room: false,
    purpose: false,
    date: false,
    startTime: false,
    endTime: false,
    advisor: false,
  });

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabaseClient
        .from("room")
        .select("id, name");
        
      if (error) {
        console.error("Error fetching rooms:", error);
      } else if (data) {
        setRooms(data);
      }
    };
    fetchRooms();
  }, []);

  const allTimes = getTimeRange({
    startTime: "7:30",
    endTime: "17:30",
    interval: "00:30",
  });

  const filteredEndTimes =
    startTime && allTimes.includes(startTime)
      ? allTimes.slice(
          allTimes.indexOf(startTime) + 1,
          allTimes.indexOf(startTime) + 4
        )
      : allTimes;

  const validateForm = () => {
  const newErrors = {
    room: !room,
    purpose: !purpose,
    date: !date,
    startTime: !startTime,
    endTime: !endTime,
    advisor: !advisor || advisor.trim() === "",
  };
  setErrors(newErrors);
  console.log("advisor state:", advisor); // Debugging
  return !Object.values(newErrors).includes(true);
};


  const getFormData = () => {
  const selectedRoom = rooms.find((r) => r.id === parseInt(room || ""));
  return {
    room_id: room ? parseInt(room) : null,
    room_name: selectedRoom ? selectedRoom.name : null,
    purpose,
    date,
    startTime,
    endTime,
    advisor,
  };
};
  useImperativeHandle(ref, () => ({
    validateAndProceed: validateForm,
    getFormData: getFormData,
  }));

  const roomSelectData = rooms.map(r => ({
    value: r.id.toString(), // Select component needs string values
    label: r.name,
  }));

  return (
    <MantineProvider>
      <form
        className="flex flex-col gap-5 justify-center items-center"
      >
        <div className="flex gap-4 w-full">
          <div className="flex-1">
            <Select
              label="Room"
              placeholder="Select Room"
              data={roomSelectData}
              value={room}
              onChange={(value) => setRoom(value || "")}
              error={errors.room ? "Please select a room" : undefined}
            />
          </div>
          <div className="flex-1">
            <Select
              label="Purpose"
              placeholder="Select Purpose"
              data={["IT Project-Related", "Research-Related"]}
              value={purpose}
              onChange={(value) => setPurpose(value || "")}
              error={errors.purpose ? "Please select a purpose" : undefined}
            />
          </div>
        </div>

        <div className="w-full">
          <DatePickerInput
            leftSection={<TbCalendar size={18} />}
            leftSectionPointerEvents="none"
            label="Select Date"
            value={date}
            onChange={(value: DatePickerValue) => setDate(value as Date | null)}
            error={errors.date ? "Please select a date" : undefined}
            clearable
            minDate={new Date()}
            maxDate={dayjs().add(1, "M").toDate()}
            excludeDate={(date) => dayjs(date).day() === 0}
            firstDayOfWeek={0}
          />
        </div>

        <div className="flex w-full gap-4">
          <div className="flex-1">
            <TimePicker
              label="Time Start"
              value={startTime}
              onChange={(val) => {
                setStartTime(val);
                setEndTime(undefined);
              }}
              error={errors.startTime ? "Please select a start time" : undefined}
              presets={allTimes}
            />
          </div>
          <div className="flex-1">
            <TimePicker
              label="Time End"
              value={endTime}
              onChange={setEndTime}
              error={errors.endTime ? "Please select an end time" : undefined}
              presets={filteredEndTimes}
            />
          </div>
        </div>

        <div className="w-full">
          <Select
            label="Advisor"
            placeholder="Select Advisor"
            data={["Josephine Dela Cruz", "Dalos D. Miguel"]}
            value={advisor}
            onChange={(value) => setAdvisor(value ?? "")}
            error={errors.advisor ? "Please select an advisor" : undefined}
            description="If applicable, enter the supervising advisor/faculty"
            clearable
          />
        </div>
      </form>
    </MantineProvider>
  );
});

export default Details;
