import { Loader, MantineProvider } from "@mantine/core";
import { useOne, useUpdate } from "@refinedev/core";

interface RoomEditProps {
  roomId: number;
}

export const RoomEdit = ({ roomId }: RoomEditProps) => {
  const {
    result,
    query: { isLoading },
  } = useOne({ resource: "room", id: roomId });

  const {
    mutate,
    mutation: { isPending },
  } = useUpdate();

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

  return <div>RoomCreate</div>;
};
