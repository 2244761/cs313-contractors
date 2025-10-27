import { useEffect, useRef } from "react";
import { IoIosArrowDown } from "react-icons/io";

interface DropdownProps {
  userId: string;
  isOpen: boolean;
  userStatus: boolean;
  onToggle: (id: string) => void;
}

const handleSuspension = () => {
  console.log("Test");
};

export const Dropdown = ({
  userId,
  isOpen,
  userStatus,
  onToggle,
}: DropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close open tab if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        onToggle("");
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  });

  return (
    <>
      <div ref={dropdownRef} className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(userId);
          }}
          className="inline-flex justify-between items-center w-full border border-gray-300 shadow-sm px-4 py-2 rounded hover:bg-gray-50 focus:outline-none cursor-pointer"
        >
          <span>...</span>
          <IoIosArrowDown />
        </button>
        {isOpen && (
          <div className="absolute bg-white border-gray-300 border border-t-0 rounded-b shadow-lg z-10 w-full">
            <a
              className="block text-left px-4 py-2 text-sm hover:bg-gray-100 w-full"
              onClick={handleSuspension}
            >
              {userStatus === false ? "Suspend User" : "Lift Suspension"}
            </a>
            <a className="block text-left px-4 py-2 text-sm hover:bg-gray-100 w-full">
              Delete User
            </a>
          </div>
        )}
      </div>
    </>
  );
};
