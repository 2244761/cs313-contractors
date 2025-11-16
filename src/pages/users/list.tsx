// Refine Dev Class
import { useTable } from "@refinedev/core";

// Icons
import { IoPersonCircleOutline } from "react-icons/io5";

// Additional styling and components
import { tw } from "../../utils/styles/styles";
import { NoResults } from "../../components/NoResults";
import { SearchBar } from "../../components/SearchBar";

// React Import
import { useEffect, useState } from "react";

// Mantine Import
import { Loader, MantineProvider, Select } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { DataTable } from "../../components/table/DataTable";
import type { User } from "../../utils/types/index";

export const UserList: React.FC = () => {
  const gridColumns = "grid-cols-[2fr_1fr_1fr_1.5fr_1fr_1fr]";

  const [searchValue, setSearchValue] = useState<string>("");
  const [debounced] = useDebouncedValue(searchValue, 50);
  const [selectValue, setSelectValue] = useState<string | null>("");
  const [users, setUsers] = useState<User[]>([]);

  const {
    result,
    tableQuery: { isLoading, refetch },
    currentPage,
    setCurrentPage,
    pageCount,
    setFilters,
  } = useTable<User>({
    resource: "user",
    pagination: { currentPage: 1, pageSize: 10 },
    sorters: { initial: [{ field: "id", order: "asc" }] },
    filters: {
      permanent: [
        {
          field: "type",
          operator: "ne",
          value: "Admin",
        },
      ],
      initial: [
        {
          field: "full_name",
          operator: "contains",
          value: "",
        },
      ],
    },
    queryOptions: {
      enabled: true,
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60,
    },
  });

  useEffect(() => {
    if (result) setUsers(result.data);
  }, [result]);

  useEffect(() => {
    setFilters([
      {
        field: "full_name",
        operator: "contains",
        value: debounced,
      },
    ]);
    refetch();
  }, [debounced]);

  // Fetching Data
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
      header: "Full Name",
      accessor: (user: User) => (
        <div className="flex items-center gap-2">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              onError={(e) => (e.currentTarget.style.display = "none")}
              alt={`${user.full_name}'s avatar`}
              referrerPolicy="no-referrer"
              className="w-8 rounded-full"
            />
          ) : (
            <IoPersonCircleOutline size="2rem" />
          )}
          <span>{user.full_name}</span>
        </div>
      ),
    },
    { header: "Type", accessor: "type" as keyof User },
    { header: "Identifier", accessor: "identifier" as keyof User },
    { header: "Email", accessor: "email" as keyof User },
    {
      header: "Status",
      accessor: (user: User) => (
        <div
          className={`p-1.5 px-4 w-fit ${
            user.is_suspended === false ? tw.isNotSuspended : tw.isSuspended
          }`}
        >
          {user.is_suspended === false ? "Active" : "Suspended"}
        </div>
      ),
    },
  ];
  return (
    <>
      <MantineProvider>
        <div className="bg-white flex flex-col w-full h-full rounded-xl">
          <div className="max-w-[500px] p-4">
            <SearchBar
              placeholder="Search"
              data={users.map((u) => u.full_name)}
              onChange={(value) => {
                setSearchValue(value);
                refetch();
              }}
            />
          </div>

          {users.length === 0 ? (
            <NoResults
              heading={"No Users found"}
              subheading="We couldn’t find any users at the moment."
            />
          ) : (
            <DataTable
              data={users}
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
