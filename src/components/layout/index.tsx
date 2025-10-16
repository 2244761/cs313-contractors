import React, { type PropsWithChildren } from "react";
import { Menu } from "../menu";
import { Breadcrumb } from "../breadcrumb";

import { useLogout } from "@refinedev/core";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const { mutate: logout, isPending } = useLogout();

  return (
    <>
      <div className="flex gap-6 w-full h-dvh bg-[#EEEEEE]">
        <div className="layout">
          <Menu />
        </div>
        <div className="content w-full p-8 flex flex-col gap-8">
          <div className="flex justify-between w-full">
            <Breadcrumb />
            <button
              disabled={isPending}
              onClick={() => logout()}
              className="cursor-pointer inline-block bg-[var(--dark-primary)] w-fit p-2 px-8 rounded text-white"
            >
              Sign Out
            </button>
          </div>

          <div>{children}</div>
        </div>
      </div>
    </>
  );
};
