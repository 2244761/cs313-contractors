import { Loader, MantineProvider } from "@mantine/core";
import { useParsed, useShow } from "@refinedev/core";
import { useEffect, useState } from "react";
import type { Reservation } from "../../utils/types";

export const ReservationShow = () => {
  const [reservation, setReservation] = useState<Reservation>();

  // Fetch the id from the URL
  const { id } = useParsed();
  const {
    query: { data, isLoading, error },
  } = useShow<Reservation>({
    resource: "admin_reservation",
    id,
  });

  useEffect(() => {
    if (data) setReservation(data.data);
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
      <h1>{reservation?.reservation_code}</h1>
      <p>Full Name: {reservation?.advisor}</p>
    </div>
  );
};
