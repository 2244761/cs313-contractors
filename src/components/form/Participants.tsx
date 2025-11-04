import { MantineProvider, TagsInput, TextInput } from "@mantine/core";
import { useImperativeHandle, forwardRef, useState } from "react";
import { FaPlusSquare } from "react-icons/fa";

interface Participant {
  id: number;
  name: string;
}

const Participants = forwardRef((props, ref) => {
  const [equipment, setEquipment] = useState<string[]>([]);

  const [errors, setErrors] = useState({
    equipment: false,
    participants: false,
  });

  const [participants, setParticipants] = useState<Participant[]>([
    { id: Date.now(), name: "" }, 
  ]);

  const addFields = () => {
    setParticipants([...participants, { id: Date.now(), name: "" }]);
  };

  const handleNameChange = (id: number, newName: string) => {
    setParticipants(prevParticipants =>
      prevParticipants.map(p => 
        p.id === id ? { ...p, name: newName } : p
      )
    );
  };

  const validateForm = () => {
    const hasValidParticipant = participants.some(p => p.name.trim() !== "");

    const newErrors = {
      equipment: equipment.length === 0, // Handling empty fields in form
      participants: !hasValidParticipant,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).includes(true);
  };

  const getFormData = () => {
    const participantNames = participants
      .map(p => p.name.trim())
      .filter(name => name.length > 0);

    return {
      participants: participantNames,
      equipment,
    };
  };

  useImperativeHandle(ref, () => ({
    validateAndProceed: validateForm, 
    getFormData: getFormData,
  }));

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
          {participants.map((participant) => (
            <TextInput
              key={participant.id}
              placeholder="Enter Name"
              value={participant.name}
              onChange={(event) =>
                handleNameChange(participant.id, event.currentTarget.value)
              }
            />
          ))}
          {errors.participants && (
             <span className="text-red-500 text-xs" style={{marginTop: '-8px'}}>
               Please enter at least one participant's name
             </span>
          )}
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
            value={equipment}
            onChange={setEquipment}
            error={errors.equipment ? "Please list any equipment you plan to bring" : undefined}
          />
        </div>
      </div>
    </MantineProvider>
  );
});

export default Participants;

// <div>
//   <label htmlFor="advisor">Advisor (Optional)</label>

//   <select name="advisor" id="">
//     <option value="">Select Advisor</option>
//     <option value="josephine_dela_cruz">Josephine Dela Cruz</option>
//     <option value="dalos_dale_miguel">Dalos D. Miguel</option>
//   </select>
// </div>
