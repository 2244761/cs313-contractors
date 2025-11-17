// Refine Dev Class
import { useTable } from "@refinedev/core";

// React Import
import { useEffect, useState } from "react";

// Mantine Import
import { Loader, MantineProvider, Select } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { DataTable } from "../../components/table/DataTable";
import type { Reservation } from "../../utils/types";
import { Search } from "../../components/Search";
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
    resource: "admin_reservation",
    pagination: { currentPage: 1, pageSize: 10 },
    sorters: { initial: [{ field: "id", order: "asc" }] },
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

  // Fetching Data
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
      action: (
        <Search
          placeholder="Search reservations"
          data={reservations.map((r) => r.reservation_code)}
          onChange={(value) => setSearchValue(value)}
          value={searchValue}
        />
      ),
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
        <div className="bg-white flex flex-col w-full rounded-xl">
          <DataTable
            data={reservations}
            gridColumns={gridColumns}
            columns={columns}
            isLoading={isLoading}
            currentPage={currentPage}
            pageCount={pageCount}
            onPrevious={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            onNext={() => setCurrentPage(Math.min(currentPage + 1, pageCount))}
            onPage={(page) => setCurrentPage(page)}
            renderActions={() => (
              <Select
                placeholder="..."
                data={[]}
                value={selectValue}
                onChange={setSelectValue}
              />
            )}
            emptyMessage="We couldn’t find any reservation at the moment."
          />
        </div>
      </MantineProvider>
    </>
  );
};
