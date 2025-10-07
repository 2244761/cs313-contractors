// import React, { useEffect } from "react";
// import supabase from "../config/supabaseClient";
// import { useNavigate } from "react-router";

import { useLogout } from "@refinedev/core";

export const AdminDashboard = () => {
  const { mutate: logout, isPending } = useLogout();

  return (
    <>
      <div>AdminDashboard</div>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
        onClick={() => logout()}
        disabled={isPending}
      >
        Click me
      </button>
    </>
  );
};
