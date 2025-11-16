// Refine Dev Class
import { useTable } from "@refinedev/core";

// Additional styling and components
import { NoResults } from "../../components/NoResults";
import { SearchBar } from "../../components/SearchBar";

// React Import
import { useEffect, useState } from "react";

// Mantine Import
import { Loader, MantineProvider, Select } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { DataTable } from "../../components/table/DataTable";
import type { Reservation } from "../../utils/types";
// import supabase from "../../config/supabaseClient";

export const ReservationList: React.FC = () => {
  const gridColumns = "grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]";

  // const { data, isLoading } = useGetIdentity();
  const [searchValue, setSearchValue] = useState<string>("");
  const [debounced] = useDebouncedValue(searchValue, 50);
  const [selectValue, setSelectValue] = useState<string | null>("");
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const {
    result,
    tableQuery: { isLoading, refetch },
    currentPage,
    setCurrentPage,
    pageCount,
    setFilters,
  } = useTable<Reservation>({
    resource: "admin_get_reservation",
    pagination: { currentPage: 1, pageSize: 10 },
    sorters: { initial: [{ field: "reservation_id", order: "asc" }] },

    // filters: {
    //   permanent: [
    //     {
    //       field: "type",
    //       operator: "ne",
    //       value: "ADMIN",
    //     },
    //   ],
    //   initial: [
    //     {
    //       field: "full_name",
    //       operator: "contains",
    //       value: "",
    //     },
    //   ],
    // },
    queryOptions: {
      enabled: true,
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60,
    },
  });

  useEffect(() => {
    if (result) setReservations(result.data);
  }, [result]);

  useEffect(() => {
    setFilters([
      {
        field: "purpose",
        operator: "contains",
        value: debounced,
      },
    ]);
    refetch();
  }, [debounced]);

  // useEffect(() => {
  //   const fetchReservations = async () => {
  //     if (!isLoading) {
  //       try {
  //         await getReservations();
  //       } catch (err) {
  //         console.error("Failed to fetch reservations:", err);
  //       }
  //     }
  //   };

  //   fetchReservations();
  // }, [isLoading, data]);

  // async function getReservations() {
  //   const { data, error } = await supabase.rpc("admin_get_reservations");

  //   if (error) {
  //     console.error(error);
  //   }
  //   setReservations(data);
  // }

  // // Testing
  // reservations.forEach((e) => console.log(e));

  // // Fetching Data
  if (isLoading && reservations.length === 0) {
    return (
      <MantineProvider>
        <div className="flex justify-center items-center h-[75dvh]">
          <Loader />
        </div>
      </MantineProvider>
    );
  }

  // Format data (e.g. 15:00:00+00) to human readable (3:00 PM)
  function formatTime(time: string): string {
    const date = new Date(`2001-09-11T${time.replace("+00", "Z")}`); // Dummy date, will be removed anyway

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    });
  }

  const columns = [
    {
      header: "Code",
      accessor: "reservation_code" as keyof Reservation,
    },
    { header: "User", accessor: "full_name" as keyof Reservation },
    { header: "Purpose", accessor: "purpose" as keyof Reservation },
    // { header: "Type", accessor: "type" as keyof Reservation },
    { header: "Status", accessor: "status" as keyof Reservation },
    {
      header: "Date(s)",
      accessor: (item: Reservation) =>
        item.schedules
          ?.map((s: { date: string }) =>
            new Date(s.date).toLocaleDateString("en-us", {
              month: "short",
              day: "numeric",
            })
          )
          .join(", ") || "—",
    },
    {
      header: "Start",
      accessor: (item: Reservation) =>
        item.schedules && item.schedules.length > 0
          ? formatTime(item.schedules[0].start_time)
          : "-",
    },
    {
      header: "End",
      accessor: (item: Reservation) =>
        item.schedules && item.schedules.length > 0
          ? formatTime(item.schedules[0].end_time)
          : "-",
    },
  ];

  return (
    <>
      <MantineProvider>
        <div className="bg-white flex flex-col w-full h-full rounded-xl">
          <div className="max-w-[500px] p-4">
            <SearchBar
              placeholder="Search"
              data={reservations.map((r) => r.reservation_code)}
              onChange={(value) => {
                setSearchValue(value);
              }}
            />
          </div>

          {!isLoading && reservations.length === 0 ? (
            <NoResults
              heading={"No Reservation found"}
              subheading="We couldn’t find any reservation at the moment."
            />
          ) : (
            <DataTable
              data={reservations.map((r) => ({ ...r, id: r.reservation_id }))}
              gridColumns={gridColumns}
              columns={columns}
              isLoading={isLoading}
              currentPage={currentPage}
              pageCount={pageCount}
              onPrevious={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              onNext={() =>
                setCurrentPage(Math.min(currentPage + 1, pageCount))
              }
              onPage={(page) => setCurrentPage(page)}
              renderActions={() => (
                <Select
                  placeholder="..."
                  data={[]}
                  value={selectValue}
                  onChange={setSelectValue}
                />
              )}
            />
          )}
        </div>
      </MantineProvider>
    </>
  );
};
