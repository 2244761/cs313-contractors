import { useList } from "@refinedev/core";

import { IoPersonCircleOutline } from "react-icons/io5";

import { tw } from "../../utils/styles";
import { Dropdown } from "../../components/dropdown/index";
import { SearchBar } from "../../components/searchbar/index";

import { useState } from "react";

export const UserList: React.FC = () => {
  // Dropdown
  const [isOpen, setIsOpen] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setIsOpen(isOpen === id ? null : id);
  };

  // Fetching users from supabase user table
  const { query, result } = useList({
    resource: "user",
  });

  const users = result.data ?? [];

  if (query.isLoading) return <div>Loading List...</div>;
  if (query.isError) return <div>Oh no! Something went wrong! </div>;

  const gridColumns = "grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr]";

  return (
    <div className="rounded-lg p-6 bg-white">
      <SearchBar />
      <table className="w-full text-left">
        <thead>
          <tr className={`grid ${gridColumns} items-center py-4 `}>
            <th>Full Name</th>
            <th>Type</th>
            <th>Identifier</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <hr />
        <tbody>
          {users
            .filter((user) => user.type !== "ADMIN")
            .map((user, index, filteredUsers) => (
              <>
                <tr
                  key={user.id}
                  className={`grid items-center ${gridColumns}`}
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
                      {user.is_suspended === false ? "Active" : "Suspended"}
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
                {index !== filteredUsers.length - 1 && (
                  <hr className="border-[var(--ui-border)]" />
                )}
              </>
            ))}
        </tbody>
      </table>
    </div>
  );
};
