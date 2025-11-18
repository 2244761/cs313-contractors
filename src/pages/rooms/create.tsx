import { useState } from "react";
import type { Room } from "../../utils/types";
import { useCreate } from "@refinedev/core";
import {
  MantineProvider,
  NumberInput,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import supabase from "../../config/supabaseClient";

export const RoomCreate = () => {
  const [room, setRoom] = useState<Room>({
    id: 0,
    name: "",
    room: "",
    status: "Available",
    description: "",
    images: [],
    capacity: 0,
  });

  const {
    mutate,
    mutation: { isPending: isCreating },
  } = useCreate();

  // const { data } = supabase.storage
  //   .from("room_thumbnails")
  //   .getPublicUrl("1/thumbnail-1.jpg");

  // console.log(data);

  // const handleUpdate = async () => {
  //   await mutate({
  //     resource: "room",
  //     values: {
  //       name: name,
  //       room: ,
  //       status: status,
  //       description: ,
  //       capacity: ,
  //     },
  //   });
  // };

  return (
    <MantineProvider>
      <div className="flex justify-center items-center">
        <form
          // onSubmit={}
          className="w-2xl h-max bg-white rounded-xl p-8 border border-gray-200 flex flex-col gap-4"
        >
          <div>
            <TextInput label="Facility" />
          </div>
          <div>
            <TextInput label="Room" />
          </div>
          <div>
            <Textarea label="Description" styles={{ input: { height: 150 } }} />
          </div>
          <div>
            <NumberInput label="Capacity" />
            <div>
              <Select data={["Available", "Unavailable"]} label="Status" />
            </div>
          </div>
          <button
            type="submit"
            className="p-3 bg-[var(--primary)] cursor-pointer text-white rounded"
          >
            Submit
          </button>
        </form>
      </div>
    </MantineProvider>
  );
};
// };
