import { useGetIdentity, useLogout } from "@refinedev/core";
import { NavLink } from "react-router";
import { useEffect, useState } from "react";
import supabase from "../../config/supabaseClient";

// React Icons
import { RxExit } from "react-icons/rx";
import { BsLayoutSidebar } from "react-icons/bs";
import { BsLayoutSidebarReverse } from "react-icons/bs";

// Styles
import { tw } from "../../utils/styles";
import { getMenuItems } from "../../utils/menuItems";
import sluLogo from "../../assets/images/slu-logo.png";

export const Menu = () => {
  const [type, setType] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  // Refine dev
  const { data, isLoading } = useGetIdentity();
  const { mutate: logout, isPending } = useLogout();

  // Fetch user type
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

  // Fetch menu items base from user type
  const menuItems = getMenuItems(type);

  return (
    <>
      <nav
        className={`flex flex-col bg-white h-dvh p-4 justify-between duration-200  ${
          isOpen ? tw.sidebar : tw.sidebarOpen
        }`}
      >
        <div className="flex flex-col gap-4 justify-between">
          <div
            className="flex justify-end text-[var(--primary)] cursor-pointer w-"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <BsLayoutSidebarReverse /> : <BsLayoutSidebar />}
          </div>

          <div
            className={`flex items-center transition-all duration-300 ${
              isOpen ? "gap-2" : "gap-0"
            }`}
          >
            <img
              src={sluLogo}
              alt="Saint Louis University Logo"
              className="w-12 flex-shrink-0"
            />
            <h2
              className={` transition-all duration-150 ${
                isOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              Campus Reservation System
            </h2>
          </div>
          <hr className="text-[var(--ui-border)]" />
          <ul className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <li key={item.label}>
                <NavLink
                  to={item.to ?? ""}
                  className={({ isActive }) =>
                    `px-3.5 py-2 rounded-md cursor-pointer flex items-center leading-0 transition-all duration-300
                    ${isOpen ? "gap-x-2" : "gap-x-0"}  
                    ${isActive ? tw.isActiveTab : tw.isNotActiveTab} `
                  }
                >
                  <div className="flex-shrink-0">
                    {item.icon && <item.icon size={"1.25rem"} />}
                  </div>
                  <span
                    className={`transition-all duration-150 ${
                      isOpen ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {item.label}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <button
          disabled={isPending}
          onClick={() => logout()}
          className={`cursor-pointer flex items-center px-3.5 bg-[var(--dark-primary)] py-2 rounded text-white hover:bg-[#333333] transition-all duration-200 ${
            isOpen ? "gap-2" : "gap-0"
          }`}
        >
          <div className="flex-shrink-0">
            <RxExit size={"1.25rem"} />
          </div>
          <span
            className={`transition-all duration-200 leading-0 ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            Logout
          </span>
        </button>
      </nav>
    </>
  );
};
