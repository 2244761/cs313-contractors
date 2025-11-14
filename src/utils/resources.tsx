import type { ResourceProps } from "@refinedev/core";

export const resources: ResourceProps[] = [
  { name: "calendar", list: "/calendar" },
  {
    name: "reservation",
    show: "/reservation/show/:id",
    list: "/reservation",
    create: "/reservation/create",
    edit: "/reservation/edit/:id",
  },
  { name: "history", list: "/history", show: "/history/show/:id" },
  {
    name: "room",
    list: "/room",
    show: "/room/show/:id",
    create: "/room/create",
    edit: "/room/edit/:id",
  },
  {
    name: "user",
    list: "/user",
    show: "/user/show/:id",
    edit: "/user/edit/:id",
  },
  { name: "announcement", list: "/announcement" },
  { name: "inbox", list: "/inbox" },
];
