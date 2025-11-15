import { Loader, MantineProvider } from "@mantine/core";
import { useOne } from "@refinedev/core";
import { useEffect, useState } from "react";
import type { Room } from "../../../utils/types";

export const RoomEdit = ({ id }: Room) => {
  const [room, setRoom] = useState<Room>();

  const {
    result,
    query: { isLoading },
  } = useOne({ resource: "room", id: id });

  // const {
  //   mutate,
  //   mutation: { isPending },
  // } = useUpdate();

  useEffect(() => {
    if (result) setRoom(result.data);
  }, [result]);

  if (isLoading) {
    return (
      <MantineProvider>
        <div className="flex justify-center items-center h-[75dvh] w-full">
          <Loader />
        </div>
      </MantineProvider>
    );
  }

  // const updateRoom = async () => {
  //   await mutate
  // }

  return <div>{room?.id}</div>;
};
