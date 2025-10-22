import { useGetIdentity, useLogout } from "@refinedev/core";
import { NavLink } from "react-router";

import sluLogo from "../../assets/images/slu-logo.png";
import { useEffect, useState } from "react";
import supabase from "../../config/supabaseClient";

import { RxExit } from "react-icons/rx";

// import { BsLayoutSidebarReverse } from "react-icons/bs";

export const Menu = () => {
  const [type, setType] = useState("");
  const { data, isLoading } = useGetIdentity();
  const { mutate: logout, isPending } = useLogout();
  useEffect(() => {
    if (isLoading) return;

    if (!data.user?.id) {
      console.log("No user found, redirecting...");
      return;
    }

    async function fetchUser() {
      if (data) {
        const userId = data.user?.id ?? "";
        const { data: userData, error } = await supabase
          .from("user")
          .select("type")
          .eq("id", userId)
          .single();
        if (error) console.error("An error occurred:", error.message);
        setType(userData?.type);
      }
    }

    fetchUser();
  }, [data, isLoading]);

  const getMenuItems = () => {
    switch (type) {
      case "ADMIN":
        return [
          { label: "Dashboard", to: "/admin-dashboard" },
          { label: "Manage Users", to: "/users" },
          { label: "Reservations", to: "/reservations" },
        ];
      case "INSTRUCTOR":
        return [
          { label: "Dashboard", to: "/professor-dashboard" },
          { label: "My Schedule", to: "/calendar" },
        ];
      case "STUDENT":
      default:
        return [
          { label: "Dashboard", to: "/student-dashboard" },
          { label: "Reserve Room", to: "/reservations" },
          { label: "My Reservations", to: "/calendar" },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      <nav className="flex flex-col bg-white h-dvh w-fit p-4 justify-between">
        <div className="flex flex-col gap-4 justify-between">
          <div className="flex items-center gap-2">
            <img
              src={sluLogo}
              alt="Saint Louis University Logo"
              className="w-12"
            />
            <h2>Campus Reservation System</h2>
          </div>
          <hr className="text-[var(--ui-border)]" />
          <ul className="flex flex-col gap-4 w-fit">
            {menuItems.map((item) => (
              <li
                key={item.label}
                className="text-[var(--dark-secondary)] hover:text-[var(--primary)] hover:font-semibold duration-200"
              >
                <NavLink to={item.to ?? ""}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </div>

        <button
          disabled={isPending}
          onClick={() => logout()}
          className="cursor-pointer flex items-center gap-4 justify-center bg-[var(--dark-primary)] w-full py-2 rounded text-white"
        >
          <RxExit /> Logout
          {/* <BsLayoutSidebarReverse /> */}
        </button>
      </nav>
    </>
  );
};
