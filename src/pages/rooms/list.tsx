import { useGo, useTable } from "@refinedev/core";
import React, { useEffect, useState } from "react";
import type { Room } from "../../utils/types/index";
import { ActionIcon, Loader, MantineProvider } from "@mantine/core";
import { NoResults } from "../../components/NoResults";
import { DataTable } from "../../components/table/DataTable";
import { LuPencilLine } from "react-icons/lu";
import { MdDelete } from "react-icons/md";

export const RoomList: React.FC = () => {
  const gridColumns = "grid-cols-[1fr_1fr_1fr_1fr_1fr]";

  const go = useGo();
  const {
    result,
    tableQuery: { isLoading },
  } = useTable<Room>({
    resource: "room",
    sorters: { initial: [{ field: "id", order: "asc" }] },
  });

  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    if (result) setRooms(result.data);
  }, [result]);

  if (isLoading) {
    return (
      <MantineProvider>
        <div className="flex justify-center items-center h-[75dvh]">
          <Loader />
        </div>
      </MantineProvider>
    );
  }

  const columns = [
    {
      header: "ID",
      accessor: "id" as keyof Room,
    },
    {
      header: "Facility",
      accessor: "name" as keyof Room,
    },
    {
      header: "Room",
      accessor: "room" as keyof Room,
    },
    {
      header: "Status",
      accessor: "status" as keyof Room,
    },
  ];

  return (
    <>
      <MantineProvider>
        <div className="flex flex-col gap-4 w-full h-full">
          {!isLoading && rooms.length === 0 ? (
            <NoResults subheading="We couldn’t find any rooms at the moment." />
          ) : (
            <DataTable
              data={rooms}
              gridColumns={gridColumns}
              columns={columns}
              isLoading={isLoading}
              renderActions={(room) => (
                <div className="flex gap-2">
                  {/* <ActionIcon title="View Details">
                    <LuEye />
                  </ActionIcon> */}

                  <ActionIcon
                    title="Show Room"
                    onClick={() =>
                      go({
                        to: `show/${room.id}`,
                      })
                    }
                  >
                    <LuPencilLine />
                  </ActionIcon>
                  <ActionIcon title="Delete Room" color="red">
                    <MdDelete />
                  </ActionIcon>
                </div>
              )}
            />
          )}
        </div>
      </MantineProvider>
    </>
  );
};
