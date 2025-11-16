import { useGetIdentity } from "@refinedev/core";
import supabase from "../config/supabaseClient";
import { useEffect, useState } from "react";
import { DataTable } from "./../components/table/DataTable";
import type { Reservation } from "../utils/types";

export const StudentDashboard = () => {
  const { isLoading } = useGetIdentity();
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!isLoading) {
        try {
          await getReservations();
        } catch (err) {
          console.error("Failed to fetch reservations:", err);
        }
      }
    };

    fetchReservations();
  }, [isLoading]);

  async function getReservations() {
    const { data, error } = await supabase.rpc("get_reservation");
    if (error) console.error(error);
    setReservations(data);
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
    { header: "Purpose", accessor: "purpose" as keyof Reservation },
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
    { header: "Advisor", accessor: "advisor" as keyof Reservation },
  ];

  return (
    <div>
      <h1>Dashboard</h1>

      <div className="rounded-lg p-6 bg-white flex flex-col gap-4 w-full h-full">
        <DataTable
          data={reservations.map((r) => ({ ...r, id: r.reservation_id }))}
          isLoading={isLoading}
          gridColumns="grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr]"
          emptyMessage="You currently do not have any reservations"
          columns={columns}
        />
      </div>
    </div>
  );
};
