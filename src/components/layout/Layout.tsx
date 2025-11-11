import React, { type PropsWithChildren } from "react";
import { Menu } from "./Menu";
import { Breadcrumb } from "./Breadcrumb";
import { UserInfo } from "../UserInfo";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <div className="flex gap-6 w-full h-dvh bg-[#EEEEEE]">
        <div className="layout">
          <Menu />
        </div>
        <div className="content w-full h-full p-8 flex flex-col gap-8">
          <div className="flex justify-between w-full items-center">
            <Breadcrumb />
            <UserInfo />
          </div>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </>
  );
};
