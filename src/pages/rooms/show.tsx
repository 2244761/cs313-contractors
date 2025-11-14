import { Loader, MantineProvider } from "@mantine/core";
import { useShow } from "@refinedev/core";
import { useEffect, useState } from "react";
import type { Room } from "../../utils/types";

export const RoomShow = () => {
  const [room, setRoom] = useState<Room>();
  const {
    query: { data, isLoading, error },
  } = useShow<Room>();

  useEffect(() => {
    if (data) setRoom(data.data);
  }, [data]);

  if (error) return <p>Error: {error.message}</p>;

  if (isLoading) {
    return (
      <MantineProvider>
        <div className="flex justify-center items-center h-[75dvh] w-full">
          <Loader />
        </div>
      </MantineProvider>
    );
  }

  return (
    <div>
      <h1>{room?.name ?? "Test"}</h1>
      <p>Capacity: {room?.capacity ?? "Test2"}</p>
    </div>
  );
};
