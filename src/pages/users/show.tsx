import { useEffect, useState } from "react";
import type { User } from "../../utils/types";
import { useShow } from "@refinedev/core";
import { Loader, MantineProvider } from "@mantine/core";

export const UserShow = () => {
  const [user, setUser] = useState<User>();

  const {
    query: { data, isLoading, error },
  } = useShow<User>();

  useEffect(() => {
    if (data) setUser(data.data);
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
  return <div>{user?.full_name}</div>;
};
