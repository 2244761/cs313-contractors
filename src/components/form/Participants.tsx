import { MantineProvider, TagsInput, TextInput } from "@mantine/core";
import { useState } from "react";
import { FaPlusSquare } from "react-icons/fa";

const Participants = () => {
  const [participants, setParticipants] = useState([
    <TextInput placeholder="Enter Name" />,
  ]);
  const addFields = () => {
    const newField = <TextInput placeholder="Enter Name" />;

    setParticipants([...participants, newField]);
  };
  return (
    <MantineProvider>
      <div className="flex flex-col gap-4">
        <div className="flex items-center  gap-2">
          <h2 className="leading-5">Participants</h2>
          <button
            className="text-[var(--primary)] cursor-pointer flex items-center gap-2 rounded-full hover:text-[var(--primary-hover)] duration-200"
            onClick={addFields}
          >
            <FaPlusSquare size={28} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {participants.map(() => {
            return <TextInput placeholder="Enter Name" />;
          })}
        </div>
        <div>
          <TagsInput
            label="Equipments"
            placeholder="e.g. Laptop, HDMI cable, Projector"
            description="List any equipment you’ll bring that may affect lab usage."
            data={[
              "Laptop",
              "Router",
              "Projector",
              "Extension Cord",
              "HDMI Cable",
              "Arduino",
            ]}
          />
        </div>
      </div>
    </MantineProvider>
  );
};

export default Participants;

// <div>
//   <label htmlFor="advisor">Advisor (Optional)</label>

//   <select name="advisor" id="">
//     <option value="">Select Advisor</option>
//     <option value="josephine_dela_cruz">Josephine Dela Cruz</option>
//     <option value="dalos_dale_miguel">Dalos D. Miguel</option>
//   </select>
// </div>
