import { useEffect, useState } from "react";
import type { User } from "../../utils/types";
import { useShow } from "@refinedev/core";
import {
  Badge,
  Card,
  Grid,
  Group,
  Loader,
  MantineProvider,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

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

  const getStatusColor = (status: boolean) => (status ? "red" : "green");

  return (
    <MantineProvider>
      <div className="w-full h-full flex flex-col gap-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div>
            <Group>
              <Title order={2} className="text-[var(--primary)]">
                User Details
              </Title>

              <Badge
                size="lg"
                variant="light"
                color={getStatusColor(user?.is_suspended ?? false)}
              >
                {user?.is_suspended ? "Suspended" : "Active"}
              </Badge>
            </Group>

            <Text c="dimmed" size="sm">
              User Id: {user?.identifier && user.identifier !== "N/A"
                ? user.identifier
                : "Not Available"}
            </Text>
          </div>
        </div>

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Card padding="lg" radius="md" withBorder className="flex flex-col gap-4">
              <Title order={4} className="mb-2">
                General Information
              </Title>

              <TextInput
                label="Full Name"
                value={user?.full_name ?? "Undefined"}
                readOnly
                variant="filled"
              />

              <TextInput
                label="Email"
                value={user?.email ?? "Undefined"}
                readOnly
                variant="filled"
              />

              <TextInput
                label="Role"
                value={user?.type ?? "Undefined"}
                readOnly
                variant="filled"
              />

              <TextInput
                label="Status"
                value={user?.is_suspended ? "Suspended" : "Active"}
                readOnly
                variant="filled"
              />
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Card padding="lg" radius="md" withBorder className="flex flex-col items-center gap-4">
              <Title order={4}>Profile Picture</Title>

              <div className="w-40 h-40 rounded-full overflow-hidden border border-gray-300 shadow-sm">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="User Avatar"
                  className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                  No Image
                  </div>
                )}
              </div>
            </Card>
          </Grid.Col>
        </Grid>
      </div>
    </MantineProvider>
  );
};
