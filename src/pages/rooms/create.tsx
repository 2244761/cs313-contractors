import { useEffect, useState } from "react";
import type { Room } from "../../utils/types";
import { useCreate, useList } from "@refinedev/core";
import {
  MantineProvider,
  NumberInput,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import {
  Dropzone,
  IMAGE_MIME_TYPE,
  type FileWithPath,
} from "@mantine/dropzone";
import supabase from "../../config/supabaseClient";
import {
  MdAddPhotoAlternate,
  MdErrorOutline,
  MdOutlineFileUpload,
} from "react-icons/md";
import { FaXmark } from "react-icons/fa6";

export const RoomCreate = () => {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const { query } = useList<Room>();

  const totalRoom = query.data?.data.length;
  // const [room, setRoom] = useState<Room>({
  //   id: 0,
  //   name: "",
  //   room: "",
  //   status: "Available",
  //   description: "",
  //   images: [],
  //   capacity: 0,
  // });

  // const {
  //   mutate,
  //   mutation: { isPending: isCreating },
  // } = useCreate();

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

  // const storeThumbnails = files.map((file, index) => {
  //   const blobUrl = URL.createObjectURL(file);
  //   const imageName = `thumbnail-${index + 1}`;
  //   return {
  //     file,
  //     blobUrl,
  //     name: imageName,
  //   };
  // });

  const removePreview = (name: string) => {
    setFiles((files) => files.filter((file) => file.name !== name));
  };

  console.log(files.map((f) => f.name));

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const { data, error } = await supabase.storage
        .from("room_thumbnails")
        .upload(`1/${file.name}`, file);

      if (error) console.log(error);

      console.log(data);
    }
  };

  const previewThumbnails = files.map((file, index) => {
    const blobUrl = URL.createObjectURL(file);
    // const imageName = `thumbnail-${index + 1}`;

    if (IMAGE_MIME_TYPE.includes(file.type as any)) {
      return (
        <>
          <div key={index} className="relative">
            <img
              src={blobUrl}
              onLoad={() => URL.revokeObjectURL(blobUrl)}
              className="w-56 h-56 object-cover"
            />
            <button
              type="button"
              className="absolute right-0 top-0 cursor-pointer"
              onClick={() => removePreview(file.name)}
            >
              <FaXmark />
            </button>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="relative">
            <video
              className="w-56 h-56 object-cover"
              controls
              key={index}
              onLoad={() => URL.revokeObjectURL(blobUrl)}
            >
              <source src={blobUrl} type="video/mp4" />
            </video>
            <button
              type="button"
              className="absolute right-0 top-0 cursor-pointer"
              onClick={() => removePreview(file.name)}
            >
              <FaXmark />
            </button>
          </div>
        </>
      );
    }
  });

  return (
    <MantineProvider>
      <div className="flex justify-center items-center">
        <form
          onSubmit={handleUpload}
          className="w-2xl h-max bg-white rounded-xl p-8 border border-gray-200 flex flex-col gap-4"
        >
          <Dropzone
            onDrop={(file) => setFiles((prev) => [...prev, ...file])}
            accept={{ "image/*": [], "video/mp4": [] }}
          >
            <div className="flex justify-center items-center gap-4 border rounded border-dashed cursor-pointer hover:bg-gray-100 transition-colors duration-200 p-4">
              <Dropzone.Accept>
                <MdOutlineFileUpload size={52} />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <MdErrorOutline size={52} />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <MdAddPhotoAlternate size={52} />
              </Dropzone.Idle>

              <div>
                <h1>Drag images here or click to select files</h1>
                <p>
                  Attach as many files as you like, each file should not exceed
                  5mb
                </p>
              </div>
            </div>
          </Dropzone>
          <div className="flex gap-2">{previewThumbnails}</div>
          {/* <div>
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
          </div> */}
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
