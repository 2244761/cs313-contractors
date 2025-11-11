import { Loader, MantineProvider } from "@mantine/core";
import {
  MdOutlineArrowBackIosNew,
  MdOutlineArrowForwardIos,
} from "react-icons/md";
import { NoResults } from "../NoResults";

// How each column is structured
interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

// Defines the props the table accepts
interface DataTableProps<T> {
  data: T[] | null;
  columns: Column<T>[];
  gridColumns: string;
  isLoading?: boolean;
  currentPage?: number;
  pageCount?: number;
  onPrevious?: () => void;
  onNext?: () => void;
  onPage?: (page: number) => void;
  renderActions?: (item: T) => React.ReactNode;
  emptyMessage?: string;
}
export function DataTable<T>({
  data,
  columns,
  gridColumns,
  isLoading = false,
  currentPage,
  pageCount,
  onPrevious,
  onNext,
  onPage,
  renderActions,
  emptyMessage = "",
}: DataTableProps<T>) {
  // Check if the data is still being loaded
  if (isLoading) {
    return (
      <>
        <MantineProvider>
          <div className="flex justify-center items-center h-[75dvh]">
            <Loader />
          </div>
        </MantineProvider>
      </>
    );
    // If the data is loaded but no value
  } else if (!isLoading && !data) {
    return (
      // ! Temporary h value
      <div className="w-full h-[450px]">
        <NoResults heading={"No Results found"} subheading={emptyMessage} />
      </div>
    );
  }

  return (
    data && (
      <div className="h-full flex flex-col justify-between bg-white p-8 rounded">
        <table className="w-full text-left">
          {/* Maps the Table headers along with its corresponding ids */}
          <thead className="border-b border-[var(--primary-dark)]">
            <tr className={`grid ${gridColumns} items-center py-4`}>
              {columns.map((col, index) => (
                <th key={index} className={col.className}>
                  {col.header}
                </th>
              ))}
              {/* Optional if renderActions are provided */}
              {renderActions && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {data &&
              data.map((item, index) => (
                <tr
                  key={index}
                  className={`grid items-center ${gridColumns} ${
                    index !== data.length - 1 &&
                    "border-b border-[var(--ui-border)]"
                  }`}
                >
                  {columns.map((col, i) => {
                    const value =
                      typeof col.accessor === "function"
                        ? col.accessor(item)
                        : (item[col.accessor] as React.ReactNode);
                    return (
                      <td key={i} className="py-2">
                        {value}
                      </td>
                    );
                  })}
                  {renderActions && (
                    <td className="py-2">{renderActions(item)}</td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>

        {currentPage && pageCount && (
          <div className="flex gap-4 w-full justify-end mt-4">
            <button
              type="button"
              onClick={onPrevious}
              disabled={currentPage === 1}
              className={`${currentPage === 1 ? "text-gray-300" : ""}`}
            >
              <MdOutlineArrowBackIosNew />
            </button>

            <div className="flex gap-4 items-center">
              {currentPage - 1 > 0 && (
                <span
                  className="text-gray-500 cursor-pointer"
                  onClick={() => onPage?.(currentPage - 1)}
                >
                  {currentPage - 1}
                </span>
              )}
              <span className="leading-none w-8 h-8 bg-[var(--primary)] text-[var(--primary-white)] rounded-full flex items-center justify-center">
                {currentPage}
              </span>
              {currentPage + 1 <= pageCount && (
                <span
                  className="text-gray-500 cursor-pointer"
                  onClick={() => onPage?.(currentPage + 1)}
                >
                  {currentPage + 1}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={onNext}
              disabled={currentPage === pageCount}
              className={`${currentPage === pageCount ? "text-gray-300" : ""}`}
            >
              <MdOutlineArrowForwardIos />
            </button>
          </div>
        )}
      </div>
    )
  );
}
