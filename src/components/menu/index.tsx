import { useGetIdentity, useMenu } from "@refinedev/core";
import { NavLink } from "react-router";

import sluLogo from "../../assets/images/slu-logo.png";
import { useEffect, useState } from "react";
import supabase from "../../config/supabaseClient";

export const Menu = () => {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [role, setRole] = useState("");
  const { data, isLoading } = useGetIdentity();
  // const { mutate: logout, isPending } = useLogout();
  const { menuItems } = useMenu();
  useEffect(() => {
    if (!isLoading && data) {
      setLoggedInUser(data?.user.user_metadata?.full_name ?? "Unnamed user...");
    }

    if (isLoading) return;

    if (!data.user?.id) {
      console.log("No user found, redirecting...");
      return;
    }

    async function fetchUser() {
      if (data) {
        const userId = data.user?.id ?? "";
        const { data: userData, error } = await supabase
          .from("users")
          .select("role")
          .eq("id", userId)
          .single();
        if (error) console.error("An error occurred:", error.message);
        setRole(userData?.role);
      }
    }

    fetchUser();
  }, [data, isLoading]);

  //   const getMenuItems = () => {
  //     switch (role) {
  //       case "admin":
  //         return [
  //           { label: "Dashboard", to: "/admin-dashboard" },
  //           { label: "Manage Users", to: "/users" },
  //           { label: "Reservations", to: "/reservations" },
  //         ];
  //       case "professor":
  //         return [
  //           { label: "Dashboard", to: "/professor-dashboard" },
  //           { label: "My Schedule", to: "/calendar" },
  //         ];
  //       case "student":
  //       default:
  //         return [
  //           { label: "Dashboard", to: "/student-dashboard" },
  //           { label: "Reserve Room", to: "/reservations" },
  //           { label: "My Reservations", to: "/calendar" },
  //         ];
  //     }
  //   };

  //   const menuItems = getMenuItems();

  return (
    <>
      <nav className="p-5 flex flex-col gap-4 w-fit h-dvh bg-white">
        <div className="flex items-center gap-2">
          <img
            src={sluLogo}
            alt="Saint Louis University Logo"
            className="w-12"
          />
          <h2>Campus Reservation System</h2>
        </div>
        <div className="font-bold">{loggedInUser}</div>
        <hr className="text-[var(--ui-border)]" />
        <ul className="flex flex-col gap-4 w-fit">
          {menuItems.map((item) => (
            <li
              key={item.key}
              className="text-[var(--dark-secondary)] hover:text-[var(--primary)] hover:font-semibold duration-200"
            >
              <NavLink to={item.route ?? ""}>{item.label}</NavLink>
            </li>
          ))}
        </ul>
        {/* <button
          disabled={isPending}
          onClick={() => logout()}
          className="cursor-pointer inline-block bg-amber-400 w-fit p-2 px-8 rounded-2xl"
        >
          Logout
        </button> */}
      </nav>
    </>
  );
};
