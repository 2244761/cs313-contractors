// Refine Dev Class
import { useTable } from "@refinedev/core";

// Icons
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { MdOutlineArrowForwardIos } from "react-icons/md";

// Additional styling and components
import { tw } from "../../utils/styles";
import { Dropdown } from "../../components/dropdown/index";
import { NoResults } from "../../components/NoResults";
import { SearchBar } from "../../components/searchbar/SearchBar";
import Loader from "../../components/loader";

// React Import
import { useEffect, useState } from "react";

// Mantine Import
import { MantineProvider } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";

export const UserList: React.FC = () => {
  const gridColumns = "grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr]";

  // Dropdown Selection
  const [isOpen, setIsOpen] = useState<string | null>(null);
  const toggleDropdown = (id: string) => {
    setIsOpen(isOpen === id ? null : id);
  };

  const [searchValue, setSearchValue] = useState<string>("");
  const [debounced] = useDebouncedValue(searchValue, 50);

  const {
    result,
    tableQuery: { isLoading, refetch },
    currentPage,
    setCurrentPage,
    pageCount,
    setFilters,
  } = useTable({
    resource: "user",
    pagination: { currentPage: 1, pageSize: 10 },
    sorters: { initial: [{ field: "id", order: "asc" }] },
    filters: {
      permanent: [
        {
          field: "type",
          operator: "ne",
          value: "ADMIN",
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

  const users = result?.data ?? [];

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
      <div className="flex justify-center items-center h-[75dvh]">
        <Loader />
      </div>
    );
  }

  function isEmpty(myArray: unknown[]): boolean {
    return myArray.length === 0;
  }

  // Pagination
  const onPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const onNext = () => {
    if (currentPage < pageCount) {
      setCurrentPage(currentPage + 1);
    }
  };

  const onPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <MantineProvider>
        <div className="rounded-lg p-6 bg-white flex flex-col gap-4 w-full h-full">
          <div className="max-w-[500px]">
            <SearchBar
              placeholder="Search"
              data={users.map((u) => u.full_name)}
              onChange={(value) => {
                setSearchValue(value);
                refetch();
              }}
            />
          </div>

          {isEmpty(users) ? (
            <NoResults
              heading={"No Users found"}
              subheading="We couldn’t find any users at the moment."
            />
          ) : (
            <div className="h-full flex flex-col justify-between">
              <table className="w-full text-left">
                <thead className="border-b border-[var(--primary-dark)]">
                  <tr className={`grid ${gridColumns} items-center py-4 `}>
                    <th>Full Name</th>
                    <th>Type</th>
                    <th>Identifier</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => {
                    return (
                      <tr
                        key={user.id}
                        className={`grid items-center ${gridColumns} ${
                          index !== users.length - 1 &&
                          "border-b border-[var(--ui-border)]"
                        }`}
                      >
                        <td className="py-3 flex items-center gap-2">
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url}
                              onError={(e) =>
                                (e.currentTarget.style.display = "none")
                              }
                              alt={`${user.full_name}'s avatar`}
                              referrerPolicy="no-referrer"
                              className="w-8 rounded-full"
                            />
                          ) : (
                            // Fallback if the user does not have any avatar_url
                            <IoPersonCircleOutline size={"2rem"} />
                          )}
                          <span>{user.full_name}</span>
                        </td>
                        <td className="py-2 ">{user.type}</td>
                        <td className="py-2">{user.identifier}</td>
                        <td className="py-2">{user.email}</td>
                        <td className="py-2">
                          <div
                            className={`p-1.5 px-4 w-fit ${
                              user.is_suspended === false
                                ? tw.isNotSuspended
                                : tw.isSuspended
                            }`}
                          >
                            {user.is_suspended === false
                              ? "Active"
                              : "Suspended"}
                          </div>
                        </td>
                        <td className="py-2">
                          <Dropdown
                            userId={String(user?.id)}
                            userStatus={user.is_suspended}
                            isOpen={isOpen === user.id}
                            onToggle={toggleDropdown}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="flex gap-4 w-full justify-end">
                <button
                  type="button"
                  onClick={onPrevious}
                  className={`${currentPage - 1 === 0 ? "text-gray-300" : ""}`}
                >
                  <MdOutlineArrowBackIosNew />
                </button>
                <div className="flex gap-4 items-center">
                  {currentPage - 1 > 0 && (
                    <span
                      className={`${
                        currentPage - 1 ? "text-gray-500" : ""
                      } leading-none`}
                      onClick={() => onPage(currentPage - 1)}
                    >
                      {currentPage - 1}
                    </span>
                  )}
                  <span className="leading-none w-8 h-8 bg-[var(--primary)] text-[var(--primary-white)] rounded-full flex items-center justify-center">
                    {currentPage}
                  </span>
                  {currentPage + 1 <= pageCount && (
                    <span
                      className={`${
                        currentPage + 1 ? "text-gray-500" : ""
                      } leading-none`}
                      onClick={() => onPage(currentPage + 1)}
                    >
                      {currentPage + 1}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onNext}
                  className={`${
                    currentPage === pageCount ? "text-gray-300" : ""
                  }`}
                >
                  <MdOutlineArrowForwardIos />
                </button>
              </div>
            </div>
          )}
        </div>
      </MantineProvider>
    </>
  );
};
