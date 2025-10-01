import {
  DatePickerInput,
  getTimeRange,
  // MiniCalendar,
  TimePicker,
} from "@mantine/dates";
import { MantineProvider, Select } from "@mantine/core";
import { useState } from "react";
import { TbCalendar } from "react-icons/tb";
import dayjs from "dayjs";

const DetailsForm = () => {
  const date = new Date();
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  } as const;

  const formatter = new Intl.DateTimeFormat("en-US", options);
  const formattedDate = formatter.format(date);

  const [startTime, setStartTime] = useState<string | undefined>(undefined);
  const [endTime, setEndTime] = useState<string | undefined>(undefined);

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

  return (
    <MantineProvider
      theme={{
        components: {},
      }}
    >
      <form
        action="#"
        className="flex flex-col gap-5 justify-center items-center"
      >
        <div className="flex gap-4 w-full">
          <div className="flex-1">
            <Select
              label="Room"
              placeholder="Select Room"
              data={["TRIL", "Knowledge Center", "Open Lab/BYOD"]}
            />
          </div>
          <div className="flex-1">
            <Select
              label="Purpose"
              placeholder="Select Purpose"
              data={["IT Project-Related", "Research-Related"]}
            />
          </div>
        </div>
        <div className="w-full">
          <DatePickerInput
            leftSection={<TbCalendar size={18} />}
            leftSectionPointerEvents="none"
            label="Select Date"
            placeholder={formattedDate}
            clearable
            minDate={date}
            maxDate={dayjs().add(1, "M").toDate()}
            excludeDate={(date) => dayjs(date).day() === 0}
            firstDayOfWeek={0}
          />
          {/* <div>Select Date</div>
          <MiniCalendar
            aria-label="Select Date"
            numberOfDays={10}
            minDate={currentDate}
          /> */}
        </div>
        <div className="flex w-full gap-4">
          <div className="flex-1">
            <TimePicker
              label="Time Start"
              withDropdown
              format="12h"
              value={startTime}
              onChange={(value) => {
                setStartTime(value);
                setEndTime("");
              }}
              presets={allTimes}
            />
          </div>
          <div className="flex-1">
            <TimePicker
              label="Time End"
              withDropdown
              format="12h"
              value={endTime}
              onChange={setEndTime}
              presets={filteredEndTimes}
            />
          </div>
        </div>
        <div className="w-full ">
          <Select
            label="Advisor"
            placeholder="Select Advisor"
            data={["Josephine Dela Cruz", "Dalos D. Miguel"]}
            description="If applicable, enter the supervising advisor/faculty"
            className=""
            clearable
          />
        </div>
      </form>
    </MantineProvider>
  );
};

export default DetailsForm;
