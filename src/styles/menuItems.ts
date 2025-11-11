import { FaRegCalendar } from "react-icons/fa";
import { GrCheckboxSelected } from "react-icons/gr";
import { FaRegClock } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { MdOutlineSensorDoor } from "react-icons/md";
import { AiOutlineSound } from "react-icons/ai";
import { LuMail } from "react-icons/lu";
import { MdOutlineDashboard } from "react-icons/md";

import type { IconType } from "react-icons/lib";

export interface MenuItem {
  label: string;
  to: string;
  icon?: IconType;
}

export const getMenuItems = (type: string): MenuItem[] => {
  switch (type) {
    case "ADMIN":
      return [
        {
          label: "Dashboard",
          // ! Fix proper routing
          to: "/",
          icon: MdOutlineDashboard,
        },
        {
          label: "Calendar",
          to: "/calendar",
          icon: FaRegCalendar,
        },
        {
          label: "Reservations",
          to: "/reservations",
          icon: GrCheckboxSelected,
        },
        {
          label: "History",
          to: "/history",
          icon: FaRegClock,
        },
        { label: "Users", to: "/users", icon: FiUsers },
        {
          label: "Rooms",
          to: "/rooms",
          icon: MdOutlineSensorDoor,
        },
        {
          label: "Announcement",
          to: "/announcement",
          icon: AiOutlineSound,
        },
        { label: "Inbox", to: "/inbox", icon: LuMail },
      ];

    case "INSTRUCTOR":
      return [
        { label: "Dashboard", to: "/professor-dashboard" },
        { label: "My Schedule", to: "/calendar" },
      ];

    case "STUDENT":
      return [
        {
          label: "Dashboard",
          // ! Fix proper routing
          to: "/student-dashboard",
          icon: MdOutlineDashboard,
        },
        { label: "Calendar", to: "/calendar", icon: FaRegCalendar },
        { label: "Rooms", to: "/rooms", icon: MdOutlineSensorDoor },
      ];

    default:
      return [];
  }
};
